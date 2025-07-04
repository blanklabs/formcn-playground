import { generateFieldKey } from "@/core";
import { Field, FieldWithIdAndKey, Form, FormMetadata } from "@/core/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const emptyForm: Form = {
  name: "My New Form",
  metadata: {
    title: "My New Form",
    description: "I built this form with formcn, shadcn/ui, React Hook Form and Zod.",
    submitButtonLabel: "Submit",
    submitButtonColor: "zinc",
    submitButtonShade: 900,
    buttonWidthFull: false,
    showBackground: true,
    backgroundColor: "amber",
    backgroundShade: 500,
  },
  fields: [],
};

interface PlaygroundState {
  // UI
  currentTab: "form" | "code";
  compactToolbar: boolean;
  backgroundDialogOpen: boolean;
  editHeadingDialogOpen: boolean;
  editSubmitButtonDialogOpen: boolean;
  payloadPreview: string | null;

  // Form loading state
  isLoading: boolean;
  error: string | null;
  isPublished: boolean;

  // UI setters
  setCurrentTab: (currentTab: "form" | "code") => void;
  setCompactToolbar: (compactToolbar: boolean) => void;
  setBackgroundDialogOpen: (backgroundDialogOpen: boolean) => void;
  setEditHeadingDialogOpen: (editHeadingDialogOpen: boolean) => void;
  setEditSubmitButtonDialogOpen: (editSubmitButtonDialogOpen: boolean) => void;
  setPayloadPreview: (payloadPreview: string | null) => void;

  // Form state
  form: Form;
  nextFieldId: number;

  // Form state setters
  setForm: (form: Form) => void;
  setNextFieldId: (nextFieldId: number) => void;
  resetForm: () => void;
  loadForm: (slug: string) => void;

  // Form utilities (fields)
  addField: (field: Field) => void;
  removeField: (id: number) => void;
  setField: (id: number, field: FieldWithIdAndKey) => void;
  setFields: (fields: FieldWithIdAndKey[]) => void;

  // Form utilities (metadata)
  setMetadata: (metadata: FormMetadata) => void;
  setBackground: ({ color, shade }: { color: string; shade: number }) => void;
  setShowBackground: (showBackground: boolean) => void;
}

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set) => ({
      // UI
      currentTab: "form",
      compactToolbar: false,
      backgroundDialogOpen: false,
      editHeadingDialogOpen: false,
      editSubmitButtonDialogOpen: false,
      payloadPreview: null,

      // Form loading state
      isLoading: false,
      error: null,
      isPublished: false,

      // UI setters
      setCurrentTab: (currentTab: "form" | "code") => set({ currentTab }),
      setCompactToolbar: (compactToolbar: boolean) => set({ compactToolbar }),
      setBackgroundDialogOpen: (backgroundDialogOpen: boolean) => set({ backgroundDialogOpen }),
      setEditHeadingDialogOpen: (editHeadingDialogOpen: boolean) => set({ editHeadingDialogOpen }),
      setEditSubmitButtonDialogOpen: (editSubmitButtonDialogOpen: boolean) => set({ editSubmitButtonDialogOpen }),
      setPayloadPreview: (payloadPreview: string | null) => set({ payloadPreview }),

      // Form state
      form: emptyForm,
      nextFieldId: 0,

      // Form state setters
      setForm: (form: Form) => set({ form }),
      setNextFieldId: (nextFieldId: number) => set({ nextFieldId }),
      resetForm: () => {
        set({
          form: emptyForm,
          nextFieldId: 0,
        });
      },
      loadForm: (slug: string) => {
        // TODO: Implement form loading logic
        // For now, this is a placeholder
        console.log("Loading form with slug:", slug);
      },

      // Form utilities (fields)
      addField: (field: Field) => {
        set((state) => ({
          nextFieldId: state.nextFieldId + 1,
          form: {
            ...state.form,
            fields: [
              ...state.form.fields,
              {
                ...field,
                key: generateFieldKey(state.nextFieldId),
                id: state.nextFieldId,
              },
            ],
          },
        }));
      },
      removeField: (id: number) => {
        set((state) => ({
          form: {
            ...state.form,
            fields: state.form.fields.filter((field) => field.id !== id),
          },
        }));
      },
      setField: (id: number, field: FieldWithIdAndKey) => {
        set((state) => ({
          form: {
            ...state.form,
            fields: state.form.fields.map((f) => (f.id === id ? field : f)),
          },
        }));
      },
      setFields: (fields: FieldWithIdAndKey[]) => {
        set((state) => ({
          form: { ...state.form, fields },
        }));
      },

      // Form utilities (metadata)
      setMetadata: (metadata: FormMetadata) => {
        set((state) => ({
          form: { ...state.form, metadata },
        }));
      },
      setBackground: ({ color, shade }: { color: string; shade: number }) => {
        set((state) => ({
          form: {
            ...state.form,
            metadata: {
              ...state.form.metadata,
              backgroundColor: color,
              backgroundShade: shade,
            },
          },
        }));
      },
      setShowBackground: (showBackground: boolean) => {
        set((state) => ({
          form: {
            ...state.form,
            metadata: { ...state.form.metadata, showBackground },
          },
        }));
      },
    }),
    {
      name: "playground",
    },
  ),
);
