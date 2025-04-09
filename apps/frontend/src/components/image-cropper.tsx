"use client";

import type { SyntheticEvent } from "react";
import React from "react";

import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

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

import { cn } from "@repo/ui/lib/utils";
import { CropIcon, Trash2Icon } from "lucide-react";
import type { FileWithPath } from "react-dropzone";
import "react-image-crop/dist/ReactCrop.css";
import { useLocale } from "~/i18n";
type FileWithPreview = FileWithPath & {
  preview: string;
};

interface ImageCropperProps {
  dialogOpen: boolean;
  showPreview?: boolean;
  className?: string;
  setDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete?: (croppedImage: string) => void;
  selectedFile: FileWithPreview | null;
  setSelectedFile?: React.Dispatch<
    React.SetStateAction<FileWithPreview | null>
  >;
}

export function ImageCropper({
  dialogOpen,
  className,
  setDialogOpen,
  onComplete,
  showPreview = false,
  selectedFile,
  setSelectedFile,
}: ImageCropperProps) {
  const aspect = 1;

  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
  const [croppedImage, setCroppedImage] = React.useState<string>("");

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

  function onCrop() {
    setCroppedImage(croppedImageUrl);
    setDialogOpen?.(false);
    onComplete?.(croppedImageUrl);
  }

  const { t } = useLocale();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {showPreview && (
        <DialogTrigger>
          <Avatar className={cn("", className)}>
            <AvatarImage
              src={croppedImage ? croppedImage : selectedFile?.preview}
              alt="Image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DialogTrigger>
      )}
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
                src={selectedFile?.preview}
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
                setSelectedFile?.(null);
              }}
            >
              <Trash2Icon className="size-4" />
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button type="submit" size={"sm"} className="w-fit" onClick={onCrop}>
            <CropIcon className="size-4" />
            {t("crop")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to center the crop
export function centerAspectCrop(
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
