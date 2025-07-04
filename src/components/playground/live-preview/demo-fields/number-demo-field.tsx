import { Control, FieldValues, ControllerRenderProps } from "react-hook-form";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { NumberField, WithIdAndKey } from "@/core/types";

export function NumberDemoField({
  field: fieldSpec,
  formControl,
}: {
  field: WithIdAndKey<NumberField>;
  formControl: Control<FieldValues> | undefined;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const calculateTooltipPosition = (value: number) => {
    const min = fieldSpec.min || 0;
    const max = fieldSpec.max || 100;
    const percentage = ((value - min) / (max - min)) * 100;

    // Account for the slider's internal padding and thumb positioning
    // The thumb typically has some margin from the edges
    const thumbOffset = 2.5; // Half of thumb width (5/2 = 2.5)
    const effectiveWidth = 100 - thumbOffset * 2; // Account for both sides
    const adjustedPosition = thumbOffset + (percentage / 100) * effectiveWidth;

    return Math.min(Math.max(adjustedPosition, thumbOffset), 100 - thumbOffset);
  };

  const handleSliderChange = (value: number[], field: ControllerRenderProps<FieldValues, string>) => {
    field.onChange(value[0]);
    setTooltipPosition(calculateTooltipPosition(value[0]));
  };

  return (
    <FormField
      control={formControl}
      name={fieldSpec.key}
      render={({ field }) => (
        <FormItem>
          {fieldSpec.label && <FormLabel>{fieldSpec.label}</FormLabel>}
          <FormControl>
            {fieldSpec.format === "slider" ? (
              <div className="space-y-2">
                <div className="relative" ref={sliderRef}>
                  <Slider
                    value={[field.value || fieldSpec.min || 0]}
                    onValueChange={(value) => handleSliderChange(value, field)}
                    onPointerDown={() => {
                      setIsDragging(true);
                      setTooltipPosition(calculateTooltipPosition(field.value || fieldSpec.min || 0));
                    }}
                    onPointerUp={() => setIsDragging(false)}
                    onPointerLeave={() => setIsDragging(false)}
                    min={fieldSpec.min || 0}
                    max={fieldSpec.max || 100}
                    step={fieldSpec.step || 1}
                    className="w-full"
                  />
                  {isDragging && (
                    <div
                      className="pointer-events-none absolute -top-10 z-10 -translate-x-1/2 transform"
                      style={{ left: `${tooltipPosition}%` }}
                    >
                      <div className="rounded bg-zinc-900 px-2 py-1 text-xs text-white shadow-lg">
                        {field.value || fieldSpec.min || 0}
                      </div>
                      <div className="mx-auto h-0 w-0 border-t-4 border-r-4 border-l-4 border-transparent border-t-zinc-900"></div>
                    </div>
                  )}
                </div>
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>{fieldSpec.min || 0}</span>
                  <span className="font-medium">{field.value || fieldSpec.min || 0}</span>
                  <span>{fieldSpec.max || 100}</span>
                </div>
              </div>
            ) : (
              <Input
                type="number"
                placeholder={fieldSpec.placeholder}
                min={fieldSpec.min}
                max={fieldSpec.max}
                step={fieldSpec.step}
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
