"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
  isDeleting: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  isDeleting,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-icon danger">
          <AlertTriangle size={24} />
        </div>
        <h2 className="admin-modal-title">Delete {itemType}?</h2>
        <p className="admin-modal-message">
          Are you sure you want to delete &ldquo;{itemName}&rdquo;? This action cannot be undone.
        </p>
        <div className="admin-modal-actions">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
            id="modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            className="admin-btn admin-btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            id="modal-delete-btn"
          >
            {isDeleting ? (
              <>
                <span className="admin-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
