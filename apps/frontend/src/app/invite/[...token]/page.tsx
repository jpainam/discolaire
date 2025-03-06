import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ token?: string }>;
  //searchParams: Promise<{ token?: string }>;
}) {
  //const searchParams = await props.searchParams;
  const params = await props.params;
  if (params.token) redirect(`/auth/signup?token=${params.token}`);
  else redirect("/auth/signup");

  // return (
  //   <div>
  //     Invite page {searchParams.token} or {params.token}
  //   </div>
  // );
}
