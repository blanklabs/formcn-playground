export function useHtmlDynamicId(id: number) {
  const getFormFieldId = (propertyName: string) => {
    return `form-field-${id}--${propertyName}`;
  };

  return {
    getFormFieldId,
  };
}
