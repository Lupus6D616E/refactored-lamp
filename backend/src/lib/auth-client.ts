import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";   
import { adminClient } from "better-auth/client/plugins"
import { getBaseUrl } from "@lib/detectdeployed";
import type { auth } from "@lib/auth";
export const authClient = createAuthClient({
  baseURL: `${getBaseUrl()}/auth/api`, // change when deployed
  plugins: [inferAdditionalFields<typeof auth>(), adminClient() ],
});