import { z } from "zod/v4";

// Shared base
const baseMessageSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
});

// Text message
export const textMessageSchema = baseMessageSchema.extend({
  type: z.literal("text"),
  text: z.object({
    body: z.string(),
  }),
});

// Image message
export const imageMessageSchema = baseMessageSchema.extend({
  type: z.literal("image"),
  image: z.object({
    caption: z.string().optional(),
    mime_type: z.string().optional(),
    sha256: z.string().optional(),
    id: z.string(),
  }),
});

// Document message
export const documentMessageSchema = baseMessageSchema.extend({
  type: z.literal("document"),
  document: z.object({
    caption: z.string().optional(),
    filename: z.string().optional(),
    mime_type: z.string().optional(),
    sha256: z.string().optional(),
    id: z.string(),
  }),
});

// Reaction message
export const reactionMessageSchema = baseMessageSchema.extend({
  type: z.literal("reaction"),
  reaction: z.object({
    message_id: z.string(),
    emoji: z.string(),
  }),
});

// Union of supported message types
const messageSchema = z.union([
  textMessageSchema,
  imageMessageSchema,
  documentMessageSchema,
  reactionMessageSchema,
]);

// WhatsApp Webhook Schema
export const whatsappMessageSchema = z.object({
  object: z.literal("whatsapp_business_account"),
  entry: z.array(
    z.object({
      id: z.string(),
      changes: z.array(
        z.object({
          field: z.literal("messages"),
          value: z.object({
            messaging_product: z.literal("whatsapp"),
            metadata: z.object({
              display_phone_number: z.string().optional(),
              phone_number_id: z.string(),
            }),
            contacts: z
              .array(
                z.object({
                  profile: z.object({
                    name: z.string(),
                  }),
                  wa_id: z.string(),
                }),
              )
              .optional(),
            messages: z.array(messageSchema).optional(),
          }),
        }),
      ),
    }),
  ),
});
