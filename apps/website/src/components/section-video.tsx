"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { Button } from "@repo/ui/button";

import { Icons } from "~/components/icons";
import { useMediaQuery } from "~/hooks/use-media-query";

const ReactHlsPlayer = dynamic(() => import("react-hls-player"), {
  ssr: false,
});

export function SectionVideo() {
  const playerRef = useRef();
  const timer = useRef();
  const [isPlaying, setPlaying] = useState<Timer | undefined>(false);
  const [isMuted, setMuted] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }

    setPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <motion.div
      className="container flex flex-col justify-center pb-20"
      onViewportEnter={() => {
        if (!isPlaying && isDesktop) {
          timer.current = setTimeout(() => {
            playerRef.current?.play();
            setPlaying(true);
          }, 4000);
        }
      }}
      onViewportLeave={() => {
        playerRef.current?.pause();
        setPlaying(false);
        if (timer.current) {
          clearTimeout(timer.current);
        }
      }}
    >
      <div className="relative">
        {isPlaying && (
          <div className="absolute right-4 top-4 z-30 items-center justify-center space-x-4 transition-all md:right-12 md:top-12">
            <Button
              size="icon"
              className="size-10 rounded-full transition ease-in-out hover:scale-110 md:size-14"
              onClick={toggleMute}
            >
              {isMuted ? <Icons.Mute size={24} /> : <Icons.UnMute size={24} />}
            </Button>
          </div>
        )}

        {!isPlaying && (
          <div className="absolute right-4 top-4 z-30 items-center justify-center space-x-4 transition-all md:right-12 md:top-12">
            <Button
              size="icon"
              className="size-10 rounded-full transition ease-in-out hover:scale-110 md:size-14"
              onClick={togglePlay}
            >
              <Icons.Play size={24} />
            </Button>
          </div>
        )}

        <ReactHlsPlayer
          onEnded={() => playerRef.current?.load()}
          onClick={togglePlay}
          src="https://customer-oh6t55xltlgrfayh.cloudflarestream.com/306702a5d5efbba0e9bcdd7cb17e9c5a/manifest/video.m3u8"
          autoPlay={false}
          poster="https://cdn.midday.ai/poster.webp"
          playerRef={playerRef}
          className="w-full"
          muted={isMuted}
        />
      </div>
    </motion.div>
  );
}
