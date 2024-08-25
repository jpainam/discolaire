/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDirection = void 0;
// import { useEffect } from 'react';
// import { useLocalStorage } from '~/hooks/use-local-storage';
// export function useDirection() {
//   const [direction, setDirection] = useLocalStorage('iso-direction', 'ltr');
//   useEffect(() => {
//     document.documentElement.dir = direction ?? 'ltr';
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [direction]);
//   return {
//     direction: direction ? direction : 'ltr',
//     setDirection,
//   };
// }
var jotai_1 = require("jotai");
// 1. set initial atom for isomorphic direction
var isomorphicDirectionAtom = (0, jotai_1.atom)(
// @ts-expect-error TODO: fix this
typeof window !== "undefined" ? localStorage.getItem("iso-direction") : "ltr");
var isomorphicDirectionAtomWithPersistence = (0, jotai_1.atom)(function (get) { return get(isomorphicDirectionAtom); }, function (get, set, newStorage) {
    set(isomorphicDirectionAtom, newStorage);
    // @ts-expect-error TODO: fix this
    localStorage.setItem("iso-direction", newStorage);
});
// 2. useDirection hook to check which direction is available
function useDirection() {
    var _a = (0, jotai_1.useAtom)(isomorphicDirectionAtomWithPersistence), direction = _a[0], setDirection = _a[1];
    return {
        direction: direction !== null && direction !== void 0 ? direction : "ltr",
        setDirection: setDirection,
    };
}
exports.useDirection = useDirection;
