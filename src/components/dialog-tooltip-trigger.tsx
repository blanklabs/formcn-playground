import * as React from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DialogTooltipTriggerProps {
  tooltip: string;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function DialogTooltipTrigger({ tooltip, children, side = "top", className }: DialogTooltipTriggerProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild className={className}>
            {children}
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side={side}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
