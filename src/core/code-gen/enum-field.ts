import { isTruthy } from "@/lib/utils";
import { EnumField, WithIdAndKey } from "../types";

export function generateComboboxStaticArray(field: WithIdAndKey<EnumField>) {
  let staticArraySourceCode = "";
  const arrayVariableName = `${field.key}_options`;

  staticArraySourceCode += `const ${arrayVariableName} = [\n`;
  field.options.forEach((option) => {
    staticArraySourceCode += `  { label: "${option.label}", value: "${option.value}" },\n`;
  });
  staticArraySourceCode += `] as const;\n\n`;

  return staticArraySourceCode;
}

function generateEnumComponentSourceCode(field: WithIdAndKey<EnumField>) {
  let enumComponentSourceCode = "";

  switch (field.format) {
    case "select":
      enumComponentSourceCode += `<Select onValueChange={field.onChange} defaultValue={field.value}>\n`;
      enumComponentSourceCode += `  <FormControl>\n`;
      enumComponentSourceCode += `    <SelectTrigger className="w-[320px]">\n`;
      enumComponentSourceCode += `      <SelectValue placeholder="${field.placeholder}" />\n`;
      enumComponentSourceCode += `    </SelectTrigger>\n`;
      enumComponentSourceCode += `  </FormControl>\n`;
      enumComponentSourceCode += `  <SelectContent>\n`;
      enumComponentSourceCode += `    ${field.options.map((option) => `<SelectItem value="${option.value}">${option.label}</SelectItem>`).join("\n")}\n`;
      enumComponentSourceCode += `  </SelectContent>\n`;
      enumComponentSourceCode += `</Select>\n`;
      break;

    case "radio":
      enumComponentSourceCode += `<FormControl>\n`;
      enumComponentSourceCode += `  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">\n`;

      field.options.forEach((option) => {
        enumComponentSourceCode += `<FormItem className="flex items-center space-y-0 space-x-3">\n`;
        enumComponentSourceCode += `  <FormControl>\n`;
        enumComponentSourceCode += `    <RadioGroupItem value="${option.value}" />\n`;
        enumComponentSourceCode += `  </FormControl>\n`;
        enumComponentSourceCode += `  <FormLabel className="font-normal">${option.label}</FormLabel>\n`;
        enumComponentSourceCode += `</FormItem>\n`;
      });

      enumComponentSourceCode += `  </RadioGroup>\n`;
      enumComponentSourceCode += `</FormControl>\n`;
      break;

    case "combobox":
      const arrayVariableName = `${field.key}_options`;

      enumComponentSourceCode += `<Popover>\n`;
      enumComponentSourceCode += `  <PopoverTrigger asChild>\n`;
      enumComponentSourceCode += `    <FormControl>\n`;
      enumComponentSourceCode += `      <Button variant="outline" role="combobox" className={cn("w-[320px] justify-between", !field.value && "text-muted-foreground")}>\n`;
      enumComponentSourceCode += `        {field.value ? ${arrayVariableName}.find((language) => language.value === field.value)?.label : "${field.placeholder}"}`;
      enumComponentSourceCode += `        <ChevronsUpDown className="opacity-50" />\n`;
      enumComponentSourceCode += `      </Button>\n`;
      enumComponentSourceCode += `    </FormControl>\n`;
      enumComponentSourceCode += `  </PopoverTrigger>\n`;
      enumComponentSourceCode += `  <PopoverContent className="w-[320px] p-0">\n`;
      enumComponentSourceCode += `    <Command>\n`;
      enumComponentSourceCode += `      <CommandInput placeholder="Search..." className="h-9" />\n`;
      enumComponentSourceCode += `      <CommandList>\n`;
      enumComponentSourceCode += `        <CommandEmpty>No matches found.</CommandEmpty>\n`;
      enumComponentSourceCode += `        <CommandGroup>\n`;

      enumComponentSourceCode += `{${arrayVariableName}.map((item) => (\n`;
      enumComponentSourceCode += `<CommandItem value={item.value} key={item.value} onSelect={() => form.setValue("${field.key}", item.value)}>\n`;
      enumComponentSourceCode += `{item.label}\n`;
      enumComponentSourceCode += `<Check className={cn("ml-auto", item.value === field.value ? "opacity-100" : "opacity-0")} />\n`;
      enumComponentSourceCode += `</CommandItem>\n`;
      enumComponentSourceCode += `))}\n`;

      enumComponentSourceCode += `        </CommandGroup>\n`;
      enumComponentSourceCode += `      </CommandList>\n`;
      enumComponentSourceCode += `    </Command>\n`;
      enumComponentSourceCode += `  </PopoverContent>\n`;
      enumComponentSourceCode += `</Popover>\n`;
      break;

    default:
      break;
  }

  return enumComponentSourceCode;
}

function generateFormItemClassName(field: WithIdAndKey<EnumField>) {
  switch (field.format) {
    case "select":
      return "flex flex-col";
    case "radio":
      return "space-y-3";
  }
  return null;
}

export function generateEnumFieldSourceCode(field: WithIdAndKey<EnumField>) {
  let enumFieldSourceCode = "";

  enumFieldSourceCode += `<FormField\n`;
  enumFieldSourceCode += `  control={form.control}\n`;
  enumFieldSourceCode += `  name="${field.key}"\n`;
  enumFieldSourceCode += `  render={({ field }) => (\n`;

  const formItemClassName = generateFormItemClassName(field);
  if (formItemClassName) {
    enumFieldSourceCode += `    <FormItem className="${formItemClassName}">\n`;
  } else {
    enumFieldSourceCode += `    <FormItem>\n`;
  }

  if (isTruthy(field.label) && field.label.length > 0) {
    enumFieldSourceCode += `<FormLabel>${field.label}</FormLabel>\n`;
  }

  enumFieldSourceCode += generateEnumComponentSourceCode(field);

  enumFieldSourceCode += `    </FormItem>\n`;
  enumFieldSourceCode += `  )}\n`;
  enumFieldSourceCode += `/>\n`;

  return enumFieldSourceCode;
}
