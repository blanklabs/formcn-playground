import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { tailwindColors } from "@/static/tailwind-colors";

export const shades = [50, ...Array.from({ length: 9 }, (_, i) => (i + 1) * 100), 950];

export function ShadeSelect({
  selectedColor,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
  selectedColor: keyof typeof tailwindColors;
}) {
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select shade" />
      </SelectTrigger>
      <SelectContent>
        {shades.map((shade) => (
          <SelectItem key={shade} value={shade.toString()}>
            <div className="flex items-center gap-2">
              <div
                className={`h-4 w-4 rounded-full`}
                style={{
                  backgroundColor:
                    tailwindColors[selectedColor][shade as keyof (typeof tailwindColors)[typeof selectedColor]],
                }}
              />
              {shade}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
