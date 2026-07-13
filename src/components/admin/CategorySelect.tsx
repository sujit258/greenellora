"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Check, X } from "lucide-react";

interface CategorySelectProps {
  /** The current selected value */
  value: string;
  /** Called when the value changes (either from dropdown or new category) */
  onChange: (value: string) => void;
  /** Pre-defined list of category options */
  options: string[];
  /** Whether the field is required */
  required?: boolean;
  /** HTML name attribute */
  name?: string;
}

export default function CategorySelect({
  value,
  onChange,
  options,
  required = false,
  name = "category",
}: CategorySelectProps) {
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const allOptions = [...options, ...customCategories];

  // Auto-focus the input when it appears
  useEffect(() => {
    if (showAdd) inputRef.current?.focus();
  }, [showAdd]);

  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    // Avoid duplicates (case-insensitive)
    const exists = allOptions.some(
      (o) => o.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      setCustomCategories((prev) => [...prev, trimmed]);
    }
    onChange(trimmed);
    setNewCat("");
    setShowAdd(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === "Escape") {
      setShowAdd(false);
      setNewCat("");
    }
  };

  const handleCancel = () => {
    setShowAdd(false);
    setNewCat("");
  };

  return (
    <div className="category-select-wrapper">
      {/* ── Dropdown ── */}
      <div className="category-select-row">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-form-select"
          required={required}
          style={{ flex: 1 }}
        >
          <option value="">Select category</option>
          {allOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* ── Add button ── */}
        {!showAdd && (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="category-add-btn"
            title="Add new category"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        )}
      </div>

      {/* ── Inline new category input ── */}
      {showAdd && (
        <div className="category-new-row">
          <input
            ref={inputRef}
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={handleKeyDown}
            className="admin-form-input category-new-input"
            placeholder="Type new category name…"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newCat.trim()}
            className="category-confirm-btn"
            title="Confirm"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="category-cancel-btn"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
