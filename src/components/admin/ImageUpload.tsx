"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (path: string) => void;
  label?: string;
}

export default function ImageUpload({ currentImage, onImageChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragover, setDragover] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be smaller than 10MB.");
        return;
      }

      setError("");
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (data.success && data.data?.path) {
          onImageChange(data.data.path);
        } else {
          setError(data.error || "Upload failed.");
        }
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onImageChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragover(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (uploading) {
    return (
      <div className="admin-form-group">
        {label && <label className="admin-form-label">{label}</label>}
        <div className="admin-upload-loading">
          <div className="admin-spinner" />
        </div>
      </div>
    );
  }

  if (currentImage) {
    return (
      <div className="admin-form-group">
        {label && <label className="admin-form-label">{label}</label>}
        <div className="admin-upload-preview">
          <img src={currentImage} alt="Preview" />
          <div className="admin-upload-preview-actions">
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-danger"
              onClick={() => onImageChange("")}
              id="image-remove-btn"
            >
              <X size={14} /> Remove
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-sm admin-btn-secondary"
              onClick={() => inputRef.current?.click()}
              id="image-change-btn"
            >
              Change
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
            id="image-upload-hidden-input"
          />
        </div>
        {error && <p className="admin-form-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="admin-form-group">
      {label && <label className="admin-form-label">{label}</label>}
      <div
        className={`admin-upload-zone ${dragover ? "dragover" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragover(true);
        }}
        onDragLeave={() => setDragover(false)}
        onDrop={onDrop}
      >
        <Upload />
        <p>
          Drag & drop an image here, or <span>browse</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
          id="image-upload-input"
        />
      </div>
      {error && <p className="admin-form-error">{error}</p>}
    </div>
  );
}
