import {
  apiKeyClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./server";
export const authClient = createAuthClient({
  plugins: [
    apiKeyClient(),
    usernameClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});
