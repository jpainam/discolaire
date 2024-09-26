import Image from "next/image";
import screen3 from "public/classroom-details.png";
import screen4 from "public/classroom-list.png";
import screen5 from "public/classroom-subjects.png";
import screen2 from "public/student-details.png";
import screen1 from "public/student-list.png";

import { CardStack } from "./card-stack";

export function Screens() {
  return (
    <div className="relative mt-[50px] pb-16 pt-12 md:mt-[180px]">
      <div className="relative z-10 flex flex-col items-center">
        <div className="pb-14 text-center">
          <h3 className="text-4xl font-medium md:text-6xl">
            Interface optimisé
          </h3>
          <p className="mt-4">
            Optimisez la gestion de votre école, simplifiez l'éducation.
          </p>
        </div>

        <CardStack
          items={[
            {
              id: 1,
              name: "Overview",
              content: (
                <Image
                  quality={100}
                  alt="Dashboard - Overview"
                  src={screen1}
                  width={1231}
                  height={670}
                  priority
                />
              ),
            },
            {
              id: 2,
              name: "Tracker",
              content: (
                <Image
                  quality={100}
                  alt="Dashboard - Tracker"
                  src={screen2}
                  width={1231}
                  height={670}
                />
              ),
            },
            {
              id: 3,
              name: "Inbox",
              content: (
                <Image
                  quality={100}
                  alt="Dashboard - Inbox"
                  src={screen3}
                  width={1231}
                  height={670}
                />
              ),
            },
            {
              id: 4,
              name: "Vault",
              content: (
                <Image
                  quality={100}
                  alt="Dashboard - Vault"
                  src={screen4}
                  width={1231}
                  height={670}
                />
              ),
            },
            {
              id: 5,
              name: "Dashboard - Transactions",
              content: (
                <Image
                  quality={100}
                  alt="Dashboard - Transactions"
                  src={screen5}
                  width={1231}
                  height={670}
                />
              ),
            },
          ]}
        />
      </div>

      <div className="dotted-bg absolute -left-[5000px] top-0 h-full w-[10000px]" />
    </div>
  );
}
