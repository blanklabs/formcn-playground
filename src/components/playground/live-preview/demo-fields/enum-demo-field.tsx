import { Control, FieldValues, UseFormReturn } from "react-hook-form";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { EnumField, WithIdAndKey } from "@/core/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function EnumDemoField({
  field: fieldSpec,
  formControl,
  form,
}: {
  field: WithIdAndKey<EnumField>;
  formControl: Control<FieldValues> | undefined;
  form: UseFormReturn<FieldValues, undefined, FieldValues>;
}) {
  if (fieldSpec.format === "select") {
    return (
      <FormField
        control={formControl}
        name={fieldSpec.key}
        render={({ field }) => (
          <FormItem>
            {fieldSpec.label && <FormLabel>{fieldSpec.label}</FormLabel>}
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-[320px]">
                  <SelectValue placeholder={fieldSpec.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fieldSpec.options.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (fieldSpec.format === "radio") {
    return (
      <FormField
        control={formControl}
        name={fieldSpec.key}
        render={({ field }) => (
          <FormItem className="space-y-3">
            {fieldSpec.label && <FormLabel>{fieldSpec.label}</FormLabel>}
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                {fieldSpec.options.map(({ label, value }) => (
                  <FormItem key={value} className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={formControl}
      name={fieldSpec.key}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {fieldSpec.label && <FormLabel>{fieldSpec.label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn("w-[320px] justify-between", !field.value && "text-muted-foreground")}
                >
                  {field.value
                    ? fieldSpec.options.find(({ value }) => value === field.value)?.label
                    : fieldSpec.placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0">
              <Command>
                <CommandInput placeholder="Search..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No matches found.</CommandEmpty>
                  <CommandGroup>
                    {fieldSpec.options.map(({ label, value }) => (
                      <CommandItem value={value} key={value} onSelect={() => form.setValue(fieldSpec.key, value)}>
                        {label}
                        <Check className={cn("ml-auto", value === field.value ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
