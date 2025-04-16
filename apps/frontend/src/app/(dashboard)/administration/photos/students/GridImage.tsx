"use client";

import { Button } from "@repo/ui/components/button";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/components/dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "~/i18n";
import { breadcrumbAtom } from "~/lib/atoms";
import { useTRPC } from "~/trpc/react";

export function ImageGrid({ bucket }: { bucket: string }) {
  const trpc = useTRPC();
  const [startAfter, setStartAfter] = useState<string | undefined>(undefined);
  const { data: images } = useSuspenseQuery(
    trpc.photo.listObjects.queryOptions({
      prefix: "student/",
      bucket: bucket,
      startAfter: startAfter,
    }),
  );
  const { t } = useLocale();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    setBreadcrumbs([
      {
        name: t("Administration"),
        url: "/administration",
      },
      {
        name: t("Photos"),
        url: "/administration/photos",
      },
      {
        name: t("Student photos"),
        url: "/administration/photos/students",
      },
    ]);
  }, [setBreadcrumbs, t]);

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const loadMoreImages = () => {
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      //setImages([...images, ...moreImages]);
      const lastImage = images[images.length - 1];
      if (!lastImage) return;
      setStartAfter(lastImage.name);
      setLoading(false);
      setAllLoaded(true);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8 px-2">
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10  gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
            onClick={() => handleImageClick(image.name)}
          >
            <div className="aspect-[4/3] relative">
              <Image
                src={
                  image.name
                    ? `/api/download/avatars/${image.name}`
                    : "/placeholder.svg"
                }
                alt={"Image"}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1">
              <h3 className="text-xs truncate font-medium">
                {image.name.split("/")[0]}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {!allLoaded && (
        <div className="mt-10 text-center">
          <Button
            onClick={loadMoreImages}
            disabled={loading}
            className="px-6 py-2"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <DialogClose className="absolute right-4 top-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>

          {selectedImage && (
            <div className="relative w-full h-[80vh]">
              <Image
                src={
                  selectedImage
                    ? `/api/download/avatars/${selectedImage}`
                    : "/placeholder.svg"
                }
                alt={"Image"}
                fill
                className="object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                <h2 className="text-xl font-bold">{selectedImage}</h2>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
