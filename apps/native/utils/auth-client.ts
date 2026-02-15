import { expoClient } from "@better-auth/expo/client";

import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  usernameClient,
} from "better-auth/client/plugins";
import type { Auth } from "@repo/auth";
import { env } from "./env";

const configuredScheme = Constants.expoConfig?.scheme;
const appScheme =
  typeof configuredScheme === "string" && configuredScheme.length > 0
    ? configuredScheme
    : "discolaire";

function toSecureStoreSafeKeyPart(value: string): string {
  const sanitized = value.replace(/[^A-Za-z0-9._-]/g, "_");
  return sanitized.length > 0 ? sanitized : "discolaire";
}

const secureStorePrefix = toSecureStoreSafeKeyPart(appScheme);

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_SERVER_URL,
  fetchOptions: {
    headers: {
      "discolaire-tenant": env.EXPO_PUBLIC_TENANT,
    },
  },
  plugins: [
    usernameClient(),
    adminClient(),
    organizationClient(),
    inferAdditionalFields<Auth>(),
    expoClient({
      scheme: appScheme,
      storagePrefix: secureStorePrefix,
      storage: SecureStore,
    }),
  ],
});
