import { isTruthy } from "@/lib/utils";
import { DateField, WithIdAndKey } from "../types";

function generateDateComponentSourceCode(field: WithIdAndKey<DateField>) {
  let componentSourceCode = "";

  switch (field.format) {
    case "date":
      componentSourceCode += `<DatePicker
        mode="single"
        value={field.value ? new Date(field.value) : undefined}
        onValueChange={(d) => form.setValue("${field.key}", d ? d.toISOString().slice(0, 10) : "")}
      />\n`;
      break;

    case "time":
      componentSourceCode += `<TimePicker
        value={field.value}
        onValueChange={(v) => form.setValue("${field.key}", v)}
        timeFormat="${field.timeFormat || "24h"}"
      />\n`;
      break;

    case "datetime":
      componentSourceCode += `<DateTimePicker
        value={field.value ? new Date(field.value) : undefined}
        onValueChange={(d) => form.setValue("${field.key}", d ? d.toISOString() : "")}
        timeFormat="${field.timeFormat || "24h"}"
      />\n`;
      break;

    case "range":
      componentSourceCode += `<RangeDatePicker
        value={field.value}
        onValueChange={(r) => form.setValue("${field.key}", r ? { start: r.from?.toISOString().slice(0,10) ?? "", end: r.to?.toISOString().slice(0,10) ?? "" } : { start: "", end: "" })}
      />\n`;
      break;
  }

  return componentSourceCode;
}

export function generateDateFieldSourceCode(field: WithIdAndKey<DateField>) {
  let dateFieldSourceCode = "";

  dateFieldSourceCode += `<FormField\n`;
  dateFieldSourceCode += `  control={form.control}\n`;
  dateFieldSourceCode += `  name="${field.key}"\n`;
  dateFieldSourceCode += `  render={({ field }) => (\n`;
  dateFieldSourceCode += `    <FormItem>\n`;

  if (isTruthy(field.label) && field.label.length > 0) {
    dateFieldSourceCode += `      <FormLabel>${field.label}</FormLabel>\n`;
  }

  dateFieldSourceCode += `      <FormControl>\n`;
  dateFieldSourceCode += generateDateComponentSourceCode(field);
  dateFieldSourceCode += `      </FormControl>\n`;
  dateFieldSourceCode += `      <FormMessage />\n`;
  dateFieldSourceCode += `    </FormItem>\n`;
  dateFieldSourceCode += `  )}\n`;
  dateFieldSourceCode += `/>\n`;

  return dateFieldSourceCode;
}
