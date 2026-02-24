#!/usr/bin/env node
import "source-map-support/register";
import { config } from "dotenv";
import { resolve } from "path";
import * as cdk from "aws-cdk-lib";
import { MessagingStack } from "../lib/messaging-stack";

// Load .env from the app root (apps/messaging/.env) so CDK picks up
// SES_FROM_ADDRESS, CDK_DEFAULT_ACCOUNT, CDK_DEFAULT_REGION, etc.
config({ path: resolve(__dirname, "../../.env") });

const app = new cdk.App();

const prefix = process.env.STACK_PREFIX ?? "discolaire";
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT ?? process.env.AWS_ACCOUNT_ID,
  region: process.env.CDK_DEFAULT_REGION ?? process.env.AWS_REGION ?? "us-east-1",
};

new MessagingStack(app, `${prefix}-messaging`, {
  env,
  stackName: `${prefix}-messaging`,
  description: "Discolaire bulk email delivery: SQS + Lambda + SES",
  prefix,
  sesFromAddress: process.env.SES_FROM_ADDRESS ?? "",
  sesRegion: env.region as string,
});
