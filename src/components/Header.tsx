import React from 'react';
import { ScanText, User } from 'lucide-react';

interface HeaderProps {
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#faf8ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe border-b border-[#c3c6d7]/30">
      <div className="h-16 px-4 max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#004ac6] flex items-center justify-center shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <ScanText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg tracking-tight text-[#131b2e] leading-none font-bold">
                VeriLabel
              </span>
            </div>
            <span className="text-[11px] text-[#434655] leading-none mt-0.5 font-sans tracking-wide">
              Every Label, Verified.
            </span>
          </div>
        </div>

        {/* Right Badge & Profile */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-[#e2e7ff] text-[#004ac6] text-[11px] font-semibold">
            <span>Prototype</span>
          </div>

          <button
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center hover:bg-[#003ea8] transition-colors shadow-xs cursor-pointer"
            title="Team & Profile"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
