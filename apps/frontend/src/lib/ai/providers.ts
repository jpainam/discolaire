import { xai } from "@ai-sdk/xai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";

export const myProvider =
  //   env.NODE_ENV == "development"
  //     ? customProvider({
  //         languageModels: {
  //           "chat-model": chatModel,
  //           "chat-model-reasoning": reasoningModel,
  //           "title-model": titleModel,
  //           "artifact-model": artifactModel,
  //         },
  //       })
  //     :
  customProvider({
    languageModels: {
      "chat-model": xai("grok-2-vision-1212"),
      "chat-model-reasoning": wrapLanguageModel({
        model: xai("grok-3-mini-beta"),
        middleware: extractReasoningMiddleware({ tagName: "think" }),
      }),
      "title-model": xai("grok-2-1212"),
      "artifact-model": xai("grok-2-1212"),
    },
    imageModels: {
      "small-model": xai.imageModel("grok-2-image"),
    },
  });
