import { FieldWithIdAndKey } from "@/core/types";

import { StringFieldCard } from "./string-field-card";
import { EnumFieldCard } from "./enum-field-card";
import { BooleanFieldCard } from "./boolean-field-card";
import { DateFieldCard } from "./date-field-card";

export function FieldCard({ field }: { field: FieldWithIdAndKey }) {
  switch (field.type) {
    case "string":
      return <StringFieldCard field={field} />;

    case "enum":
      return <EnumFieldCard field={field} />;

    case "boolean":
      return <BooleanFieldCard field={field} />;

    case "date":
      return <DateFieldCard field={field} />;

    default:
      break;
  }

  return null;
}
