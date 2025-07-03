import { z } from "zod";
import { Field, WithIdAndKey } from "./types";
import { FORM_SCHEMA_VARIABLE_NAME } from "./static/source-code";

export function generateFieldKey(fieldId: number) {
  return `field_${fieldId}`;
}

function parseField(field: WithIdAndKey<Field>) {
  let fieldZodSchema;
  let propValueInSourceCode;

  switch (field.type) {
    case "string":
      fieldZodSchema = z.string();
      propValueInSourceCode = "z.string()";
      if (field.min) {
        fieldZodSchema = fieldZodSchema.min(field.min);
        propValueInSourceCode += `.min(${field.min})`;
      }
      if (field.max) {
        fieldZodSchema = fieldZodSchema.max(field.max);
        propValueInSourceCode += `.max(${field.max})`;
      }
      if (field.pattern) {
        fieldZodSchema = fieldZodSchema.regex(new RegExp(field.pattern));
        propValueInSourceCode += `.regex(new RegExp(${JSON.stringify(field.pattern)}))`;
      }

      if (field.format === "email") {
        return {
          fieldZodSchema: field.required ? fieldZodSchema.email() : fieldZodSchema.email().optional(),
          propValueInSourceCode: field.required
            ? `${propValueInSourceCode}.email()`
            : `${propValueInSourceCode}.email().optional()`,
          defaultValue: "",
        };
      } else if (field.format === "phone") {
        return {
          fieldZodSchema: field.required ? fieldZodSchema : fieldZodSchema.optional(),
          propValueInSourceCode: field.required ? propValueInSourceCode : `${propValueInSourceCode}.optional()`,
          defaultValue: "",
        };
      } else {
        return {
          fieldZodSchema:
            field.required && field.min === undefined
              ? fieldZodSchema.min(1)
              : field.required
                ? fieldZodSchema
                : fieldZodSchema.optional(),
          propValueInSourceCode:
            field.required && field.min === undefined
              ? `${propValueInSourceCode}.min(1)`
              : field.required
                ? propValueInSourceCode
                : `${propValueInSourceCode}.optional()`,
          defaultValue: "",
        };
      }

    case "enum":
      if (field.format === "radio") {
        const options = field.options.map((option) => option.value) as [string, ...string[]];

        return {
          fieldZodSchema: z.enum(options),
          propValueInSourceCode: `z.enum(${JSON.stringify(options)})`,
          defaultValue: undefined,
        };
      }

      return {
        fieldZodSchema: z.string(),
        propValueInSourceCode: `z.string()`,
        defaultValue: "",
      };

    case "boolean":
      return {
        fieldZodSchema: z.boolean().default(false),
        propValueInSourceCode: `z.boolean().default(false)`,
        defaultValue: false,
      };

    case "date":
      fieldZodSchema = z.string();
      propValueInSourceCode = "z.string()";

      switch (field.format) {
        case "date":
          // Apply date range validation for date fields
          if (field.minDate) {
            fieldZodSchema = fieldZodSchema.refine(
              (date) => {
                const inputDate = new Date(date);
                if (isNaN(inputDate.getTime())) return false; // Invalid date format
                const minDate = new Date(field.minDate!);
                return inputDate >= minDate;
              },
              { message: `Date must be on or after ${field.minDate}` },
            );
            propValueInSourceCode += `.refine((date) => {
              const inputDate = new Date(date);
              if (isNaN(inputDate.getTime())) return false;
              const minDate = new Date(${JSON.stringify(field.minDate)});
              return inputDate >= minDate;
            }, { message: "Date must be on or after " + ${JSON.stringify(field.minDate)} + "" })`;
          }
          if (field.maxDate) {
            fieldZodSchema = fieldZodSchema.refine(
              (date) => {
                const inputDate = new Date(date);
                if (isNaN(inputDate.getTime())) return false; // Invalid date format
                const maxDate = new Date(field.maxDate!);
                return inputDate <= maxDate;
              },
              { message: `Date must be on or before ${field.maxDate}` },
            );
            propValueInSourceCode += `.refine((date) => {
              const inputDate = new Date(date);
              if (isNaN(inputDate.getTime())) return false;
              const maxDate = new Date(${JSON.stringify(field.maxDate)});
              return inputDate <= maxDate;
            }, { message: "Date must be on or before " + ${JSON.stringify(field.maxDate)} + "" })`;
          }

          // Make optional if not required
          if (!field.required) {
            fieldZodSchema = fieldZodSchema.optional();
            propValueInSourceCode += ".optional()";
          }

          return {
            fieldZodSchema,
            propValueInSourceCode,
            defaultValue: "",
          };

        case "time":
          if (!field.required) {
            fieldZodSchema = fieldZodSchema.optional();
            propValueInSourceCode += ".optional()";
          }

          return {
            fieldZodSchema,
            propValueInSourceCode,
            defaultValue: "",
          };

        case "datetime":
          // Apply date range validation for datetime fields
          if (field.minDate) {
            fieldZodSchema = fieldZodSchema.refine(
              (date) => {
                const inputDate = new Date(date);
                if (isNaN(inputDate.getTime())) return false; // Invalid date format
                const minDate = new Date(field.minDate!);
                return inputDate >= minDate;
              },
              { message: `Date must be on or after ${field.minDate}` },
            );
            propValueInSourceCode += `.refine((date) => {
              const inputDate = new Date(date);
              if (isNaN(inputDate.getTime())) return false;
              const minDate = new Date(${JSON.stringify(field.minDate)});
              return inputDate >= minDate;
            }, { message: "Date must be on or after " + ${JSON.stringify(field.minDate)} + "" })`;
          }
          if (field.maxDate) {
            fieldZodSchema = fieldZodSchema.refine(
              (date) => {
                const inputDate = new Date(date);
                if (isNaN(inputDate.getTime())) return false; // Invalid date format
                const maxDate = new Date(field.maxDate!);
                return inputDate <= maxDate;
              },
              { message: `Date must be on or before ${field.maxDate}` },
            );
            propValueInSourceCode += `.refine((date) => {
              const inputDate = new Date(date);
              if (isNaN(inputDate.getTime())) return false;
              const maxDate = new Date(${JSON.stringify(field.maxDate)});
              return inputDate <= maxDate;
            }, { message: "Date must be on or before " + ${JSON.stringify(field.maxDate)} + "" })`;
          }

          // Make optional if not required
          if (!field.required) {
            fieldZodSchema = fieldZodSchema.optional();
            propValueInSourceCode += ".optional()";
          }

          return {
            fieldZodSchema,
            propValueInSourceCode,
            defaultValue: "",
          };

        case "range":
          const startSchema = z.string().min(1);
          const endSchema = z.string().min(1);
          const startSourceCode = "z.string().min(1)";
          const endSourceCode = "z.string().min(1)";

          const rangeSchema = z.object({
            start: startSchema,
            end: endSchema,
          });

          fieldZodSchema = field.required ? rangeSchema : rangeSchema.optional();
          propValueInSourceCode = field.required
            ? `z.object({ start: ${startSourceCode}, end: ${endSourceCode} })`
            : `z.object({ start: ${startSourceCode}, end: ${endSourceCode} }).optional()`;

          return {
            fieldZodSchema,
            propValueInSourceCode,
            defaultValue: { start: "", end: "" },
          };
      }
      break;
  }

  return null;
}

export function generateFormZodSchema(fields: WithIdAndKey<Field>[]) {
  const defaultValues: Record<string, string | boolean | number | { start: string; end: string }> = {};
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const schemaSourceKeyValues: Record<string, string> = {};

  fields.forEach((field) => {
    const parsedField = parseField(field);
    if (!parsedField) return;

    const { fieldZodSchema, defaultValue, propValueInSourceCode } = parsedField;
    schemaShape[field.key] = fieldZodSchema;
    defaultValues[field.key] = defaultValue;
    schemaSourceKeyValues[field.key] = propValueInSourceCode;
  });

  const schemaSourceCode =
    `const ${FORM_SCHEMA_VARIABLE_NAME} = z.object({\n` +
    Object.entries(schemaSourceKeyValues)
      .map(([key, value]) => `  ${key}: ${value},`)
      .join("\n") +
    `\n});`;

  return {
    formSchema: z.object(schemaShape),
    schemaSourceCode: schemaSourceCode,
    defaultValues,
  };
}
