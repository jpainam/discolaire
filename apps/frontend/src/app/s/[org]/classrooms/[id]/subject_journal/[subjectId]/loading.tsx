import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="m-auto flex justify-center my-32 items-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
