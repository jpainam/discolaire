import Link from "next/link";

const currency = "USD";

export function Ticker() {
  return (
    <div className="mb-[120px] mt-[120px] flex flex-col space-y-4 text-center md:mb-[250px] md:mt-[280px] md:space-y-10">
      <span className="text-stroke text-center font-mono text-[40px] font-medium leading-none md:mb-2 md:text-[80px] lg:text-[100px] xl:text-[130px] 2xl:text-[160px]">
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
          maximumFractionDigits: 0,
        }).format(200000)}
      </span>
      <span className="text-[#878787]">
        Through our system{" "}
        <Link href="/open-startup" className="underline">
          {Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0,
          }).format(20000)}
        </Link>{" "}
        transactions across{" "}
        <Link href="/open-startup" className="underline">
          {Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0,
          }).format(200)}
        </Link>{" "}
        businesses.
      </span>
    </div>
  );
}
