import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { tailwindColors } from "@/static/tailwind-colors";

const colors = Object.keys(tailwindColors);

export function ColorSelect({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select color" />
      </SelectTrigger>
      <SelectContent>
        {colors.map((color) => (
          <SelectItem key={color} value={color}>
            <div className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-sm`} style={{ backgroundColor: tailwindColors[color][600] }} />
              {color.charAt(0).toUpperCase() + color.slice(1)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
