"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function Tagline() {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {pathname === "/" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute left-1/2 hidden -translate-x-1/2 transform text-center font-medium tracking-tight text-balance whitespace-nowrap text-zinc-500 md:block",
          )}
        >
          Build beautiful forms with shadcn/ui, React Hook Form and Zod
        </motion.p>
      )}
    </AnimatePresence>
  );
}
