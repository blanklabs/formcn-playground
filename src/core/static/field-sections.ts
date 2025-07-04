import {
  Type,
  Text,
  AtSign,
  Lock,
  ListCheck,
  Search,
  CircleDot,
  SquareCheck,
  ToggleRight,
  LucideIcon,
  LetterText,
  Phone,
  Calendar,
  Clock,
  CalendarDays,
  CalendarClock,
  Hash,
  SlidersHorizontal,
  ChevronDown,
  Calculator,
} from "lucide-react";

import { Field, FieldType } from "@/core/types";

export const fieldSections: {
  type: FieldType;
  sectionName: string;
  accentBackground: string;
  fields: {
    title: string;
    description: string;
    type: string;
    format: string;
    icon: LucideIcon;
    fieldToAdd: Field;
  }[];
  icon: LucideIcon;
}[] = [
  {
    type: "string",
    sectionName: "String fields",
    accentBackground: "bg-blue-600",
    icon: LetterText,
    fields: [
      {
        title: "Text Input",
        description: "Single-line text input field",
        type: "string",
        format: "input",
        icon: Type,
        fieldToAdd: {
          type: "string",
          format: "input",
          label: "My string field",
          placeholder: "Insert placeholder here...",
          required: true,
        },
      },
      {
        title: "Text Area",
        description: "Multi-line text input field",
        type: "string",
        format: "textarea",
        icon: Text,
        fieldToAdd: {
          type: "string",
          format: "textarea",
          label: "My string field",
          placeholder: "Insert placeholder here...",
          required: true,
        },
      },
      {
        title: "Email",
        description: "Input field for email addresses",
        type: "string",
        format: "email",
        icon: AtSign,
        fieldToAdd: {
          type: "string",
          format: "email",
          label: "My string field",
          placeholder: "Insert placeholder here...",
          required: true,
        },
      },
      {
        title: "Password",
        description: "Secure input field for passwords",
        type: "string",
        format: "password",
        icon: Lock,
        fieldToAdd: {
          type: "string",
          format: "password",
          label: "My string field",
          placeholder: "Insert placeholder here...",
          required: true,
        },
      },
      {
        title: "Phone",
        description: "Input field for phone numbers",
        type: "string",
        format: "phone",
        icon: Phone,
        fieldToAdd: {
          type: "string",
          format: "phone",
          label: "My string field",
          placeholder: "Insert placeholder here...",
          required: true,
        },
      },
    ],
  },
  {
    type: "enum",
    sectionName: "Enum fields",
    accentBackground: "bg-green-600",
    icon: ListCheck,
    fields: [
      {
        title: "Select",
        description: "Dropdown selection from a list of options",
        type: "enum",
        format: "select",
        icon: ChevronDown,
        fieldToAdd: {
          type: "enum",
          format: "select",
          label: "My enum field",
          placeholder: "Select an option from the enum...",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Orange", value: "orange" },
          ],
        },
      },
      {
        title: "Combobox",
        description: "Searchable dropdown with options",
        type: "enum",
        format: "combobox",
        icon: Search,
        fieldToAdd: {
          type: "enum",
          format: "combobox",
          label: "My enum field",
          placeholder: "Select an option from the enum...",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Orange", value: "orange" },
          ],
        },
      },
      {
        title: "Radio Group",
        description: "Select one option from a list of radio buttons",
        type: "enum",
        format: "radio",
        icon: CircleDot,
        fieldToAdd: {
          type: "enum",
          format: "radio",
          label: "My enum field",
          placeholder: "Select an option from the enum...",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Orange", value: "orange" },
          ],
        },
      },
    ],
  },
  {
    type: "boolean",
    sectionName: "Boolean fields",
    accentBackground: "bg-red-600",
    icon: ToggleRight,
    fields: [
      {
        title: "Checkbox",
        description: "Toggle between true and false with a checkbox",
        type: "boolean",
        format: "checkbox",
        icon: SquareCheck,
        fieldToAdd: {
          type: "boolean",
          format: "checkbox",
          label: "My boolean field",
          asCard: true,
          description: "You can include an optional description here...",
        },
      },
      {
        title: "Switch",
        description: "Toggle between true and false with a switch",
        type: "boolean",
        format: "switch",
        icon: ToggleRight,
        fieldToAdd: {
          type: "boolean",
          format: "switch",
          label: "My boolean field",
          asCard: true,
          description: "You can include an optional description here...",
        },
      },
    ],
  },
  {
    type: "number",
    sectionName: "Number fields",
    accentBackground: "bg-yellow-600",
    icon: Hash,
    fields: [
      {
        title: "Number Input",
        description: "Single-line number input field",
        type: "number",
        format: "input",
        icon: Calculator,
        fieldToAdd: {
          type: "number",
          format: "input",
          label: "My number field",
          placeholder: "Insert placeholder here...",
          required: true,
        },
      },
      {
        title: "Slider",
        description: "Slider input field",
        type: "number",
        format: "slider",
        icon: SlidersHorizontal,
        fieldToAdd: {
          type: "number",
          format: "slider",
          label: "My number field",
          placeholder: "Insert placeholder here...",
          required: true,
        },
      },
    ],
  },
  {
    type: "date",
    sectionName: "Date fields",
    accentBackground: "bg-purple-600",
    icon: Calendar,
    fields: [
      {
        title: "Individual Date Picker",
        description: "Select a single date from a calendar",
        type: "date",
        format: "date",
        icon: Calendar,
        fieldToAdd: {
          type: "date",
          format: "date",
          label: "My date field",
          required: true,
          pastEnabled: true,
          futureEnabled: true,
        },
      },
      {
        title: "Date Range Picker",
        description: "Select a range of dates from a calendar",
        type: "date",
        format: "range",
        icon: CalendarDays,
        fieldToAdd: {
          type: "date",
          format: "range",
          label: "My date field",
          required: true,
          pastEnabled: true,
          futureEnabled: true,
        },
      },
      {
        title: "Time Picker",
        description: "Select a time from a clock",
        type: "date",
        format: "time",
        icon: Clock,
        fieldToAdd: {
          type: "date",
          format: "time",
          label: "My date field",
          required: true,
          pastEnabled: true,
          futureEnabled: true,
        },
      },
      {
        title: "Date and Time Picker",
        description: "Select a date and time from a calendar and clock",
        type: "date",
        format: "datetime",
        icon: CalendarClock,
        fieldToAdd: {
          type: "date",
          format: "datetime",
          label: "My date field",
          required: true,
          pastEnabled: true,
          futureEnabled: true,
        },
      },
    ],
  },
];
