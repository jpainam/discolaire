# @repo/messaging — Bulk Email Service

Transactional and bulk email delivery for Discolaire using **AWS SES + SQS + Lambda**.

## Architecture

```
Next.js / tRPC (packages/api)
        │
        │  trpc.sesEmail.enqueue.mutate({ jobs })
        ▼
┌─────────────────────────┐
│  SQS Email Queue        │  Standard queue, 4-day retention
│  (discolaire-email-     │  visibilityTimeout = 310 s
│   queue)                │
└──────────┬──────────────┘
           │  SQS trigger (batch 10, reportBatchItemFailures)
           ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│  Lambda: consumer.ts    │────▶│  DynamoDB: idempotency      │
│  reservedConcurrency=1  │     │  (discolaire-email-         │
│  timeout = 300 s        │     │   idempotency, TTL 48 h)    │
└──────────┬──────────────┘     └─────────────────────────────┘
           │  SendEmailCommand
           ▼
┌─────────────────────────┐
│  AWS SES                │
│  (verified domain/addr) │
└──────────┬──────────────┘
           │ bounce / complaint events
           ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│  SNS: ses-bounces       │────▶│  Lambda: notifications.ts   │
│  SNS: ses-complaints    │     │  (TODO: suppression list)   │
└─────────────────────────┘     └─────────────────────────────┘

On failure (after 3 retries):
           │
           ▼
┌─────────────────────────┐
│  SQS DLQ                │  14-day retention, inspect manually
│  (discolaire-email-dlq) │
└─────────────────────────┘
```

### Throttling

`maxConcurrency: 2` on the SQS event source limits the consumer Lambda to
**at most 2 concurrent invocations** triggered by this queue. Combined with
`batchSize = 10`, the sustained send rate is ≈ 20 emails per execution cycle.

This approach is preferred over `reservedConcurrentExecutions` because it
does **not** consume from the account's unreserved concurrency pool, which
avoids deployment failures on accounts with low concurrency limits (the
"UnreservedConcurrentExecution below minimum of 10" error).

To increase throughput, raise `maxConcurrency` (up to 1000) in
`cdk/lib/messaging-stack.ts`. To decrease it further, the AWS minimum is 2.

---

## Prerequisites

- Node.js ≥ 22, pnpm ≥ 10
- AWS CLI configured (`aws configure` or `AWS_PROFILE`)
- CDK bootstrapped in your account/region:
  ```sh
  npx cdk bootstrap aws://ACCOUNT_ID/REGION
  ```

---

## SES Setup

### 1. Verify your sender domain (recommended over single address)

1. In the [SES console](https://console.aws.amazon.com/ses/) → **Verified identities** → **Create identity**.
2. Choose **Domain**, enter your domain (e.g. `yourdomain.com`).
3. SES generates DKIM CNAME records — add them to your DNS provider.
4. Add an SPF TXT record:
   ```
   "v=spf1 include:amazonses.com ~all"
   ```
5. Optionally configure DMARC:
   ```
   "_dmarc.yourdomain.com TXT v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
   ```
6. Wait for the domain status to become **Verified**.

### 2. Move out of the SES sandbox

By default, new AWS accounts are in the **SES sandbox** (can only send to
verified addresses, max 200/day). To send to arbitrary recipients:

1. SES console → **Account dashboard** → **Request production access**.
2. Fill in the use-case form (school communications is a standard use case).
3. Approval typically takes 24 h.

### 3. Configure bounce / complaint notifications

After deploying the CDK stack, you'll see `BounceTopicArn` and
`ComplaintTopicArn` in the outputs.

1. SES console → **Verified identities** → select your domain.
2. **Notifications** tab → edit:
   - **Bounces** → select the `discolaire-ses-bounces` SNS topic.
   - **Complaints** → select the `discolaire-ses-complaints` SNS topic.
3. Implement the TODOs in `src/lambda/notifications.ts` to persist suppressed
   addresses to your database.

---

## Deploy Manually

```sh
# 1. Install dependencies
pnpm install

# 2. Copy and fill in environment variables
cp apps/messaging/.env.example .env
# Edit .env: set SES_FROM_ADDRESS, CDK_DEFAULT_ACCOUNT, CDK_DEFAULT_REGION

# 3. Preview the CloudFormation changeset
pnpm --filter @repo/messaging cdk:diff

# 4. Deploy
pnpm --filter @repo/messaging cdk:deploy

# 5. Copy the QueueUrl output into your frontend .env:
#    SQS_EMAIL_QUEUE_URL=https://sqs.REGION.amazonaws.com/ACCOUNT/discolaire-email-queue
```

---

## Deploy via GitHub Push (OIDC, no long-lived keys)

### 1. Create the GitHub OIDC provider in AWS (once per account)

```sh
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### 2. Create the deployment IAM role

Create a role with the following **trust policy** (replace placeholders):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_ORG/discolaire:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

> Change `ref:refs/heads/main` to `ref:refs/heads/*` to allow all branches,
> or add multiple statements for different branches.

### 3. Attach permissions to the role

Replace `ACCOUNT_ID` and `REGION` throughout. The CDK bootstrap qualifier
(`hnb659fds`) is the default — if you bootstrapped with a custom qualifier,
adjust accordingly.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFormation",
      "Effect": "Allow",
      "Action": ["cloudformation:*"],
      "Resource": [
        "arn:aws:cloudformation:REGION:ACCOUNT_ID:stack/discolaire-messaging/*",
        "arn:aws:cloudformation:REGION:ACCOUNT_ID:stack/CDKToolkit/*"
      ]
    },
    {
      "Sid": "IAMForCDKRoles",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole", "iam:DeleteRole", "iam:GetRole",
        "iam:AttachRolePolicy", "iam:DetachRolePolicy",
        "iam:PutRolePolicy", "iam:DeleteRolePolicy",
        "iam:PassRole", "iam:TagRole", "iam:UntagRole",
        "iam:GetRolePolicy"
      ],
      "Resource": [
        "arn:aws:iam::ACCOUNT_ID:role/discolaire-messaging-*",
        "arn:aws:iam::ACCOUNT_ID:role/cdk-hnb659fds-*"
      ]
    },
    {
      "Sid": "Lambda",
      "Effect": "Allow",
      "Action": ["lambda:*"],
      "Resource": [
        "arn:aws:lambda:REGION:ACCOUNT_ID:function:discolaire-email-consumer",
        "arn:aws:lambda:REGION:ACCOUNT_ID:function:discolaire-ses-notifications"
      ]
    },
    {
      "Sid": "SQS",
      "Effect": "Allow",
      "Action": ["sqs:*"],
      "Resource": [
        "arn:aws:sqs:REGION:ACCOUNT_ID:discolaire-email-queue",
        "arn:aws:sqs:REGION:ACCOUNT_ID:discolaire-email-dlq"
      ]
    },
    {
      "Sid": "DynamoDB",
      "Effect": "Allow",
      "Action": ["dynamodb:*"],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/discolaire-email-idempotency"
    },
    {
      "Sid": "SNS",
      "Effect": "Allow",
      "Action": ["sns:*"],
      "Resource": [
        "arn:aws:sns:REGION:ACCOUNT_ID:discolaire-ses-bounces",
        "arn:aws:sns:REGION:ACCOUNT_ID:discolaire-ses-complaints"
      ]
    },
    {
      "Sid": "CloudWatchLogs",
      "Effect": "Allow",
      "Action": ["logs:*"],
      "Resource": [
        "arn:aws:logs:REGION:ACCOUNT_ID:log-group:/aws/lambda/discolaire-email-consumer:*",
        "arn:aws:logs:REGION:ACCOUNT_ID:log-group:/aws/lambda/discolaire-ses-notifications:*"
      ]
    },
    {
      "Sid": "CDKBootstrapS3",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:ListBucket", "s3:DeleteObject"],
      "Resource": [
        "arn:aws:s3:::cdk-hnb659fds-assets-ACCOUNT_ID-REGION",
        "arn:aws:s3:::cdk-hnb659fds-assets-ACCOUNT_ID-REGION/*"
      ]
    },
    {
      "Sid": "CDKBootstrapECR",
      "Effect": "Allow",
      "Action": ["ecr:*"],
      "Resource": "arn:aws:ecr:REGION:ACCOUNT_ID:repository/cdk-hnb659fds-container-assets-ACCOUNT_ID-REGION"
    },
    {
      "Sid": "CDKBootstrapSSM",
      "Effect": "Allow",
      "Action": ["ssm:GetParameter"],
      "Resource": "arn:aws:ssm:REGION:ACCOUNT_ID:parameter/cdk-bootstrap/hnb659fds/version"
    }
  ]
}
```

> **Tip:** If you changed `STACK_PREFIX` from `discolaire`, update the resource
> names above accordingly (e.g. `myschool-email-queue`).

### 4. Configure GitHub repository variables / secrets

| Name | Type | Value |
|------|------|-------|
| `AWS_DEPLOY_ROLE_ARN` | Secret | `arn:aws:iam::ACCOUNT_ID:role/discolaire-github-deploy` |
| `AWS_ACCOUNT_ID` | Secret | your 12-digit AWS account ID |
| `AWS_REGION` | Variable | e.g. `us-east-1` |
| `SES_FROM_ADDRESS` | Variable | e.g. `no-reply@yourdomain.com` |

### 5. Push to `main`

The workflow at `.github/workflows/messaging-deploy.yml` will:

1. Install dependencies.
2. Run `pnpm test` (Vitest unit tests).
3. Run `cdk deploy` using the OIDC role.

---

## How Next.js Calls Enqueue

From a tRPC mutation in a server action or route handler:

```ts
// In any Next.js Server Component / Server Action / API route:
import { createCaller } from "@repo/api";
// or from a tRPC client in a React component:

// ── via tRPC client (React component) ─────────────────────────────────────
const utils = api.useUtils();

const sendReminders = async () => {
  const { messageIds } = await utils.client.sesEmail.enqueue.mutate({
    jobs: [
      {
        to: "parent@example.com",
        subject: "Fee reminder – Q2",
        html: "<p>Your payment of <strong>$150</strong> is due on Jan 31.</p>",
        text: "Your payment of $150 is due on Jan 31.",
        idempotencyKey: `fee-reminder-${studentId}-q2-2025`,
        tags: { tenant: "my-school", type: "fee-reminder" },
      },
    ],
  });
  console.log("Enqueued:", messageIds);
};

// ── via server-side caller (Server Action / tRPC server) ──────────────────
import { createCaller } from "@repo/api";

const caller = createCaller(ctx);
const result = await caller.sesEmail.enqueue({
  jobs: [{ to: "...", subject: "...", html: "..." }],
});
```

---

## Local Development

The Lambda does not run locally. To test end-to-end locally:

1. Use [LocalStack](https://localstack.cloud/) to emulate SQS/DynamoDB/SES, or
2. Deploy a `dev` CDK stack to a real AWS account and point your `.env` there.

For unit tests only (no AWS needed):

```sh
pnpm --filter @repo/messaging test
```

---

## File Structure

```
apps/messaging/
├── cdk/
│   ├── bin/app.ts               CDK app entry point
│   └── lib/messaging-stack.ts   All AWS infrastructure
├── src/
│   ├── schemas.ts               Shared Zod schema (EmailJob)
│   ├── client/
│   │   └── index.ts             enqueueEmailJobs() — imported by packages/api
│   └── lambda/
│       ├── consumer.ts          SQS → SES Lambda handler
│       └── notifications.ts     SNS bounce/complaint handler (stub)
├── tests/
│   └── schemas.test.ts          Vitest unit tests
├── .env.example
├── cdk.json
├── package.json
├── tsconfig.json
└── tsconfig.cdk.json
```

Read dead-letter-queue
```
aws logs filter-log-events \
  --log-group-name "/aws/lambda/discolaire-email-consumer" \
  --region eu-central-1 \
  --filter-pattern "ERROR" \
  --start-time $(date -v-1H +%s000)
  ```