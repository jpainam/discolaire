import type { InferUITool, UIDataTypes, UIMessage, UITools } from "ai";
import { z } from "zod/v4";

import type { AiSuggestion } from "@repo/db/client";

import type { createDocument } from "./ai/tools/create-document";
import type { getWeather } from "./ai/tools/get-weather";
import type { requestSuggestions } from "./ai/tools/request-suggestions";
import type { updateDocument } from "./ai/tools/update-document";
import type { ArtifactKind } from "~/components/ai/artifact";

export interface DataPart {
  type: "append-message";
  message: string;
}

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type requestSuggestionsTool = InferUITool<
  ReturnType<typeof requestSuggestions>
>;

export interface ChatTools extends UITools {
  getWeather: weatherTool;
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  requestSuggestions: requestSuggestionsTool;
}

export interface CustomUIDataTypes extends UIDataTypes {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: AiSuggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
}

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ChatTools
>;

export interface Attachment {
  name: string;
  url: string;
  contentType: string;
}
