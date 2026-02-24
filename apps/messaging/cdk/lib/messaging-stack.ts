import * as path from "path";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as snsSubscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import type { Construct } from "constructs";

export interface MessagingStackProps extends cdk.StackProps {
  /** Resource name prefix (default: "discolaire") */
  prefix: string;
  /** Verified SES sender address (must be verified in SES console) */
  sesFromAddress: string;
  /** AWS region where SES sends from (defaults to stack region) */
  sesRegion: string;
}

export class MessagingStack extends cdk.Stack {
  /** Queue URL output – copy into SQS_EMAIL_QUEUE_URL env var */
  public readonly queueUrl: cdk.CfnOutput;
  /** Queue ARN output */
  public readonly queueArn: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props: MessagingStackProps) {
    super(scope, id, props);

    const { prefix, sesFromAddress, sesRegion } = props;

    // ── Dead-letter queue ───────────────────────────────────────────────────
    const dlq = new sqs.Queue(this, "EmailDLQ", {
      queueName: `${prefix}-email-dlq`,
      retentionPeriod: cdk.Duration.days(14),
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });

    // ── Main email queue ────────────────────────────────────────────────────
    // visibilityTimeout must be >= Lambda timeout (300 s) to avoid
    // re-processing a message that is still being worked on.
    const emailQueue = new sqs.Queue(this, "EmailQueue", {
      queueName: `${prefix}-email-queue`,
      visibilityTimeout: cdk.Duration.seconds(310),
      retentionPeriod: cdk.Duration.days(4),
      encryption: sqs.QueueEncryption.SQS_MANAGED,
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 3, // after 3 failures → DLQ
      },
    });

    // ── DynamoDB idempotency table ──────────────────────────────────────────
    const idempotencyTable = new dynamodb.Table(this, "IdempotencyTable", {
      tableName: `${prefix}-email-idempotency`,
      partitionKey: { name: "messageId", type: dynamodb.AttributeType.STRING },
      timeToLiveAttribute: "expiresAt",
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: false,
      },
    });

    // ── CloudWatch log group ────────────────────────────────────────────────
    const consumerLogGroup = new logs.LogGroup(this, "ConsumerLogGroup", {
      logGroupName: `/aws/lambda/${prefix}-email-consumer`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ── SQS consumer Lambda ─────────────────────────────────────────────────
    // NodejsFunction bundles src/lambda/consumer.ts with esbuild automatically.
    // Throughput is throttled via SqsEventSource.maxConcurrency (see below)
    // rather than reservedConcurrentExecutions, which would consume from the
    // account's unreserved concurrency pool and fail on low-quota accounts.
    const consumerFn = new NodejsFunction(this, "EmailConsumer", {
      functionName: `${prefix}-email-consumer`,
      entry: path.resolve(__dirname, "../../src/lambda/consumer.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(300),
      memorySize: 256,
      logGroup: consumerLogGroup,
      bundling: {
        format: OutputFormat.CJS,
        minify: true,
        sourceMap: true,
        target: "node22",
        // Keep aws-sdk out of the bundle: Lambda Node 22 includes AWS SDK v3.
        externalModules: [
          "@aws-sdk/client-ses",
          "@aws-sdk/client-dynamodb",
          "@aws-sdk/lib-dynamodb",
        ],
      },
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
        IDEMPOTENCY_TABLE: idempotencyTable.tableName,
        SES_FROM_ADDRESS: sesFromAddress,
        SES_REGION: sesRegion,
      },
    });

    // Trigger Lambda from SQS with partial-batch failure support.
    // maxConcurrency limits how many Lambda instances this SQS trigger can
    // scale to simultaneously. AWS minimum is 2; this is the preferred way
    // to throttle SES sending rate without touching the account's reserved
    // concurrency pool (which avoids the "below minimum of 10" deploy error).
    consumerFn.addEventSource(
      new SqsEventSource(emailQueue, {
        batchSize: 10,
        maxBatchingWindow: cdk.Duration.seconds(5),
        reportBatchItemFailures: true,
        maxConcurrency: 2,
      }),
    );

    // Grant DynamoDB read/write access to the consumer.
    idempotencyTable.grantReadWriteData(consumerFn);

    // Grant SES send permissions.
    consumerFn.addToRolePolicy(
      new iam.PolicyStatement({
        sid: "AllowSESSend",
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: ["*"],
      }),
    );

    // ── SNS topics for SES bounce / complaint notifications (stub) ──────────
    // To activate:
    //   1. In the SES console (or via CDK SES construct), configure the
    //      verified identity to publish bounces/complaints to these topics.
    //   2. Implement the TODOs in src/lambda/notifications.ts.

    const bounceTopic = new sns.Topic(this, "BounceTopic", {
      topicName: `${prefix}-ses-bounces`,
      displayName: "SES Bounce Notifications",
    });

    const complaintTopic = new sns.Topic(this, "ComplaintTopic", {
      topicName: `${prefix}-ses-complaints`,
      displayName: "SES Complaint Notifications",
    });

    const notificationsLogGroup = new logs.LogGroup(
      this,
      "NotificationsLogGroup",
      {
        logGroupName: `/aws/lambda/${prefix}-ses-notifications`,
        retention: logs.RetentionDays.ONE_MONTH,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    const notificationsFn = new NodejsFunction(this, "NotificationsHandler", {
      functionName: `${prefix}-ses-notifications`,
      entry: path.resolve(__dirname, "../../src/lambda/notifications.ts"),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,
      logGroup: notificationsLogGroup,
      bundling: {
        format: OutputFormat.CJS,
        minify: true,
        target: "node22",
      },
    });

    bounceTopic.addSubscription(
      new snsSubscriptions.LambdaSubscription(notificationsFn),
    );
    complaintTopic.addSubscription(
      new snsSubscriptions.LambdaSubscription(notificationsFn),
    );

    // ── CloudFormation outputs ──────────────────────────────────────────────
    this.queueUrl = new cdk.CfnOutput(this, "QueueUrl", {
      value: emailQueue.queueUrl,
      description: "Set as SQS_EMAIL_QUEUE_URL in apps/frontend/.env",
      exportName: `${prefix}-email-queue-url`,
    });

    this.queueArn = new cdk.CfnOutput(this, "QueueArn", {
      value: emailQueue.queueArn,
      exportName: `${prefix}-email-queue-arn`,
    });

    new cdk.CfnOutput(this, "DLQUrl", {
      value: dlq.queueUrl,
      description: "Dead-letter queue – inspect here for permanently failed emails",
    });

    new cdk.CfnOutput(this, "BounceTopicArn", {
      value: bounceTopic.topicArn,
      description: "Configure in SES Verified Identity → Notifications → Bounces",
      exportName: `${prefix}-ses-bounce-topic-arn`,
    });

    new cdk.CfnOutput(this, "ComplaintTopicArn", {
      value: complaintTopic.topicArn,
      description: "Configure in SES Verified Identity → Notifications → Complaints",
      exportName: `${prefix}-ses-complaint-topic-arn`,
    });

    new cdk.CfnOutput(this, "IdempotencyTableName", {
      value: idempotencyTable.tableName,
    });

    // ── Tags ────────────────────────────────────────────────────────────────
    cdk.Tags.of(this).add("app", prefix);
    cdk.Tags.of(this).add("component", "messaging");
    cdk.Tags.of(this).add("managed-by", "aws-cdk");
  }
}
