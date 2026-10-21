import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface CustomSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description?: string) => void;
  initialTitle?: string;
  initialDescription?: string;
}

export const CustomSectionModal: React.FC<CustomSectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTitle = '',
  initialDescription = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setError('');
  }, [initialTitle, initialDescription, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Section title is required');
      return;
    }
    onSave(title.trim(), description.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTitle ? 'Rename Section' : 'Create Custom Section'}
      description="Organize your biodata with a custom group of fields"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Section Title"
          placeholder="e.g. Kundali & Astrological Details, Siblings Info, References"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          required
        />

        <Input
          label="Subheading / Description (Optional)"
          placeholder="e.g. Birth stars, planetary positions, and charts"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="pt-4 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialTitle ? 'Save Changes' : 'Create Section'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
