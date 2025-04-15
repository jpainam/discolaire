import type { PropsWithChildren } from "react";
import { MailContextProvider } from "./MailContextProvider";
const emails = [
  {
    id: "1",
    from: "John Doe",
    email: "john.doe@example.com",
    subject: "Project Update",
    preview: "I wanted to share the latest updates on our project...",
    date: "10:30 AM",
    read: true,
    folder: "inbox",
    group: "work",
    avatar: "JD",
    thread: [
      {
        id: "1-1",
        from: "John Doe",
        email: "john.doe@example.com",
        to: "me@example.com",
        subject: "Project Update",
        content:
          "Hi there,\n\nI wanted to share the latest updates on our project. We've made significant progress on the frontend components and are now moving to the backend integration.\n\nCould you review the latest pull request when you get a chance?\n\nThanks,\nJohn",
        date: "Yesterday, 10:30 AM",
        avatar: "JD",
      },
    ],
  },
  {
    id: "2",
    from: "Sarah Johnson",
    email: "sarah.j@example.com",
    subject: "Meeting Tomorrow",
    preview: "Just a reminder about our meeting tomorrow at 2 PM...",
    date: "Yesterday",
    read: false,
    folder: "inbox",
    group: "work",
    avatar: "SJ",
    thread: [
      {
        id: "2-1",
        from: "Sarah Johnson",
        email: "sarah.j@example.com",
        to: "me@example.com",
        subject: "Meeting Tomorrow",
        content:
          "Hello,\n\nJust a reminder about our meeting tomorrow at 2 PM in the main conference room. We'll be discussing the Q3 roadmap and assigning new tasks.\n\nPlease come prepared with your status updates.\n\nBest regards,\nSarah",
        date: "Yesterday, 3:45 PM",
        avatar: "SJ",
      },
    ],
  },
  {
    id: "3",
    from: "Michael Brown",
    email: "m.brown@example.com",
    subject: "Weekend Plans",
    preview: "Hey! Are you free this weekend? I was thinking we could...",
    date: "Mar 15",
    read: true,
    folder: "inbox",
    group: "personal",
    avatar: "MB",
    thread: [
      {
        id: "3-1",
        from: "Michael Brown",
        email: "m.brown@example.com",
        to: "me@example.com",
        subject: "Weekend Plans",
        content:
          "Hey!\n\nAre you free this weekend? I was thinking we could check out that new restaurant downtown. They have amazing reviews and I've been wanting to try it for weeks.\n\nLet me know if you're interested!\n\nCheers,\nMike",
        date: "Mar 15, 2:20 PM",
        avatar: "MB",
      },
    ],
  },
  {
    id: "4",
    from: "Tech Newsletter",
    email: "newsletter@tech-weekly.com",
    subject: "This Week in Tech: Latest Updates",
    preview: "The biggest tech news of the week, curated just for you...",
    date: "Mar 14",
    read: true,
    folder: "inbox",
    group: "newsletters",
    avatar: "TN",
    thread: [
      {
        id: "4-1",
        from: "Tech Newsletter",
        email: "newsletter@tech-weekly.com",
        to: "me@example.com",
        subject: "This Week in Tech: Latest Updates",
        content:
          "# This Week in Tech\n\n## Latest Updates\n\n- Apple announces new MacBook Pro with improved performance\n- Google releases major update to its search algorithm\n- Microsoft unveils new cloud services for enterprise customers\n\nRead more on our website: [tech-weekly.com](https://example.com)",
        date: "Mar 14, 9:00 AM",
        avatar: "TN",
      },
    ],
  },
  {
    id: "5",
    from: "Alex Wilson",
    email: "alex.w@example.com",
    subject: "Draft: Proposal for Client",
    preview: "Here's the draft of the proposal we discussed...",
    date: "Mar 10",
    read: true,
    folder: "drafts",
    group: "work",
    avatar: "AW",
    thread: [
      {
        id: "5-1",
        from: "Me",
        email: "me@example.com",
        to: "alex.w@example.com",
        subject: "Draft: Proposal for Client",
        content:
          "Hi Alex,\n\nHere's the draft of the proposal we discussed. I've included the budget estimates and timeline as requested.\n\nPlease let me know if you need any changes before I send it to the client.\n\nRegards,\nMe",
        date: "Mar 10, 11:15 AM",
        avatar: "ME",
      },
    ],
  },
  {
    id: "6",
    from: "Client Support",
    email: "support@client.com",
    subject: "Re: Issue #1234",
    preview: "Thank you for your patience. We've resolved the issue...",
    date: "Mar 8",
    read: true,
    folder: "sent",
    group: "work",
    avatar: "CS",
    thread: [
      {
        id: "6-1",
        from: "Me",
        email: "me@example.com",
        to: "support@client.com",
        subject: "Issue #1234",
        content:
          "Hello Support Team,\n\nI'm experiencing an issue with the latest update. When I try to access the dashboard, I get an error message saying 'Connection failed'.\n\nCan you please help me resolve this?\n\nThank you,\nMe",
        date: "Mar 8, 9:30 AM",
        avatar: "ME",
      },
      {
        id: "6-2",
        from: "Client Support",
        email: "support@client.com",
        to: "me@example.com",
        subject: "Re: Issue #1234",
        content:
          "Dear Customer,\n\nThank you for your patience. We've resolved the issue with the dashboard connection. It was caused by a temporary server outage.\n\nPlease try accessing the dashboard again and let us know if you still experience any problems.\n\nBest regards,\nClient Support Team",
        date: "Mar 8, 2:45 PM",
        avatar: "CS",
      },
    ],
  },
];
export default function Layout(props: PropsWithChildren) {
  return (
    <MailContextProvider activeView={"inbox"} emails={emails}>
      {props.children}
    </MailContextProvider>
  );
}
