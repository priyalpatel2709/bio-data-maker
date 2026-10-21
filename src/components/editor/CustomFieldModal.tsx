import React, { useState, useEffect } from 'react';
import { CustomField, FieldType } from '../../types/biodata';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Switch } from '../common/Switch';

interface CustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: Omit<CustomField, 'id'>) => void;
  initialField?: CustomField | null;
  sectionTitle: string;
}

export const CustomFieldModal: React.FC<CustomFieldModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialField,
  sectionTitle,
}) => {
  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [optionsStr, setOptionsStr] = useState('');
  const [visible, setVisible] = useState(true);
  const [required, setRequired] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialField) {
      setLabel(initialField.label);
      setType(initialField.type);
      setValue(initialField.value);
      setPlaceholder(initialField.placeholder || '');
      setOptionsStr(initialField.options ? initialField.options.join(', ') : '');
      setVisible(initialField.visible !== false);
      setRequired(initialField.required || false);
    } else {
      setLabel('');
      setType('text');
      setValue('');
      setPlaceholder('');
      setOptionsStr('');
      setVisible(true);
      setRequired(false);
    }
    setError('');
  }, [initialField, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError('Field label is required');
      return;
    }

    const options = type === 'select'
      ? optionsStr.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    onSave({
      label: label.trim(),
      type,
      value,
      placeholder: placeholder.trim(),
      options,
      visible,
      required,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialField ? 'Edit Field' : 'Add Custom Field'}
      description={`Add a custom property to "${sectionTitle}"`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Field Label"
          placeholder="e.g. Gotra, Raashi, Passport No., Visa Status"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          error={error}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Field Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="text">Short Text (One-line input)</option>
            <option value="textarea">Long Text (Paragraph / Multi-line)</option>
            <option value="number">Number</option>
            <option value="date">Date (with auto-formatting)</option>
            <option value="select">Dropdown Choice (Select)</option>
            <option value="boolean">Yes / No Switch</option>
          </select>
        </div>

        {type === 'select' && (
          <Input
            label="Dropdown Options"
            placeholder="Option 1, Option 2, Option 3 (comma separated)"
            value={optionsStr}
            onChange={(e) => setOptionsStr(e.target.value)}
            helperText="Separate multiple choices with commas"
          />
        )}

        <Input
          label="Default / Current Value"
          placeholder="Enter value..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <Input
          label="Placeholder or Helper Hint"
          placeholder="e.g. Include city and state"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
        />

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Switch
            label="Visible in Document"
            description="Toggle whether this field shows up in the final biodata"
            checked={visible}
            onChange={setVisible}
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialField ? 'Update Field' : 'Add Field'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
