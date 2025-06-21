import { expoClient } from "@better-auth/expo/client";
import type { Auth } from "@repo/auth";
import {
  adminClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { getBaseUrl } from "./base-url";

console.log("getBaseUrl", getBaseUrl());

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    usernameClient(),
    adminClient(),
    inferAdditionalFields<Auth>(),
    expoClient({
      scheme: "discolaire",
      storagePrefix: "discolaire",
      storage: SecureStore,
    }),
  ],
});
