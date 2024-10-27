import { cookies } from "next/headers";

import { accounts, mails } from "~/app/(dashboard)/mail/data";
import { Mail } from "~/components/shared/mail/mail";

export default async function MailPage() {
  const layout = (await cookies()).get("react-resizable-panels:layout");
  const collapsed = (await cookies()).get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  console.log("collapsed", collapsed);
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <div className="flex h-[calc(100vh-9rem)] flex-col">
        <Mail
          accounts={accounts}
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
