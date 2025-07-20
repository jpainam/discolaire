"use client";

import { CircleAlert } from "lucide-react";

import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "~/components/banner";

export function BannerLine() {
  return (
    <Banner>
      <BannerIcon icon={CircleAlert} />
      <BannerTitle>Important message</BannerTitle>
      <BannerAction className="h-7" size={"sm"}>
        Learn more
      </BannerAction>
      <BannerClose className="size-7" size={"icon"} />
    </Banner>
  );
}
