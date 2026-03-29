import { Resend } from "resend";

import { assertEnv, env } from "@/env";

let resend: Resend | null = null;

export function getResendClient() {
  if (!resend) {
    assertEnv(["RESEND_API_KEY"]);
    resend = new Resend(env.RESEND_API_KEY);
  }

  return resend;
}
