import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [confirmationText, setConfirmationText] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setConfirmationText('');
    }
  }, [isOpen]);

  const isConfirmed = confirmationText.trim().toLowerCase() === 'delete';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200 border border-outline-variant">
        <div className="bg-error px-5 py-3.5 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-white" /> Confirm Deletion
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-5">
          <p className="text-on-surface font-semibold text-base mb-1.5">
            Are you sure you want to delete?
          </p>
          <p className="text-xs text-on-surface-muted mb-5">
            You are about to delete {itemName ? <span className="font-semibold text-on-surface">"{itemName}"</span> : 'this item'}. <br/>
            This action cannot be reversed.
          </p>
          
          <label className="block text-xs font-medium text-on-surface-muted uppercase mb-1.5">
            Type "delete" to confirm
          </label>
          <input 
            type="text" 
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="w-full border border-outline-variant rounded-md p-2.5 focus:ring-1 focus:ring-error focus:border-error text-center font-semibold tracking-widest text-error placeholder:text-outline placeholder:font-normal placeholder:tracking-normal text-xs transition-colors"
            placeholder="delete"
            autoFocus
          />
        </div>

        <div className="p-4 bg-surface border-t border-outline-variant flex justify-end gap-2.5">
          <button 
            onClick={onClose}
            className="px-3.5 py-2 border border-outline-variant bg-white text-on-surface rounded-md font-medium text-xs hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={!isConfirmed}
            className={`px-3.5 py-2 text-white rounded-md font-medium text-xs shadow-sm flex items-center transition-all ${
              isConfirmed 
                ? 'bg-error hover:bg-[#B91C1C]' 
                : 'bg-gray-300 cursor-not-allowed opacity-70'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;