import { MacbookScroll } from "~/components/ui/macbook-scroll";

export function SectionFour() {
  return (
    <div className="w-full overflow-hidden bg-white dark:bg-[#0B0B0F]">
      <MacbookScroll
        title={""}
        badge={""}
        src={"/student-contacts.png"}
        showGradient={false}
      />
    </div>
  );
}
