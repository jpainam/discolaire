import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader className=" animate-spin w-8 h-8" />
    </div>
  );
}
