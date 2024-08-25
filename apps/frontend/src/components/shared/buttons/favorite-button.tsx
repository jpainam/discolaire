"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@repo/ui/button";

import AddFavorite from "../../../../public/images/add-favorite.jpg";
import Favorite from "../../../../public/images/favorite.jpg";

export function FavoriteButton() {
  // TODO Read the state from the server
  const [favorite, setFavorite] = useState(false);
  return (
    <div>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="flex h-6 w-6 items-center justify-center"
        onClick={() => {
          setFavorite(!favorite);
        }}
      >
        <>
          {favorite ? (
            <Image height={75} width={75} src={AddFavorite} alt="Favorite" />
          ) : (
            <Image height={75} width={75} src={Favorite} alt="Favorite" />
          )}{" "}
        </>
      </Button>
    </div>
  );
}
