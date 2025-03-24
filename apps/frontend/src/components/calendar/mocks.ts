import type { IEvent, IUser } from "~/components/calendar/interfaces";
import type { TEventColor } from "~/components/calendar/types";

// ================================== //

export const USERS_MOCK: IUser[] = [
  {
    id: "f3b035ac-49f7-4e92-a715-35680bf63175",
    name: "Michael Doe",
    picturePath: null,
  },
  {
    id: "3e36ea6e-78f3-40dd-ab8c-a6c737c3c422",
    name: "Alice Johnson",
    picturePath: null,
  },
  {
    id: "a7aff6bd-a50a-4d6a-ab57-76f76bb27cf5",
    name: "Robert Smith",
    picturePath: null,
  },
  {
    id: "dd503cf9-6c38-43cf-94cc-0d4032e2f77a",
    name: "Emily Davis",
    picturePath: null,
  },
];

// ================================== //

const colors: TEventColor[] = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
];
const events = [
  "MATHS",
  "Physique",
  "Informatique",
  "SVTEEHB",
  "Chimie",
  "Anglais",
  "Littérature",
  "Langue",
  "Histoire",
  "CAGE",
  "ECM",
  "PHILO",
  "EPS",
  "ESF",
  "TM",
];

const mockGenerator = (numberOfEvents: number): IEvent[] => {
  const result: IEvent[] = [];
  let currentId = 1;

  const randomUser = USERS_MOCK[Math.floor(Math.random() * USERS_MOCK.length)];

  // Date range: 30 days before and after now
  const now = new Date();
  const startRange = new Date(now);
  startRange.setDate(now.getDate() - 30);
  const endRange = new Date(now);
  endRange.setDate(now.getDate() + 30);

  // Create an event happening now
  const currentEvent = {
    id: currentId++,
    startDate: new Date(now.getTime() - 30 * 60000).toISOString(),
    endDate: new Date(now.getTime() + 30 * 60000).toISOString(),
    title: events[Math.floor(Math.random() * events.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    user: randomUser,
  };

  // @ts-expect-error TODO: Fix this
  result.push(currentEvent);

  // Generate the remaining events
  for (let i = 0; i < numberOfEvents - 1; i++) {
    // Determine if this is a multi-day event (10% chance)
    const isMultiDay = Math.random() < 0.1;

    const startDate = new Date(
      startRange.getTime() +
        Math.random() * (endRange.getTime() - startRange.getTime())
    );

    // Set time between 8 AM and 8 PM
    startDate.setHours(
      8 + Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 60),
      0,
      0
    );

    const endDate = new Date(startDate);

    if (isMultiDay) {
      // Multi-day event: Add 1-4 days
      const additionalDays = Math.floor(Math.random() * 4) + 1;
      endDate.setDate(startDate.getDate() + additionalDays);
      endDate.setHours(
        8 + Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 60),
        0,
        0
      );
    } else {
      // Same-day event: Add 1-3 hours
      endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 3) + 1);
    }

    result.push({
      id: currentId++,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      // @ts-expect-error TODO: Fix this
      title: events[Math.floor(Math.random() * events.length)],
      // @ts-expect-error TODO: Fix this
      color: colors[Math.floor(Math.random() * colors.length)],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      // @ts-expect-error TODO: Fix this
      user: USERS_MOCK[Math.floor(Math.random() * USERS_MOCK.length)],
    });
  }

  return result;
};

export const CALENDAR_ITENS_MOCK: IEvent[] = mockGenerator(80);
