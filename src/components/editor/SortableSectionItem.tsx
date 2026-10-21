import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BiodataSection, CustomField } from '../../types/biodata';
import { SortableFieldItem } from './SortableFieldItem';
import { Button } from '../common/Button';
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  Layers,
} from 'lucide-react';

interface SortableSectionItemProps {
  section: BiodataSection;
  onUpdateField: (fieldId: string, val: string) => void;
  onToggleFieldVisibility: (fieldId: string) => void;
  onEditField: (field: CustomField) => void;
  onDeleteField: (fieldId: string) => void;
  onAddField: () => void;
  onToggleSectionVisibility: () => void;
  onRenameSection: () => void;
  onDeleteSection: () => void;
}

export const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  section,
  onUpdateField,
  onToggleFieldVisibility,
  onEditField,
  onDeleteField,
  onAddField,
  onToggleSectionVisibility,
  onRenameSection,
  onDeleteSection,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fieldIds = section.fields.map((f) => f.id);
  const visibleFieldsCount = section.fields.filter((f) => f.visible).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-2xl shadow-sm transition-all overflow-hidden ${
        isDragging
          ? 'opacity-60 border-rose-500 shadow-xl z-30'
          : section.visible
          ? 'border-slate-200/90'
          : 'border-slate-200 bg-slate-50/80 opacity-75'
      }`}
    >
      {/* Section Header Accordion Bar */}
      <div className="p-4 flex items-center justify-between gap-3 bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1 rounded touch-none"
            title="Drag section to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-6 h-6 rounded-md bg-rose-100/70 text-rose-700 flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                  {section.title}
                </h3>
                {section.isCustom && (
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Custom
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {visibleFieldsCount} of {section.fields.length} fields visible
              </p>
            </div>
          </button>
        </div>

        {/* Section Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleSectionVisibility}
            className={`p-1.5 rounded-lg transition-colors ${
              section.visible
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
                : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
            }`}
            title={section.visible ? 'Hide section from document' : 'Show section in document'}
          >
            {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onRenameSection}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Rename section"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {section.isCustom && (
            <button
              type="button"
              onClick={onDeleteSection}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Accordion Content: Fields list */}
      {isOpen && (
        <div className="p-4 space-y-3">
          <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">
              {section.fields.map((field) => (
                <SortableFieldItem
                  key={field.id}
                  sectionId={section.id}
                  field={field}
                  onUpdateValue={(val) => onUpdateField(field.id, val)}
                  onToggleVisibility={() => onToggleFieldVisibility(field.id)}
                  onEditField={() => onEditField(field)}
                  onDeleteField={() => onDeleteField(field.id)}
                />
              ))}
            </div>
          </SortableContext>

          {/* Add Field Button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={onAddField}
              className="w-full border-dashed border-slate-300 text-slate-600 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50/30"
            >
              Add Field to {section.title}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
