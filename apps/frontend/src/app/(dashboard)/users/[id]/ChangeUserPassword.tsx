// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@repo/ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@repo/ui/components/form";
// import { Input } from "@repo/ui/components/input";
// import {
//   useMutation,
//   useQueryClient,
//   useSuspenseQuery,
// } from "@tanstack/react-query";
// import { useParams } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import { useLocale } from "~/i18n";
// import { useTRPC } from "~/trpc/react";
// const updateUserPasswordSchema = z.object({
//   new_password: z.string().min(1),
//   confirm_password: z.string().min(1),
// });
// export function ChangeUserPassword() {
//   const trpc = useTRPC();
//   const params = useParams<{ id: string }>();
//   const { data: user } = useSuspenseQuery(
//     trpc.user.get.queryOptions(params.id),
//   );
//   const form = useForm({
//     resolver: zodResolver(updateUserPasswordSchema),
//     defaultValues: {
//       new_password: "",
//       confirm_password: "",
//     },
//   });
//   const queryClient = useQueryClient();

//   const updateUserPassword = useMutation(
//     trpc.user.updatePassword.mutationOptions({
//       onSuccess: async () => {
//         await queryClient.invalidateQueries(trpc.user.get.pathFilter());
//         toast.success(t("updated_successfully"), { id: 0 });
//       },
//       onError: (error) => {
//         toast.error(error.message, { id: 0 });
//       },
//     }),
//   );
//   const { t } = useLocale();

//   const handleSubmit = (values: z.infer<typeof updateUserPasswordSchema>) => {
//     if (values.new_password !== values.confirm_password) {
//       toast.error(t("password_mismatch"));
//       return;
//     }
//     toast.success(t("updating"), { id: 0 });
//     void updateUserPassword.mutate({
//       userId: user.id,
//       password: values.new_password,
//     });
//   };
//   return (
//     <div className="mx-auto max-w-3xl">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg">{t("reset_password")}</CardTitle>
//           <CardDescription>
//             {t("reset_password_description", { user: user.name })}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="space-y-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="new_password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("new_password")}</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder="password"
//                         {...field}
//                       />
//                     </FormControl>

//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="confirm_password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>{t("confirm_password")}</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder="password"
//                         {...field}
//                       />
//                     </FormControl>

//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 isLoading={updateUserPassword.isPending}
//                 type="submit"
//                 className="w-fit"
//               >
//                 {t("reset_password")}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
