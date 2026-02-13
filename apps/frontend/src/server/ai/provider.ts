import "server-only";

import type { LanguageModel } from "ai";
import { gateway } from "@ai-sdk/gateway";

import { env } from "~/env";
import { ChatSDKError } from "~/lib/errors";

export const AI_PROVIDERS = ["openai", "anthropic", "google"] as const;

type KnownAiProvider = (typeof AI_PROVIDERS)[number];
export type AiProvider = KnownAiProvider | (string & {});

export interface AiRuntimeConfig {
  provider: AiProvider;
  model: string;
}

const DEFAULT_MODEL_BY_PROVIDER: Record<KnownAiProvider, string> = {
  openai: "gpt-4o-mini",
  anthropic: "claude-3.5-haiku",
  google: "gemini-2.0-flash",
};

function isKnownProvider(value: string): value is KnownAiProvider {
  return (AI_PROVIDERS as readonly string[]).includes(value);
}

function toProvider(value: string | undefined): AiProvider {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return "openai";
  }

  return normalized;
}

function toGatewayModelId(provider: AiProvider, model: string): string {
  const normalizedModel = model.trim();

  if (normalizedModel.includes("/")) {
    return normalizedModel;
  }

  return `${provider}/${normalizedModel}`;
}

function inferProviderFromModel(modelId: string): AiProvider | null {
  const [provider] = modelId.split("/", 1);
  if (!provider) {
    return null;
  }

  return provider.toLowerCase();
}

export function resolveAiRuntimeConfig(input?: {
  provider?: string;
  model?: string;
}): AiRuntimeConfig {
  const requestedProvider = toProvider(input?.provider ?? env.AI_PROVIDER);
  const requestModel = input?.model?.trim();
  const envModel = env.AI_MODEL?.trim();
  const fallbackModel = isKnownProvider(requestedProvider)
    ? DEFAULT_MODEL_BY_PROVIDER[requestedProvider]
    : DEFAULT_MODEL_BY_PROVIDER.openai;
  const rawModel =
    (requestModel && requestModel.length > 0 ? requestModel : envModel) ??
    fallbackModel;
  const model = toGatewayModelId(requestedProvider, rawModel);
  const inferredProvider = inferProviderFromModel(model);

  return {
    provider: inferredProvider ?? requestedProvider,
    model,
  };
}

function ensureGatewayKey() {
  if (!env.AI_GATEWAY_API_KEY) {
    throw new ChatSDKError(
      "bad_request:api",
      "Missing AI_GATEWAY_API_KEY for Vercel AI Gateway.",
    );
  }
}

export function getLanguageModel(config: AiRuntimeConfig): LanguageModel {
  ensureGatewayKey();
  return gateway(config.model);
}
