import { CommunicationChannelList } from "./CommunicationChannelList";
import { CommunicationHeader } from "./CommunicationHeader";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <CommunicationHeader />
      <CommunicationChannelList />
    </div>
  );
}
