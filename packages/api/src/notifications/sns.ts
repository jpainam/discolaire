import type { PinpointSMSVoiceV2ClientConfig } from "@aws-sdk/client-pinpoint-sms-voice-v2";
import {
  MessageType,
  PinpointSMSVoiceV2Client,
  SendTextMessageCommand,
} from "@aws-sdk/client-pinpoint-sms-voice-v2";
import {
  CheckIfPhoneNumberIsOptedOutCommand,
  SNSClient,
} from "@aws-sdk/client-sns";

import { env } from "../env";

const snsClient = new SNSClient({
  region: env.SNS_REGION,
});

export const checkIfPhoneNumberIsOptedOut = async (
  phoneNumber = "5555555555",
) => {
  const command = new CheckIfPhoneNumberIsOptedOutCommand({
    phoneNumber,
  });
  const response = await snsClient.send(command);
  return response.isOptedOut;
  // {
  //   '$metadata': {
  //     httpStatusCode: 200,
  //     requestId: '3341c28a-cdc8-5b39-a3ee-9fb0ee125732',
  //     extendedRequestId: undefined,
  //     cfId: undefined,
  //     attempts: 1,
  //     totalRetryDelay: 0
  //   },
  //   isOptedOut: false
  // }
};

export async function sendSmsSns(opts: { toPhone: string; bodyText: string }) {
  const config: PinpointSMSVoiceV2ClientConfig = {
    region: env.SNS_REGION,
  };
  const client = new PinpointSMSVoiceV2Client(config);
  const body = {
    DestinationPhoneNumber: opts.toPhone,
    OriginationIdentity: "STRING_VALUE",
    MessageBody: "STRING_VALUE",
    MessageType: MessageType.PROMOTIONAL,
    DryRun: true,
    MessageFeedbackEnabled: true,
  };
  const command = new SendTextMessageCommand(body);
  const data = await client.send(command);

  return {
    provider: "SNS",
    providerMsgId: data.MessageId ?? "unknown",
  };
}
