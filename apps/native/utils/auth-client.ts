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
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
  ],
});
