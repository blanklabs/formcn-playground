import { Control, FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { StringField, WithIdAndKey } from "@/core/types";

export function StringDemoField({
  field: fieldSpec,
  formControl,
}: {
  field: WithIdAndKey<StringField>;
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
            {fieldSpec.format === "input" ? (
              <Input placeholder={fieldSpec.placeholder} {...field} />
            ) : fieldSpec.format === "textarea" ? (
              <Textarea placeholder={fieldSpec.placeholder} {...field} />
            ) : fieldSpec.format === "email" ? (
              <Input type="email" placeholder={fieldSpec.placeholder} {...field} />
            ) : fieldSpec.format === "password" ? (
              <Input type="password" placeholder={fieldSpec.placeholder} {...field} />
            ) : fieldSpec.format === "phone" ? (
              <PhoneInput placeholder={fieldSpec.placeholder} defaultCountry="US" {...field} />
            ) : (
              <Input placeholder={fieldSpec.placeholder} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
