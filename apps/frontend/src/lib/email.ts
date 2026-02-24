"use server";

import { caller } from "~/trpc/server";

const DEFAULT_FROM = "Discolaire <contact@discolaire.com>";

/**
 * Enqueue one or more transactional emails via sesEmail.enqueue.
 *
 * Use this server action when you already have the rendered HTML and want to
 * send from anywhere server-side (server components, server actions, API routes).
 *
 * For React-email templates, render with `@react-email/render` first:
 *   const html = await render(MyTemplate({ ... }));
 *   await enqueueEmail({ to, subject, html });
 */
export async function enqueueEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}) {
  const recipients = Array.isArray(opts.to) ? opts.to : [opts.to];
  return caller.sesEmail.enqueue({
    jobs: recipients.map((to) => ({
      to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      from: opts.from ?? DEFAULT_FROM,
    })),
  });
}
