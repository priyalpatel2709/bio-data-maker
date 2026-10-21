import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBiodata } from '../../context/BiodataContext';
import { CustomField, BiodataSection } from '../../types/biodata';
import { SortableSectionItem } from './SortableSectionItem';
import { CustomFieldModal } from './CustomFieldModal';
import { CustomSectionModal } from './CustomSectionModal';
import { Button } from '../common/Button';
import {
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const FormEditor: React.FC = () => {
  const {
    document,
    updateDocumentTitle,
    updateSection,
    deleteSection,
    reorderSections,
    addSection,
    updateField,
    deleteField,
    reorderFields,
    addField,
    resetToDefault,
  } = useBiodata();

  // Modals state
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<BiodataSection | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sectionIds = document.sections.map((s) => s.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Check if dragging a section
    const activeSectionIndex = document.sections.findIndex((s) => s.id === active.id);
    const overSectionIndex = document.sections.findIndex((s) => s.id === over.id);

    if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
      const newSections = arrayMove(document.sections, activeSectionIndex, overSectionIndex);
      reorderSections(newSections);
      return;
    }

    // Check if dragging a field inside a section
    for (const section of document.sections) {
      const activeFieldIndex = section.fields.findIndex((f) => f.id === active.id);
      const overFieldIndex = section.fields.findIndex((f) => f.id === over.id);

      if (activeFieldIndex !== -1 && overFieldIndex !== -1) {
        const newFields = arrayMove(section.fields, activeFieldIndex, overFieldIndex);
        reorderFields(section.id, newFields);
        return;
      }
    }
  };

  const handleOpenAddField = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setEditingField(null);
    setFieldModalOpen(true);
  };

  const handleOpenEditField = (sectionId: string, field: CustomField) => {
    setSelectedSectionId(sectionId);
    setEditingField(field);
    setFieldModalOpen(true);
  };

  const handleSaveField = (fieldData: Omit<CustomField, 'id'>) => {
    if (!selectedSectionId) return;
    if (editingField) {
      updateField(selectedSectionId, editingField.id, fieldData);
    } else {
      addField(selectedSectionId, fieldData);
    }
  };

  const handleOpenRenameSection = (section: BiodataSection) => {
    setEditingSection(section);
    setSectionModalOpen(true);
  };

  const handleSaveSection = (title: string, description?: string) => {
    if (editingSection) {
      updateSection(editingSection.id, { title, description });
    } else {
      addSection(title, description);
    }
  };

  const currentSectionForModal = document.sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="space-y-6 pb-24">
      {/* Top Document Title & Reset bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Biodata Document Title
          </label>
          <input
            type="text"
            value={document.title}
            onChange={(e) => updateDocumentTitle(e.target.value)}
            placeholder="e.g. Ananya Sharma — Matrimonial Biodata"
            className="w-full text-base font-bold text-slate-900 border-0 p-0 focus:ring-0 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
            onClick={() => {
              if (window.confirm('Reset all fields to sample profile data?')) {
                resetToDefault();
              }
            }}
            title="Reset to default sample"
          >
            Reset
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5 text-rose-600" />}
            onClick={() => {
              setEditingSection(null);
              setSectionModalOpen(true);
            }}
          >
            Add Section
          </Button>
        </div>
      </div>

      {/* Sections List with Drag and Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {document.sections.map((section) => (
              <SortableSectionItem
                key={section.id}
                section={section}
                onUpdateField={(fId, val) => updateField(section.id, fId, { value: val })}
                onToggleFieldVisibility={(fId) => {
                  const target = section.fields.find((f) => f.id === fId);
                  if (target) {
                    updateField(section.id, fId, { visible: !target.visible });
                  }
                }}
                onEditField={(field) => handleOpenEditField(section.id, field)}
                onDeleteField={(fId) => deleteField(section.id, fId)}
                onAddField={() => handleOpenAddField(section.id)}
                onToggleSectionVisibility={() =>
                  updateSection(section.id, { visible: !section.visible })
                }
                onRenameSection={() => handleOpenRenameSection(section)}
                onDeleteSection={() => {
                  if (window.confirm(`Delete the "${section.title}" section?`)) {
                    deleteSection(section.id);
                  }
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Section Prompt Card */}
      <div className="text-center p-6 border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-2xl bg-white/50 transition-colors">
        <Sparkles className="w-6 h-6 text-rose-500 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-800">Need more custom sections?</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Add astrological details, property & assets, partner preferences, or ancestral roots.
        </p>
        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          className="mt-4"
          onClick={() => {
            setEditingSection(null);
            setSectionModalOpen(true);
          }}
        >
          Create New Section
        </Button>
      </div>

      {/* Field Modal */}
      <CustomFieldModal
        isOpen={fieldModalOpen}
        onClose={() => setFieldModalOpen(false)}
        onSave={handleSaveField}
        initialField={editingField}
        sectionTitle={currentSectionForModal ? currentSectionForModal.title : 'Section'}
      />

      {/* Section Modal */}
      <CustomSectionModal
        isOpen={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        onSave={handleSaveSection}
        initialTitle={editingSection ? editingSection.title : ''}
        initialDescription={editingSection ? editingSection.description : ''}
      />
    </div>
  );
};
