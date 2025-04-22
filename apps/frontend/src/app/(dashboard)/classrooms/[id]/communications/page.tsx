import { getServerTranslations } from "~/i18n/server";
import { CommunicationChannelList } from "./CommunicationChannelList";
import { CommunicationHeader } from "./CommunicationHeader";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-4">
      <CommunicationHeader />
      <CommunicationChannelList />
    </div>
  );
}
