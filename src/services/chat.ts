import "server-only";
import { z } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

import { Form, EnumFieldFormat, StringFieldFormat, BooleanFieldFormat } from "@/core/types";

const systemPrompt = `You are a helpful assistant that helps users generate forms for web applications adhering to the response schema. Users will provide you with a description of the form they want to create and you will generate the form.
    
IMPORTANT: Every field MUST include:
- fieldName (camelCase)
- type (string, enum, or boolean)
- renderFormat (must match the field type - see table below)
- label
- placeholder
- isRequired (true or false)
- description (can be null)
- options (array - only for enum fields, empty array for others)

1. Fields
    - There are three types of fields:
      - string
      - enum
      - boolean

2. Rendering formats
    - Each field type has a different rendering format.
    - A rendering format can only be used for its corresponding field type.
  
| Field type | Rendering formats                |
| ---------- | -------------------------------- |
| string     | input, textarea, email, password |
| enum       | select, combobox, radio          |
| boolean    | checkbox, switch                 |

3. Options
    - Options are only used for enum fields.
    - Options are an array of objects with a label and value.
    
4. Field Name
    - Each field has a unique fieldName. The fieldName property will be used as the key in the form data.
    - Should be written in camelCase.
    - Example of fieldName: for a sign-up form with fields for email, password and a checkbox for terms of service, the fieldNames could be "email", "password" and "agreesToTerms".`;

const chatFormSchema = z.object({
  formTitle: z.string(),
  formDescription: z.string(),
  submitButtonText: z.string(),
  fields: z.array(
    z.object({
      fieldName: z.string(),
      type: z.enum(["string", "enum", "boolean"]),
      renderFormat: z.enum([
        "input",
        "textarea",
        "email",
        "password",
        "select",
        "combobox",
        "radio",
        "checkbox",
        "switch",
      ]),
      label: z.string(),
      placeholder: z.string(),
      isRequired: z.boolean(),
      description: z.string().nullable(),
      options: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      ),
    }),
  ),
});

export type ChatFormSchema = z.infer<typeof chatFormSchema>;

const strictStringFieldSchema = z.object({
  fieldName: z.string(),
  type: z.literal("string"),
  renderFormat: z.enum(["input", "textarea", "email", "password"]),
  label: z.string(),
  placeholder: z.string(),
  isRequired: z.boolean(),
  description: z.string().nullable(),
  options: z.array(z.never()),
});

const strictEnumFieldSchema = z.object({
  fieldName: z.string(),
  type: z.literal("enum"),
  renderFormat: z.enum(["select", "combobox", "radio"]),
  label: z.string(),
  placeholder: z.string(),
  isRequired: z.boolean(),
  description: z.string().nullable(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .min(1),
});

const strictBooleanFieldSchema = z.object({
  fieldName: z.string(),
  type: z.literal("boolean"),
  renderFormat: z.enum(["checkbox", "switch"]),
  label: z.string(),
  placeholder: z.string(),
  isRequired: z.boolean(),
  description: z.string().nullable(),
  options: z.array(z.never()),
});

const strictFieldSchema = z.union([strictStringFieldSchema, strictEnumFieldSchema, strictBooleanFieldSchema]);

const strictFormSchema = z.object({
  formTitle: z.string(),
  formDescription: z.string(),
  submitButtonText: z.string(),
  fields: z.array(strictFieldSchema),
});

export async function generateFormFromUserPrompt(prompt: string) {
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schemaName: "Form",
    schemaDescription: "A form that will be used in a web application.",
    schema: chatFormSchema,
    system: systemPrompt,
    prompt: prompt,
  });

  const validatedResult = strictFormSchema.parse(object);

  const formSpec: Form = {
    metadata: {
      title: validatedResult.formTitle,
      description: validatedResult.formDescription,
      submitButtonLabel: validatedResult.submitButtonText,
      submitButtonColor: "zinc",
      submitButtonShade: 900,
      buttonWidthFull: false,
      showBackground: true,
      backgroundColor: "slate",
      backgroundShade: 900,
    },
    fields: validatedResult.fields.map((field, index) => {
      switch (field.type) {
        case "string":
          return {
            id: index + 1,
            key: field.fieldName,
            type: "string",
            format: field.renderFormat as StringFieldFormat,
            label: field.label,
            placeholder: field.placeholder,
            required: field.isRequired,
          };

        case "enum":
          return {
            id: index + 1,
            key: field.fieldName,
            type: "enum",
            format: field.renderFormat as EnumFieldFormat,
            label: field.label,
            placeholder: field.placeholder,
            options: field.options,
          };

        case "boolean":
          return {
            id: index + 1,
            key: field.fieldName,
            type: "boolean",
            format: field.renderFormat as BooleanFieldFormat,
            label: field.label,
            description: field.description ?? undefined,
            asCard: true,
          };
      }
    }),
  };

  return formSpec;
}
