/* eslint-disable @typescript-eslint/no-explicit-any */
export default function rangeMap(n: number, fn: (i: number) => any) {
  const arr = [];
  while (n > arr.length) {
    arr.push(fn(arr.length));
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return arr;
}
