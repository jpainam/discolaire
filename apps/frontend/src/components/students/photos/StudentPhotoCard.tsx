import Image from "next/image";

import { cn } from "@repo/ui/lib/utils";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  photo: string;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function StudentPhotoCard({
  photo,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AlbumArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Image
          src={photo}
          alt={"Photo"}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
          )}
        />
      </div>

      {/* <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{photo.name}</h3>
        <p className="text-xs text-muted-foreground">{photo.artist}</p>
      </div> */}
    </div>
  );
}
