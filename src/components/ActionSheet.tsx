import React from 'react';
import { Camera, Image as ImageIcon, Folder, X } from 'lucide-react';

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChooseLibrary: () => void;
  onChooseFiles: () => void;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  onTakePhoto,
  onChooseLibrary,
  onChooseFiles
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end p-3 sm:items-center sm:justify-center transition-all duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-auto flex flex-col gap-2 font-sans select-none animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Action Group */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[14px] overflow-hidden shadow-2xl border border-white/40 divide-y divide-slate-200/70">
          {/* Action 1: Take Photo */}
          <button
            type="button"
            onClick={onTakePhoto}
            className="w-full py-4 px-5 flex items-center justify-between text-[#007AFF] hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <span className="text-[19px] font-normal tracking-tight">Take Photo</span>
            <Camera className="w-5 h-5 text-[#007AFF]" />
          </button>

          {/* Action 2: Choose from Library */}
          <button
            type="button"
            onClick={onChooseLibrary}
            className="w-full py-4 px-5 flex items-center justify-between text-[#007AFF] hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <span className="text-[19px] font-normal tracking-tight">Choose from Library</span>
            <ImageIcon className="w-5 h-5 text-[#007AFF]" />
          </button>

          {/* Action 3: Choose Files */}
          <button
            type="button"
            onClick={onChooseFiles}
            className="w-full py-4 px-5 flex items-center justify-between text-[#007AFF] hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <span className="text-[19px] font-normal tracking-tight">Choose Files</span>
            <Folder className="w-5 h-5 text-[#007AFF]" />
          </button>
        </div>

        {/* Detached Cancel Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 bg-white rounded-[14px] text-[#007AFF] text-[19px] font-semibold tracking-tight shadow-lg hover:bg-slate-50 active:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

