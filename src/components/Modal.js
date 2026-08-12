import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primaryDark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-surface p-6 text-left align-middle shadow-2xl transition-all sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-xl font-bold text-textPrimary leading-tight pr-4">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border/50 text-textSecondary hover:bg-border hover:text-textPrimary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-2 font-body text-sm leading-relaxed text-textSecondary">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
