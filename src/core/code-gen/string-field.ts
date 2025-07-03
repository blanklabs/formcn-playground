import { isTruthy } from "@/lib/utils";
import { StringField, WithIdAndKey } from "../types";

function generateStringInputComponentSourceCode(field: WithIdAndKey<StringField>) {
  let stringInputComponentSourceCode = "";

  switch (field.format) {
    case "input":
      stringInputComponentSourceCode += `<Input ${
        isTruthy(field.placeholder) && field.placeholder !== "" ? `placeholder="${field.placeholder}"` : ``
      } {...field} />\n`;
      break;

    case "email":
      stringInputComponentSourceCode += `<Input type="email" ${
        isTruthy(field.placeholder) && field.placeholder !== "" ? `placeholder="${field.placeholder}"` : ``
      } {...field} />\n`;
      break;

    case "password":
      stringInputComponentSourceCode += `<Input type="password" ${
        isTruthy(field.placeholder) && field.placeholder !== "" ? `placeholder="${field.placeholder}"` : ``
      } {...field} />\n`;
      break;

    case "textarea":
      stringInputComponentSourceCode += `<Textarea ${
        isTruthy(field.placeholder) && field.placeholder !== "" ? `placeholder="${field.placeholder}"` : ``
      } {...field} />\n`;
      break;

    case "phone":
      stringInputComponentSourceCode += `<PhoneInput ${
        isTruthy(field.placeholder) && field.placeholder !== "" ? `placeholder="${field.placeholder}"` : ``
      } defaultCountry="US" {...field} />\n`;
      break;

    default:
      break;
  }

  return stringInputComponentSourceCode;
}

export function generateStringFieldSourceCode(field: WithIdAndKey<StringField>) {
  let stringFieldSourceCode = "";

  stringFieldSourceCode += `<FormField\n`;
  stringFieldSourceCode += `  control={form.control}\n`;
  stringFieldSourceCode += `  name="${field.key}"\n`;
  stringFieldSourceCode += `  render={({ field }) => (\n`;
  stringFieldSourceCode += `    <FormItem>\n`;

  if (field.label) {
    stringFieldSourceCode += `      <FormLabel>${field.label}</FormLabel>\n`;
  }

  stringFieldSourceCode += `      <FormControl>\n`;
  stringFieldSourceCode += generateStringInputComponentSourceCode(field);
  stringFieldSourceCode += `      </FormControl>\n`;
  stringFieldSourceCode += `      <FormMessage />\n`;
  stringFieldSourceCode += `    </FormItem>\n`;
  stringFieldSourceCode += `  )}\n`;
  stringFieldSourceCode += `/>\n`;

  return stringFieldSourceCode;
}
