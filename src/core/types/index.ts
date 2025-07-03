import { z } from "zod";

export const StringFieldFormatSchema = z.enum(["input", "textarea", "email", "password", "phone"]);
export const EnumFieldFormatSchema = z.enum(["select", "combobox", "radio"]);
export const BooleanFieldFormatSchema = z.enum(["checkbox", "switch"]);
export const NumberFieldFormatSchema = z.enum(["slider", "input"]);
export const DateFieldFormatSchema = z.enum(["date", "time", "datetime", "range"]);
export const FieldTypeSchema = z.enum(["string", "enum", "boolean", "number", "date"]);

export enum StringFieldFormat {
  Input = "input",
  Textarea = "textarea",
  Email = "email",
  Password = "password",
  Phone = "phone",
}

export enum EnumFieldFormat {
  Select = "select",
  Combobox = "combobox",
  Radio = "radio",
}

export enum BooleanFieldFormat {
  Checkbox = "checkbox",
  Switch = "switch",
}

export enum NumberFieldFormat {
  Slider = "slider",
  Input = "input",
}

export enum DateFieldFormat {
  Date = "date",
  Time = "time",
  DateTime = "datetime",
  Range = "range",
}

export type FieldFormat =
  | StringFieldFormat
  | EnumFieldFormat
  | BooleanFieldFormat
  | NumberFieldFormat
  | DateFieldFormat;

export enum FieldType {
  String = "string",
  Enum = "enum",
  Boolean = "boolean",
  Number = "number",
  Date = "date",
}

export type StringField = {
  type: FieldType.String;
  format: StringFieldFormat;
  label?: string;
  placeholder?: string;
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
};

export type EnumField = {
  type: FieldType.Enum;
  format: EnumFieldFormat;
  label?: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
};

export type BooleanField = {
  type: FieldType.Boolean;
  format: BooleanFieldFormat;
  label?: string;
  description?: string;
  asCard: boolean;
};

export type NumberField = {
  type: FieldType.Number;
  format: NumberFieldFormat;
  label?: string;
  placeholder?: string;
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
};

export type DateField = {
  type: FieldType.Date;
  format: DateFieldFormat;
  label?: string;
  required: boolean;
  pastEnabled: boolean;
  futureEnabled: boolean;
  timeFormat?: "12h" | "24h";
  minDate?: string;
  maxDate?: string;
  defaultValue?: string | { start: string; end: string };
};

export type Field = StringField | EnumField | BooleanField | NumberField | DateField;

export type WithIdAndKey<T> = T & { id: number; key: string };

export type FieldWithIdAndKey = WithIdAndKey<Field>;

export type FormMetadata = {
  title: string;
  description: string;
  submitButtonLabel: string;
  submitButtonColor: string;
  submitButtonShade: number;
  buttonWidthFull: boolean;
  showBackground: boolean;
  backgroundColor: string;
  backgroundShade: number;
};

export type Form = {
  name: string;
  metadata: FormMetadata;
  fields: FieldWithIdAndKey[];
};

export const PaginatedSchema = z.object({
  total: z.number(),
  message: z.string(),
});

export const WaitlistReturnSchema = PaginatedSchema.extend({
  data: z.object({
    email: z.string().email(),
  }),
});
