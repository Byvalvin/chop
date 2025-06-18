'use client';

import { useState } from 'react';
import { FaPlusCircle, FaGripVertical } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, index, instruction, update, remove, showPreview }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging ? '0 2px 10px rgba(0,0,0,0.2)' : undefined,
    background: isDragging ? '#f9f9f9' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-start gap-2 p-2 border rounded-md bg-[var(--glass-bg)] backdrop-blur"
    >
      <span
        {...listeners}
        className="mt-2 text-gray-400 cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <FaGripVertical />
      </span>
      <div className="flex-1">
        {showPreview ? (
          <div className="p-2 border rounded bg-white text-black">
            <ReactMarkdown>{instruction}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={instruction}
            onChange={(e) => update(index, e.target.value)}
            placeholder={`Step ${index + 1}`}
            className="w-full bg-transparent border-b border-[var(--other-text)] outline-none text-base"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => remove(index)}
        className="text-red-500 hover:text-red-700 text-xl mt-2"
        title="Delete step"
      >
        <MdDelete />
      </button>
    </div>
  );
}

export default function InstructionEditor({ instructions, setInstructions }) {
  const [showPreview, setShowPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = instructions.findIndex((_, i) => `inst-${i}` === active.id);
    const newIndex = instructions.findIndex((_, i) => `inst-${i}` === over.id);

    setInstructions(arrayMove(instructions, oldIndex, newIndex));
  };

  const updateInstruction = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Instructions</h2>
        <button
          type="button"
          onClick={() => setShowPreview((prev) => !prev)}
          className="text-sm text-[var(--secondary-dark)] hover:text-[var(--primary)]"
        >
          {showPreview ? 'Edit Mode' : 'Preview Mode'}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={instructions.map((_, i) => `inst-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <SortableItem
                key={`inst-${index}`}
                id={`inst-${index}`}
                index={index}
                instruction={instruction}
                update={updateInstruction}
                remove={removeInstruction}
                showPreview={showPreview}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addInstruction}
        className="mt-4 text-[var(--secondary-dark)] hover:text-[var(--primary)] flex items-center gap-2"
      >
        <FaPlusCircle />
        Add Step
      </button>
    </div>
  );
}
