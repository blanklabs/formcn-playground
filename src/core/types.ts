import { z } from "zod";

export const StringFieldFormatSchema = z.enum(["input", "textarea", "email", "password", "phone"]);
export const EnumFieldFormatSchema = z.enum(["select", "combobox", "radio"]);
export const BooleanFieldFormatSchema = z.enum(["checkbox", "switch"]);
export const NumberFieldFormatSchema = z.enum(["slider", "input"]);
export const DateFieldFormatSchema = z.enum(["date", "time", "datetime", "range"]);

export type StringFieldFormat = z.infer<typeof StringFieldFormatSchema>;
export type EnumFieldFormat = z.infer<typeof EnumFieldFormatSchema>;
export type BooleanFieldFormat = z.infer<typeof BooleanFieldFormatSchema>;
export type NumberFieldFormat = z.infer<typeof NumberFieldFormatSchema>;
export type DateFieldFormat = z.infer<typeof DateFieldFormatSchema>;

export type FieldFormat =
  | StringFieldFormat
  | EnumFieldFormat
  | BooleanFieldFormat
  | NumberFieldFormat
  | DateFieldFormat;

export const FieldTypeSchema = z.enum(["string", "enum", "boolean", "number", "date"]);
export type FieldType = z.infer<typeof FieldTypeSchema>;

export const StringFieldSchema = z.object({
  type: z.literal("string"),
  format: StringFieldFormatSchema,
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
});
export type StringField = z.infer<typeof StringFieldSchema>;

export const EnumFieldSchema = z.object({
  type: z.literal("enum"),
  format: EnumFieldFormatSchema,
  label: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
});
export type EnumField = z.infer<typeof EnumFieldSchema>;

export const BooleanFieldSchema = z.object({
  type: z.literal("boolean"),
  format: BooleanFieldFormatSchema,
  label: z.string().optional(),
  description: z.string().optional(),
  asCard: z.boolean(),
});
export type BooleanField = z.infer<typeof BooleanFieldSchema>;

export const NumberFieldSchema = z.object({
  type: z.literal("number"),
  format: NumberFieldFormatSchema,
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});
export type NumberField = z.infer<typeof NumberFieldSchema>;

export const DateFieldSchema = z.object({
  type: z.literal("date"),
  format: DateFieldFormatSchema,
  label: z.string().optional(),
  required: z.boolean(),
  pastEnabled: z.boolean(),
  futureEnabled: z.boolean(),
  timeFormat: z.enum(["12h", "24h"]).optional(),
  minDate: z.string().optional(),
  maxDate: z.string().optional(),
  defaultValue: z
    .union([
      z.string(),
      z.object({
        start: z.string(),
        end: z.string(),
      }),
    ])
    .optional(),
});

export type DateField = z.infer<typeof DateFieldSchema>;

export const FieldSchema = z.discriminatedUnion("type", [
  StringFieldSchema,
  EnumFieldSchema,
  BooleanFieldSchema,
  NumberFieldSchema,
  DateFieldSchema,
]);
export type Field = z.infer<typeof FieldSchema>;

export const FieldWithIdAndKeySchema = z.intersection(
  FieldSchema,
  z.object({
    id: z.number(),
    key: z.string(),
  }),
);
export type FieldWithIdAndKey = z.infer<typeof FieldWithIdAndKeySchema>;

export type WithIdAndKey<T> = T & { id: number; key: string };

const FormMetadataSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(300),
  submitButtonLabel: z.string(),
  submitButtonColor: z.string(),
  submitButtonShade: z.number(),
  buttonWidthFull: z.boolean(),
  showBackground: z.boolean(),
  backgroundColor: z.string(),
  backgroundShade: z.number(),
});
export type FormMetadata = z.infer<typeof FormMetadataSchema>;

export const FormSchema = z.object({
  name: z.string().max(100),
  metadata: FormMetadataSchema,
  fields: z.array(FieldWithIdAndKeySchema),
});
export type Form = z.infer<typeof FormSchema>;
