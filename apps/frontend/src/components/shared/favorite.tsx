"use client";

import { useState } from "react";
import { PiStar, PiStarFill } from "react-icons/pi";
import { Button } from "../ui/button";

export default function Favorite() {
  const [favorite, setFavorite] = useState(false);
  return (
    <Button variant="ghost" onClick={() => setFavorite((prevFav) => !prevFav)}>
      {favorite ? (
        <PiStarFill className="h-5 w-5 fill-orange text-orange" />
      ) : (
        <PiStar className="h-5 w-5 text-gray-500" />
      )}
    </Button>
  );
}
