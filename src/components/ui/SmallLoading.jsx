import { LoaderCircle } from "lucide-react";

export const SmallLoading = () => {
  return (
    <div className="flex pl-10 size-full items-center justify-center gap-2 text-neutral-600">
      <LoaderCircle className="size-5 animate-spin" />
      <span>Loading...</span>
    </div>
  );
};
