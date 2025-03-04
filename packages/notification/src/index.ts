/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Novu } from "@novu/node";
import { nanoid } from "nanoid";

import { env } from "./env";

const novu = new Novu(env.NOVU_API_KEY);

const API_ENDPOINT = "https://api.novu.co/v1";

export enum TriggerEvents {
  TransactionNewInApp = "transaction_new_in_app",
  TransactionsNewInApp = "transactions_new_in_app",
  TransactionNewEmail = "transaction_new_email",
  InboxNewInApp = "inbox_new_in_app",
  MatchNewInApp = "match_in_app",
  InvoicePaidInApp = "invoice_paid_in_app",
  InvoicePaidEmail = "invoice_paid_email",
  InvoiceOverdueInApp = "invoice_overdue_in_app",
  InvoiceOverdueEmail = "invoice_overdue_email",
}

export enum NotificationTypes {
  Transaction = "transaction",
  Transactions = "transactions",
  Inbox = "inbox",
  Match = "match",
  Invoice = "invoice",
}

interface TriggerUser {
  subscriberId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  schoolId: string;
}

interface TriggerPayload {
  name: TriggerEvents;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
  user: TriggerUser;
  replyTo?: string;
  tenant?: string; // NOTE: Currently no way to listen for messages with tenant, we use team_id + user_id for unique
}

export async function trigger(data: TriggerPayload) {
  try {
    await novu.trigger(data.name, {
      to: {
        ...data.user,
        //   Prefix subscriber id with team id
        subscriberId: `${data.user.schoolId}_${data.user.subscriberId}`,
      },

      payload: data.payload,
      tenant: data.tenant,
      overrides: {
        email: {
          replyTo: data.replyTo,

          headers: {
            "X-Entity-Ref-ID": nanoid(),
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function triggerBulk(events: TriggerPayload[]) {
  try {
    await novu.bulkTrigger(
      events.map((data) => ({
        name: data.name,
        to: {
          ...data.user,
          //   Prefix subscriber id with team id
          subscriberId: `${data.user.schoolId}_${data.user.subscriberId}`,
        },
        payload: data.payload,
        tenant: data.tenant,
        overrides: {
          email: {
            replyTo: data.replyTo,
            headers: {
              "X-Entity-Ref-ID": nanoid(),
            },
          },
        },
      })),
    );
  } catch (error) {
    console.log(error);
  }
}

interface GetSubscriberPreferencesParams {
  schoolId: string;
  subscriberId: string;
}

export async function getSubscriberPreferences({
  subscriberId,
  schoolId,
}: GetSubscriberPreferencesParams) {
  const response = await fetch(
    `${API_ENDPOINT}/subscribers/${schoolId}_${subscriberId}/preferences?includeInactiveChannels=false`,
    {
      method: "GET",
      headers: {
        Authorization: `ApiKey ${env.NOVU_API_KEY}`,
      },
    },
  );

  return response.json();
}

interface UpdateSubscriberPreferenceParams {
  subscriberId: string;
  schoolId: string;
  templateId: string;
  type: string;
  enabled: boolean;
}

export async function updateSubscriberPreference({
  subscriberId,
  schoolId,
  templateId,
  type,
  enabled,
}: UpdateSubscriberPreferenceParams) {
  const response = await fetch(
    `${API_ENDPOINT}/subscribers/${schoolId}_${subscriberId}/preferences/${templateId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `ApiKey ${env.NOVU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: {
          type,
          enabled,
        },
      }),
    },
  );

  return response.json();
}
