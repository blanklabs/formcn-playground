import { Field, WithIdAndKey } from "@/core/types";
import { StringDemoField } from "./string-demo-field";
import { EnumDemoField } from "./enum-demo-field";
import { Control, FieldValues, UseFormReturn } from "react-hook-form";
import { BooleanDemoField } from "./boolean-demo-field";
import { DateDemoField } from "./date-demo-field";

export function DemoField({
  field,
  formControl,
  form,
}: {
  field: WithIdAndKey<Field>;
  formControl: Control<FieldValues> | undefined;
  form: UseFormReturn<FieldValues, undefined, FieldValues>;
}) {
  switch (field.type) {
    case "string":
      return <StringDemoField field={field} formControl={formControl} />;

    case "enum":
      return <EnumDemoField field={field} formControl={formControl} form={form} />;

    case "boolean":
      return <BooleanDemoField field={field} form={form} />;

    case "date":
      return <DateDemoField field={field} formControl={formControl} />;

    default:
      break;
  }

  return null;
}
