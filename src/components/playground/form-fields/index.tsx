"use client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

import { usePlaygroundStore } from "@/stores/playground";

import { DraggableWrapper } from "@/components/playground/form-fields/field-cards/draggable-wrapper";
import { NewFieldDialog } from "@/components/playground/form-fields/new-field-dialog";
import { FieldCard } from "@/components/playground/form-fields/field-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FormFields() {
  const { form, setFields } = usePlaygroundStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = form.fields.findIndex((field) => field.id === active.id);
      const newIndex = form.fields.findIndex((field) => field.id === over.id);
      setFields(arrayMove(form.fields, oldIndex, newIndex));
    }
  };

  if (form.fields.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight">Getting started</CardTitle>
          <CardDescription className="max-w-md">
            formcn helps you build forms with shadcn/ui, React Hook Form and Zod. Add a new field to get started!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <NewFieldDialog />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={form.fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
          <ol className="mb-3 grid gap-3">
            {form.fields.map((field) => (
              <DraggableWrapper key={field.id} id={field.id}>
                <FieldCard field={field} />
              </DraggableWrapper>
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  );
}
