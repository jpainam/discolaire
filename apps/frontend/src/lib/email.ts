"use server";

import { caller } from "~/trpc/server";

const DEFAULT_FROM = "Discolaire <contact@discolaire.com>";

/**
 * Returns a deduplicated list of email addresses for a student and their
 * contacts/parents.
 *
 * Student email: uses `student.email` once that field is added directly to the
 * Student model. Until then it falls back to `student.user?.email`.
 * Contact email: uses `contact.user?.email` with a fallback to `contact.email`
 * (the direct field already present on the Contact model).
 */
export async function getStudentEmailRecipients(
  studentId: string,
): Promise<string[]> {
  const [student, contacts] = await Promise.all([
    caller.student.get(studentId),
    caller.student.contacts(studentId),
  ]);

  const emails: string[] = [];

  // TODO: replace with `student.email` once added to the Student model
  const studentEmail = (student.user?.email ?? "").trim();
  if (studentEmail) emails.push(studentEmail);

  for (const sc of contacts) {
    const contact = sc.contact;
    const contactEmail = (contact.user?.email ?? contact.email ?? "").trim();
    if (contactEmail) emails.push(contactEmail);
  }

  return [...new Set(emails)];
}

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
