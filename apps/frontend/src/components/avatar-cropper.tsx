"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { DropdownMenuItem } from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { CropIcon, ImageUpIcon, Trash2Icon } from "lucide-react";
import type { SyntheticEvent } from "react";
import React from "react";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { toast } from "sonner";
import { useLocale } from "~/i18n";

export function ChangeAvatarDropdown({ userId }: { userId: string }) {
  const aspect = 1;

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    //if (aspect) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
    //}
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );
    }

    return canvas.toDataURL("image/png", 1.0);
  }
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { t } = useLocale();

  async function onCrop() {
    setDialogOpen(false);
    toast.loading(t("uploading", { id: 0 }));
    await uploadToAWS(croppedImageUrl, userId);
    toast.dismiss();
  }
  console.log(">>>>>>>", selectedFile, dialogOpen);
  return (
    <div>
      {selectedFile && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <DropdownMenuItem>Nothin</DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="p-0 gap-0">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="p-2 size-full">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => onCropComplete(c)}
                aspect={aspect}
                className="w-full "
              >
                <Avatar className="size-full rounded-none">
                  <AvatarImage
                    ref={imgRef}
                    className="size-full rounded-none "
                    alt="Image Cropper Shell"
                    src={URL.createObjectURL(selectedFile)}
                    onLoad={onImageLoad}
                  />
                  <AvatarFallback className="size-full  rounded-none">
                    Loading...
                  </AvatarFallback>
                </Avatar>
              </ReactCrop>
            </div>
            <DialogFooter className="p-4 pt-0 justify-center ">
              <DialogClose asChild>
                <Button
                  size={"sm"}
                  type="reset"
                  className="w-fit"
                  variant={"outline"}
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                >
                  <Trash2Icon className="size-4" />
                  {t("cancel")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size={"sm"}
                className="w-fit"
                onClick={onCrop}
              >
                <CropIcon className="size-4" />
                {t("crop")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <DropdownMenuItem asChild>
        <Label htmlFor="file-upload">
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/*"
          />
          <ImageUpIcon />
          {t("change_avatar")}
        </Label>
      </DropdownMenuItem>
    </div>
  );
}

async function uploadToAWS(croppedImageUrl: string, userId: string) {
  const croppedBlob = await (await fetch(croppedImageUrl)).blob();
  //   const originalFormData = new FormData();
  //   originalFormData.append("file", file, "original.png");
  //   originalFormData.append("userId", userId);

  const croppedFormData = new FormData();
  croppedFormData.append("file", croppedBlob, "cropped.png");
  croppedFormData.append("userId", userId);

  //   await fetch("/api/upload/avatars", {
  //     method: "POST",
  //     body: originalFormData,
  //   });

  await fetch("/api/upload/avatars", {
    method: "POST",
    body: croppedFormData,
  });
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}
