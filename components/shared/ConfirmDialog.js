"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-cyber-surface border border-cyber-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg ${
                isDestructive
                  ? "bg-red-500/10 text-cyber-red border border-red-500/20"
                  : "bg-emerald-500/10 text-cyber-emerald border border-emerald-500/20"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-cyber-text">{title}</h3>
              <p className="text-xs text-cyber-muted mt-0.5">CYBERLAB Confirmation</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-cyber-muted hover:text-cyber-text p-1 rounded-md hover:bg-cyber-border transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-cyber-muted leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-cyber-muted hover:text-cyber-text hover:bg-cyber-card rounded-lg transition-colors border border-cyber-border"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              isDestructive
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20"
                : "bg-cyber-emerald hover:bg-cyber-emeraldHover text-black shadow-lg shadow-emerald-950/20"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
