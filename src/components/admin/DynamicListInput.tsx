"use client";

import { Plus, X } from "lucide-react";

interface DynamicListInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
}

export default function DynamicListInput({
  items,
  onChange,
  label,
  placeholder = "Enter a value",
}: DynamicListInputProps) {
  const handleAdd = () => {
    onChange([...items, ""]);
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-form-group">
      <label className="admin-form-label">{label}</label>
      <div className="admin-list-input">
        {items.length === 0 && (
          <div className="admin-list-input-empty">
            No items yet. Click &ldquo;+ Add Item&rdquo; to add one.
          </div>
        )}
        {items.map((item, index) => (
          <div key={index} className="admin-list-input-item">
            <input
              className="admin-form-input"
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder}
              id={`${label.toLowerCase().replace(/\s+/g, "-")}-item-${index}`}
            />
            <button
              type="button"
              className="admin-btn admin-btn-icon admin-btn-ghost"
              onClick={() => handleRemove(index)}
              aria-label={`Remove item ${index + 1}`}
              id={`${label.toLowerCase().replace(/\s+/g, "-")}-remove-${index}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn admin-btn-sm admin-btn-secondary"
          onClick={handleAdd}
          style={{ alignSelf: "flex-start" }}
          id={`${label.toLowerCase().replace(/\s+/g, "-")}-add-btn`}
        >
          <Plus size={14} /> Add Item
        </button>
      </div>
    </div>
  );
}
