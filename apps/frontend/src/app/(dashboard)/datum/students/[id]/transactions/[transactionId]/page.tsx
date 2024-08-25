import Image from "next/image";
import { notFound } from "next/navigation";
import logo from "@/../public/images/logo.png";
import { getServerTranslations } from "@/app/i18n/server";
import { api } from "@/trpc/server";
import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";
import { Calendar } from "lucide-react";

export default async function Page({
  params: { id, transactionId },
}: {
  params: { id: string; transactionId: number };
}) {
  const transaction = await api.transaction.get(transactionId);
  const { t } = await getServerTranslations();
  if (!transaction) {
    notFound();
  }
  return (
    <div className="relative h-full bg-[url('/placeholder.svg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-gray-600 backdrop-blur-sm" />
      <div className="relative z-10 flex h-full flex-col justify-between px-4 py-8 sm:px-6 md:px-8">
        <header className="flex items-center justify-between">
          <Image src={logo} width={75} height={75} alt="LOGO" />
          <div className="flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5" />
            <span>May 16, 2024</span>
          </div>
        </header>
        <div className="mx-auto grid w-full max-w-xl gap-4 rounded-lg bg-background p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t("receipt")}</h1>
            <div className="flex items-center gap-2">
              <ReceiptIcon className="h-5 w-5" />
              <span>{transaction?.transactionRef}</span>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Purchase Date</span>
              <span>May 16, 2024</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span>Visa **** 1234</span>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Item</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Acme Circles T-Shirt</span>
              <span>2</span>
              <span>$99.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Acme Aqua Filters</span>
              <span>1</span>
              <span>$49.00</span>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>$148.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Discount</span>
            <span>-$10.00</span>
          </div>
          <div className="flex items-center justify-between font-bold">
            <span>Total</span>
            <span>$138.00</span>
          </div>
        </div>

        <footer className="mt-auto">
          <Button className="w-full">Print Receipt</Button>
        </footer>
      </div>
    </div>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function ReceiptIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}
