import { getServerTranslations } from "@/app/i18n/server";
import { ContactDataTable } from "@/components/contacts/ContactDataTable";

import { api } from "@/trpc/server";

type ContactPageProps = {
  searchParams: {
    per_page: number;
    page: number;
    sort: string;
    firstName: string;
  };
};
export default async function Page({ searchParams }: ContactPageProps) {
  const { t } = await getServerTranslations();
  const contacts = await api.contact.all({
    page: searchParams.page,
    per_page: searchParams.per_page,
    sort: searchParams.sort || "createdAt.desc",
    q: searchParams.firstName || "",
  });
  //const count = await api.contact.count();

  return (
    <div className="w-full flex flex-row">
      <ContactDataTable />
      {/* <div className="grid md:grid-cols-2 p-1 gap-2">
        <ContactEffectif />
        <ContactGenderEffectif />
        <ContactEffectif />
        <ContactEffectif />
      </div> */}
    </div>
  );
}
