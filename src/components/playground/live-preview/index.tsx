"use client";
import { usePlaygroundStore } from "@/stores/playground";

import { FormPreview } from "./form-preview";
import { CodePreview } from "./code-preview";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { generateFormZodSchema } from "@/core";
import { generateSourceCode } from "@/core/code-gen";

export function LivePreview() {
  const { form, currentTab } = usePlaygroundStore();
  const { formSchema, defaultValues, schemaSourceCode } = generateFormZodSchema(form.fields);
  const sourceCode = generateSourceCode({
    schemaSourceCode,
    form,
    defaultValues,
  });

  return (
    <Fragment>
      <FormPreview
        className={cn(currentTab !== "form" && "hidden")}
        formSchema={formSchema}
        defaultValues={defaultValues}
      />
      <CodePreview className={cn(currentTab !== "code" && "hidden")} sourceCode={sourceCode} />
    </Fragment>
  );
}
