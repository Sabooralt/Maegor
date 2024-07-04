import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        exit={{ opacity: 0 }}
        className="h-screen p-5 grid gap-2 overflow-hidden"
      >
        <nav className="items-flex-between  h-fit">
          <Skeleton className="h-10 w-36" />
          <div className="items-flex-between">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
          <Skeleton className="size-12 rounded-full" />
        </nav>

        <div className="h-[80vh] grid-cols-6 gap-5  mb-auto grid">
          <div className="col-span-1">
            <Skeleton className="size-full" />
          </div>
          <div className="col-span-4">
            <Skeleton className="size-full" />
          </div>
          <div className="col-span-1 grid gap-2">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
