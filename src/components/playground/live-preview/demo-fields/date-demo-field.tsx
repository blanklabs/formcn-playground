import { Control, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateField, WithIdAndKey } from "@/core/types";
import { DatePicker } from "@/components/date-picker";
import { DateTimePicker } from "@/components/date-time-picker";
import { RangeDatePicker } from "@/components/range-date-picker";
import { TimePicker } from "@/components/time-picker";

export function DateDemoField({
  field: fieldSpec,
  formControl,
}: {
  field: WithIdAndKey<DateField>;
  formControl: Control<FieldValues> | undefined;
}) {
  return (
    <FormField
      control={formControl}
      name={fieldSpec.key}
      render={({ field }) => (
        <FormItem>
          {fieldSpec.label && <FormLabel>{fieldSpec.label}</FormLabel>}
          <FormControl>
            {fieldSpec.format === "date" ? (
              <DatePicker
                mode="single"
                value={
                  field.value && field.value !== ""
                    ? (() => {
                        const date = new Date(field.value);
                        return !isNaN(date.getTime()) ? date : undefined;
                      })()
                    : undefined
                }
                onValueChange={(date) => field.onChange(date && !isNaN(date.getTime()) ? date.toISOString() : "")}
                placeholder="Select date"
              />
            ) : fieldSpec.format === "time" ? (
              <TimePicker
                value={field.value || ""}
                onValueChange={field.onChange}
                timeFormat={fieldSpec.timeFormat || "24h"}
                placeholder="Select time"
              />
            ) : fieldSpec.format === "datetime" ? (
              <DateTimePicker
                value={
                  field.value && field.value !== ""
                    ? (() => {
                        const date = new Date(field.value);
                        return !isNaN(date.getTime()) ? date : undefined;
                      })()
                    : undefined
                }
                onValueChange={(date) => field.onChange(date && !isNaN(date.getTime()) ? date.toISOString() : "")}
                timeFormat={fieldSpec.timeFormat || "24h"}
                placeholder="Select date and time"
              />
            ) : fieldSpec.format === "range" ? (
              <RangeDatePicker
                value={
                  field.value
                    ? {
                        from: field.value.start
                          ? (() => {
                              const date = new Date(field.value.start);
                              return !isNaN(date.getTime()) ? date : undefined;
                            })()
                          : undefined,
                        to: field.value.end
                          ? (() => {
                              const date = new Date(field.value.end);
                              return !isNaN(date.getTime()) ? date : undefined;
                            })()
                          : undefined,
                      }
                    : undefined
                }
                onValueChange={(range) => {
                  if (range?.from && range?.to && !isNaN(range.from.getTime()) && !isNaN(range.to.getTime())) {
                    field.onChange({
                      start: range.from.toISOString(),
                      end: range.to.toISOString(),
                    });
                  } else {
                    field.onChange(undefined);
                  }
                }}
              />
            ) : (
              <DatePicker
                mode="single"
                value={
                  field.value && field.value !== ""
                    ? (() => {
                        const date = new Date(field.value);
                        return !isNaN(date.getTime()) ? date : undefined;
                      })()
                    : undefined
                }
                onValueChange={(date) => field.onChange(date && !isNaN(date.getTime()) ? date.toISOString() : "")}
                placeholder="Select date"
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
