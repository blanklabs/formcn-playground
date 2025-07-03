import { isTruthy } from "@/lib/utils";
import { BooleanField, WithIdAndKey } from "../types";

function generateBooleanFormItemClassName(field: WithIdAndKey<BooleanField>): string {
  if (field.format === "checkbox") {
    if (field.asCard) {
      return "flex flex-row items-start space-y-0 space-x-3 rounded-md border border-zinc-200 p-4";
    } else {
      return "flex flex-row items-start space-y-0 space-x-2";
    }
  }

  if (field.format === "switch") {
    if (field.asCard) {
      return "flex flex-row items-center justify-between rounded-md border border-zinc-200 p-4";
    } else {
      return "flex flex-row items-center justify-between";
    }
  }

  return "";
}

function generateBooleanInputComponentSourceCode(field: WithIdAndKey<BooleanField>) {
  let booleanInputComponentSourceCode = "";

  if (field.format === "checkbox") {
    booleanInputComponentSourceCode += `<FormItem className="${generateBooleanFormItemClassName(field)}">\n`;
    booleanInputComponentSourceCode += `  <div className="space-y-0.5">\n`;
    booleanInputComponentSourceCode += `    <FormLabel>${field.label ?? ""}</FormLabel>\n`;

    if (isTruthy(field.description) && field.description.length > 0) {
      booleanInputComponentSourceCode += `    <FormDescription>${field.description}</FormDescription>\n`;
    }

    booleanInputComponentSourceCode += `  </div>\n`;
    booleanInputComponentSourceCode += `  <FormControl>\n`;
    booleanInputComponentSourceCode += `    <Switch checked={field.value} onCheckedChange={field.onChange} />\n`;
    booleanInputComponentSourceCode += `  </FormControl>\n`;
    booleanInputComponentSourceCode += `</FormItem>\n`;
  }

  if (field.format === "switch") {
    booleanInputComponentSourceCode += `<FormItem className="${generateBooleanFormItemClassName(field)}">\n`;
    booleanInputComponentSourceCode += `  <div className="space-y-1 leading-none">\n`;
    booleanInputComponentSourceCode += `    <FormLabel>${field.label ?? ""}</FormLabel>\n`;

    if (isTruthy(field.description) && field.description.length > 0) {
      booleanInputComponentSourceCode += `    <FormDescription>${field.description}</FormDescription>\n`;
    }

    booleanInputComponentSourceCode += `  </div>\n`;
    booleanInputComponentSourceCode += `  <FormControl>\n`;
    booleanInputComponentSourceCode += `    <Switch checked={field.value} onCheckedChange={field.onChange} />\n`;
    booleanInputComponentSourceCode += `  </FormControl>\n`;
    booleanInputComponentSourceCode += `</FormItem>\n`;
  }

  return booleanInputComponentSourceCode;
}

export function generateBooleanFieldSourceCode(field: WithIdAndKey<BooleanField>) {
  let stringFieldSourceCode = "";

  stringFieldSourceCode += `<FormField\n`;
  stringFieldSourceCode += `  control={form.control}\n`;
  stringFieldSourceCode += `  name="${field.key}"\n`;
  stringFieldSourceCode += `  render={({ field }) => (\n`;
  stringFieldSourceCode += generateBooleanInputComponentSourceCode(field);
  stringFieldSourceCode += `  )}\n`;
  stringFieldSourceCode += `/>\n`;

  return stringFieldSourceCode;
}
