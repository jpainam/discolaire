// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useLocale } from "@/hooks/use-locale";
// import { XMarkIcon } from "@heroicons/react/20/solid";
// import { useAtom } from "jotai";

// import { closedBannerAtom } from "@repo/hooks/use-banners";

// import { Button } from "../button";

// export function NoticeBanner() {
//   const [banner, setBanner] = useState<any | null>(null);
//   const [closedBanners, setClosedBanners] = useAtom(closedBannerAtom);
//   const announcementsActives = api.announcement.findActives.useQuery();

//   useEffect(() => {
//     if (announcementsActives.data) {
//       const banners = announcementsActives.data;
//       const current = banners.find(
//         (banner) => !closedBanners.includes(banner.id),
//       );
//       setBanner(current || null);
//     }
//   }, [closedBanners, announcementsActives.data]);

//   const { t } = useLocale();

//   if (announcementsActives.isPending || !banner) {
//     return null;
//   }

//   return (
//     <div className="w-ful sticky top-0 z-50 flex items-center gap-x-6 overflow-hidden bg-destructive px-6 py-1 sm:px-3.5">
//       <div className="text-sm font-semibold text-destructive-foreground">
//         {banner.level}
//       </div>
//       <div className="flex-1"></div>
//       <p className="text-sm leading-6 text-destructive-foreground">
//         <span className="mr-4 font-semibold">{banner.title}</span>
//         {banner.description}
//       </p>
//       {
//         <Link
//           href="#"
//           className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
//         >
//           {t("details")} <span aria-hidden="true">&rarr;</span>
//         </Link>
//       }

//       <div className="flex justify-end">
//         <Button
//           className="hover:bg-transparent"
//           variant={"ghost"}
//           onClick={() => {
//             setClosedBanners((prev) => [...prev, banner.id]);
//           }}
//         >
//           <XMarkIcon
//             className="h-5 w-5 bg-muted text-muted-foreground"
//             aria-hidden="true"
//           />
//         </Button>
//       </div>
//     </div>
//   );
// }
