// import { useParams } from "next/navigation";
// import { Download } from "lucide-react";
// import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";
import { Download } from "lucide-react";

import { Button } from "@repo/ui/components/button";

// import { Button } from "@repo/ui/components/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@repo/ui/components/dialog";

// export function StudentCertificate({
//   label,
//   id,
// }: {
//   label: string;
//   id: string;
// }) {
//   const params = useParams<{ id: string }>();
//   const t = useTranslations();
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <div className="bg-muted flex items-center justify-between overflow-hidden rounded-md border p-2">
//           <div>
//             <p className="text-muted-foreground text-sm">#{id}</p>
//             <p className="text-sm">{label}</p>
//           </div>
//           <Button
//             variant="ghost"
//             className="size-8"
//             size="icon"
//             //onClick={() => handleExport(option.id, option.name)}
//           >
//             <Download className="h-4 w-4" />
//           </Button>
//         </div>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Certificat de Scolarité</DialogTitle>
//           <DialogDescription>
//             Vous pouvez imprimer le certificat de scolarité pour cet l'élève.
//           </DialogDescription>
//         </DialogHeader>

//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant="outline">{t("cancel")}</Button>
//           </DialogClose>
//           <Button
//             onClick={() => {
//               window.open(
//                 `/api/pdfs/student/${params.id}/certificate`,
//                 "_blank",
//               );
//             }}
//             type="button"
//           >
//             {t("print")}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

export function StudentCertificate({
  label,
  id,
}: {
  label: string;
  id: string;
}) {
  const params = useParams<{ id: string }>();
  return (
    <div
      onClick={() => {
        window.open(`/api/pdfs/student/${params.id}/certificate`, "_blank");
      }}
      className="bg-muted flex cursor-pointer items-center justify-between overflow-hidden rounded-md border p-2"
    >
      <div>
        <p className="text-muted-foreground text-sm">#{id}</p>
        <p className="text-sm">{label}</p>
      </div>
      <Button
        variant="ghost"
        className="size-8"
        size="icon"
        // onClick={() => {
        //   window.open(`/api/pdfs/student/${params.id}/certificate`, "_blank");
        // }}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
