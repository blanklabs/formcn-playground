import { FieldValues, UseFormReturn } from "react-hook-form";
import { BooleanField, WithIdAndKey } from "@/core/types";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { cn, isTruthy } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export function BooleanDemoField({
  field: fieldSpec,
  form,
}: {
  field: WithIdAndKey<BooleanField>;
  form: UseFormReturn<FieldValues, undefined, FieldValues>;
}) {
  if (fieldSpec.format === "checkbox") {
    return (
      <FormField
        control={form.control}
        name={fieldSpec.key}
        render={({ field }) => (
          <FormItem
            className={cn(
              "flex flex-row items-start space-y-0 space-x-2",
              fieldSpec.asCard && "space-x-3 rounded-md border border-zinc-200 p-4",
            )}
          >
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{fieldSpec.label}</FormLabel>
              {isTruthy(fieldSpec.description) && fieldSpec.description.length > 0 && (
                <FormDescription>{fieldSpec.description}</FormDescription>
              )}
            </div>
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name={fieldSpec.key}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between",
            fieldSpec.asCard && "rounded-md border border-zinc-200 p-4",
          )}
        >
          <div className="space-y-0.5">
            <FormLabel>{fieldSpec.label}</FormLabel>
            {isTruthy(fieldSpec.description) && fieldSpec.description.length > 0 && (
              <FormDescription>{fieldSpec.description}</FormDescription>
            )}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
