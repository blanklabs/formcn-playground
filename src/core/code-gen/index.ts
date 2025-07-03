import { FORM_SCHEMA_VARIABLE_NAME } from "../static/source-code";
import { Field, Form, WithIdAndKey, EnumField, DateField } from "../types";
import { generateBooleanFieldSourceCode } from "./boolean-field";
import { generateComboboxStaticArray, generateEnumFieldSourceCode } from "./enum-field";
import { generateStringFieldSourceCode } from "./string-field";
import { generateDateFieldSourceCode } from "./date-field";

function generateFieldSpecificImports(fields: Field[]) {
  let imports = "";
  const allFieldFormats = [...new Set(fields.map((field) => field.format))];

  allFieldFormats.forEach((format) => {
    switch (format) {
      case "email":
      case "input":
      case "password":
        imports += `import { Input } from "@/components/ui/input";\n`;
        break;
      case "textarea":
        imports += `import { Textarea } from "@/components/ui/textarea";\n`;
        break;
      case "phone":
        imports += `import { PhoneInput } from "@/components/ui/phone-input";\n`;
        break;

      case "radio":
        imports += `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";\n`;
        break;

      case "select":
        imports += `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";\n`;
        break;

      case "combobox":
        imports += `import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";\n`;
        imports += `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"\n`;
        imports += `import { Check, ChevronsUpDown } from "lucide-react";\n`;
        imports += `import { cn } from "@/lib/utils";\n`;
        break;

      case "checkbox":
        imports += `import { Checkbox } from "@/components/ui/checkbox";\n`;
        break;

      case "switch":
        imports += `import { Switch } from "@/components/ui/switch";\n`;
        break;

      case "date":
        imports += `import { DatePicker } from "@/components/date-picker";\n`;
        break;

      case "time":
        imports += `import { TimePicker } from "@/components/time-picker";\n`;
        break;

      case "datetime":
        imports += `import { DateTimePicker } from "@/components/date-time-picker";\n`;
        break;

      case "range":
        imports += `import { RangeDatePicker } from "@/components/range-date-picker";\n`;
        break;
    }
  });

  return imports;
}

function generateDefaultFieldValue(
  field: WithIdAndKey<Field>,
  defaultValues: Record<string, string | boolean | number | { start: string; end: string }>,
) {
  switch (field.type) {
    case "string":
      return `${field.key}: "${defaultValues[field.key] || ""}",`;

    case "enum":
      if (field.format === "radio") {
        return "";
      }
      return `${field.key}: "${defaultValues[field.key] || ""}",`;

    case "boolean":
      return `${field.key}: false,`;

    case "date":
      if (field.format === "range") {
        const defaultRange = defaultValues[field.key] || { start: "", end: "" };
        return `${field.key}: { start: "${defaultRange.start}", end: "${defaultRange.end}" },`;
      }
      return `${field.key}: "${defaultValues[field.key] || ""}",`;
  }
  return `""`;
}

function getSubmitHandler() {
  return `\n// Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
    }\n\n`;
}

function generateMetadataSourceCode(metadata: Form["metadata"]) {
  if (metadata.title === "" && metadata.description === "") {
    return "\n";
  }

  let metadataSourceCode = "";
  metadataSourceCode += "<div>";
  if (metadata.title !== "") {
    metadataSourceCode += `<h1 className="text-3xl font-bold tracking-tight mb-1.5">${metadata.title}</h1>`;
  }
  if (metadata.description !== "") {
    metadataSourceCode += `<p className="text-base text-zinc-500">${metadata.description}</p>`;
  }
  metadataSourceCode += "</div>\n";

  return metadataSourceCode;
}

function generateFieldsSourceCode(fields: WithIdAndKey<Field>[]) {
  let fieldsSourceCode = "";

  fields.forEach((field) => {
    switch (field.type) {
      case "string":
        fieldsSourceCode += generateStringFieldSourceCode(field);
        break;

      case "enum":
        fieldsSourceCode += generateEnumFieldSourceCode(field);
        break;

      case "boolean":
        fieldsSourceCode += generateBooleanFieldSourceCode(field);
        break;

      case "date":
        fieldsSourceCode += generateDateFieldSourceCode(field as WithIdAndKey<DateField>);
        break;

      default:
        break;
    }
  });

  return fieldsSourceCode;
}

export function generateSourceCode({
  schemaSourceCode,
  defaultValues,
  form,
}: {
  schemaSourceCode: string;
  defaultValues: Record<string, string | boolean | number | { start: string; end: string }>;
  form: Form;
}) {
  let sourceCode = "";

  // 1. Add "use client" directive
  sourceCode += '"use client";\n';

  // 2. Add imports
  sourceCode += `import { z } from "zod";\n`;
  sourceCode += `import { zodResolver } from "@hookform/resolvers/zod"\n`;
  sourceCode += `import { useForm } from "react-hook-form"\n`;
  sourceCode += `import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"\n`;
  sourceCode += `import { Button } from "@/components/ui/button"\n`;
  sourceCode += generateFieldSpecificImports(form.fields);
  sourceCode += `\n`;

  // 3. Optionally, add static array for combobox options
  const comboboxFields = form.fields.filter((field): field is WithIdAndKey<EnumField> => field.format === "combobox");

  if (comboboxFields.length > 0) {
    comboboxFields.forEach((field) => {
      sourceCode += generateComboboxStaticArray(field);
    });
  }

  // 3. Add Zod schema
  sourceCode += `${schemaSourceCode}\n\n`;

  // 4. Add React component function
  sourceCode += `export function ProfileForm() {\n`;
  sourceCode += `  const form = useForm<z.infer<typeof ${FORM_SCHEMA_VARIABLE_NAME}>>({\n`;
  sourceCode += `    resolver: zodResolver(${FORM_SCHEMA_VARIABLE_NAME}),\n`;
  sourceCode += `    defaultValues: {\n`;
  // sourceCode += form.fields.map((field) => `${field.key}: ${generateDefaultFieldValue(field, defaultValues)},`).join("\n");
  sourceCode += form.fields.map((field) => generateDefaultFieldValue(field, defaultValues)).join("\n");
  sourceCode += `    },\n`;
  sourceCode += `  }),\n`;

  sourceCode += getSubmitHandler();

  sourceCode += `return (\n`;
  sourceCode += `   <Form {...form}>\n`;
  sourceCode += `     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">\n`;
  sourceCode += generateMetadataSourceCode(form.metadata);
  sourceCode += generateFieldsSourceCode(form.fields);
  sourceCode += `     </form>\n`;
  sourceCode += `   </Form>\n`;
  sourceCode += `)\n`;

  sourceCode += `}\n`;

  return sourceCode;
}
