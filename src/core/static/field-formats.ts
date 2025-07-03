import { FieldType, FieldFormat } from "../types";

export const fieldFormats: {
  type: FieldType;
  formats: {
    format: FieldFormat;
    label: string;
  }[];
}[] = [
  {
    type: "string",
    formats: [
      { format: "email", label: "Email" },
      { format: "input", label: "Text input" },
      { format: "password", label: "Password" },
      { format: "textarea", label: "Textarea" },
      { format: "phone", label: "Phone" },
    ],
  },
  {
    type: "enum",
    formats: [
      { format: "select", label: "Select" },
      { format: "combobox", label: "Combobox" },
      { format: "radio", label: "Radio group" },
    ],
  },
  {
    type: "boolean",
    formats: [
      { format: "checkbox", label: "Checkbox" },
      { format: "switch", label: "Switch" },
    ],
  },
  {
    type: "number",
    formats: [
      { format: "input", label: "Numeric" },
      { format: "slider", label: "Slider" },
    ],
  },
  {
    type: "date",
    formats: [
      { format: "date", label: "Date" },
      { format: "time", label: "Time" },
      { format: "datetime", label: "Date and time" },
      { format: "range", label: "Date range picker" },
    ],
  },
];
