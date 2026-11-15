import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[85vh]',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={`relative z-10 w-full max-w-lg bg-[#111622] border border-white/15 text-slate-100 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-glass-hud overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${maxHeight}`}
      >
        {/* Laser Top Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF5500] to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/[0.08]">
          <h3 className="font-display text-lg font-black text-white uppercase tracking-wider">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto overscroll-contain flex-1 text-slate-200">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
export default Modal;
