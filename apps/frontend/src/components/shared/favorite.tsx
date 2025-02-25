"use client";

import { useState } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";

import { Button } from "@repo/ui/components/button";

export default function Favorite() {
  const [favorite, setFavorite] = useState(false);
  return (
    <Button variant="ghost" onClick={() => setFavorite((prevFav) => !prevFav)}>
      {favorite ? (
        <PiStarFill className="fill-orange text-orange h-5 w-5" />
      ) : (
        <PiStar className="h-5 w-5 text-gray-500" />
      )}
    </Button>
  );
}
