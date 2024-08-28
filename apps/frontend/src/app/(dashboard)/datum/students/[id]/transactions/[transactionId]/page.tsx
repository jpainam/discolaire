import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, ReceiptIcon } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";

import logo from "~/../public/images/logo.png";
import { api } from "~/trpc/server";

export default async function Page({
  params: { id, transactionId },
}: {
  params: { id: string; transactionId: number };
}) {
  const transaction = await api.transaction.get(transactionId);
  console.log(id);
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
              <span>{transaction.transactionRef}</span>
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
