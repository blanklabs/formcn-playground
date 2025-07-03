import * as React from "react";

import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
      <div
        data-radix-scroll-area-viewport
        className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 hover:scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 dark:hover:scrollbar-thumb-zinc-700 h-full w-full overflow-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(228 228 231) transparent",
        }}
      >
        {children}
      </div>
    </div>
  );
});
ScrollArea.displayName = "ScrollArea";

const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("h-[1px] w-full shrink-0 bg-zinc-200 dark:bg-zinc-800", className)} {...props} />
  ),
);
Separator.displayName = "Separator";

export { ScrollArea, Separator };
