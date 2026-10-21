import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CustomField } from '../../types/biodata';
import { calculateAge } from '../../utils/calculateAge';
import {
  GripVertical,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react';

interface SortableFieldItemProps {
  sectionId: string;
  field: CustomField;
  onUpdateValue: (val: string) => void;
  onToggleVisibility: () => void;
  onEditField: () => void;
  onDeleteField: () => void;
}

export const SortableFieldItem: React.FC<SortableFieldItemProps> = ({
  field,
  onUpdateValue,
  onToggleVisibility,
  onEditField,
  onDeleteField,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDob = field.id.includes('dob') || field.label.toLowerCase().includes('date of birth');
  const calculatedAge = isDob ? calculateAge(field.value) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border rounded-xl p-3.5 transition-all duration-150 ${
        isDragging
          ? 'opacity-50 border-rose-400 shadow-lg z-20'
          : field.visible
          ? 'border-slate-200/90 hover:border-slate-300 shadow-sm'
          : 'border-slate-200 bg-slate-50/70 opacity-60'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-0.5 rounded touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-semibold text-slate-800 truncate">
            {field.label}
            {field.required && <span className="text-rose-500 ml-1">*</span>}
          </span>

          {calculatedAge !== null && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
              <Calendar className="w-3 h-3" />
              {calculatedAge} yrs
            </span>
          )}
        </div>

        {/* Controls: Visible, Edit, Delete */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleVisibility}
            className={`p-1.5 rounded-lg transition-colors ${
              field.visible
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
            }`}
            title={field.visible ? 'Hide from document' : 'Show in document'}
          >
            {field.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onEditField}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit field settings"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDeleteField}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete field"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Field Input Control */}
      <div className="mt-1">
        {field.type === 'textarea' ? (
          <textarea
            rows={2}
            value={field.value}
            onChange={(e) => onUpdateValue(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label}...`}
            className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
          />
        ) : field.type === 'select' && field.options && field.options.length > 0 ? (
          <select
            value={field.value}
            onChange={(e) => onUpdateValue(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-2 bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
          >
            <option value="">Select an option...</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : field.type === 'boolean' ? (
          <div className="flex gap-2">
            {['Yes', 'No'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onUpdateValue(opt)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  field.value === opt
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <input
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            value={field.value}
            onChange={(e) => onUpdateValue(e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label}...`}
            className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-2 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors"
          />
        )}
      </div>
    </div>
  );
};
