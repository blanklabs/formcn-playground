import { useEffect, useState } from "react";
import { usePlaygroundStore } from "@/stores/playground";

export function useAutoSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedForm, setLastSavedForm] = useState<string>("");

  const { form } = usePlaygroundStore();

  // Check if form has changed
  useEffect(() => {
    const currentFormString = JSON.stringify(form);
    if (currentFormString !== lastSavedForm) {
      setHasUnsavedChanges(true);
    }
  }, [form, lastSavedForm]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      setIsSaving(true);

      // Save to localStorage
      try {
        const formString = JSON.stringify(form);
        localStorage.setItem(`current-form`, formString);
        setLastSavedForm(formString);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to save form:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [form, hasUnsavedChanges]);

  // Load form on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`current-form`);
      if (saved) {
        setLastSavedForm(saved);
      }
    } catch (error) {
      console.error("Failed to load saved form:", error);
    }
  }, []);

  return {
    isSaving,
    hasUnsavedChanges,
  };
}
