import { ContactDataTable } from "~/components/contacts/ContactDataTable";

// interface ContactPageProps {
//   searchParams: {
//     per_page: number;
//     page: number;
//     sort: string;
//     firstName: string;
//   };
// }
export default function Page() {
  // const contacts = await api.contact.all({
  //   page: searchParams.page,
  //   per_page: searchParams.per_page,
  //   sort: searchParams.sort || "createdAt.desc",
  //   q: searchParams.firstName || "",
  // });
  //const count = await api.contact.count();

  return (
    <div className="flex w-full flex-row px-2">
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
