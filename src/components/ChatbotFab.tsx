import React, { useState } from 'react';
import { X, Sparkles, Rocket } from 'lucide-react';

export const ChatbotFab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed floating action button in the bottom-right corner, above the bottom nav bar */}
      <div className="fixed right-4 bottom-20 z-40 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open VeriLabel AI Assistant"
          className="relative w-14 h-14 rounded-full bg-white shadow-xl border-2 border-[#0F2A59]/20 flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-200 hover:shadow-2xl hover:scale-105 p-1"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyiLNa3baCE_ET0CTa7SA8WqNo_s3LBlTR9iQGsyyiNrNz--Za3PGxneWGCTQRQ74dvgKdVgclHoyuJmYPrnBn6FSmeBS4btLh_yzjAaaLo7WMkMaFhapllTTGMgHkGQjW-YU7MPzeqxFZlBI1YJq8IbQgTIk8EqhDVZTK7O6LTa7NTcpio2SnM2EgzFkzs3kd0-sAgCU3LnajgLrHQm4o4DBOvl8ASQfzS3B_iaAUNiVfPtgsO6RUuQ2xIFV_-Xk0wsw"
            alt="VeriLabel AI Assistant"
            className="w-full h-full object-cover rounded-full pointer-events-none"
          />
          {/* Active online indicator dot */}
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
          </span>
        </button>
      </div>

      {/* VeriLabel Chat Drawer / Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 p-4 pb-safe flex flex-col items-center justify-end bg-slate-900/40 backdrop-blur-xs transition-all duration-300 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 flex flex-col z-10 transition-all max-h-[85vh] overflow-y-auto font-sans animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Avatar & Heading */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl shadow-md border border-slate-200 p-1 bg-amber-50/70 mb-3 flex items-center justify-center overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMF3f9ZTtrz1EvomSh7nAkX0wCC-5CcAODWQlnsN7tWPyeW4_uBd9QTMCnNXTXX8zSvfQVttD-yEWRRr4Wud7fVA3fbaD_NQOAlwkslFaRoaTMNedrMZLyHHKoBqGBxi1zk-S2yOxkVk_DdXf6X3trHoAvlRe6auO3Rh0LlLEg0rb4lvNY9_wb5z3wUwnNg2VLXD8W8pfjDoj55L-dPordPXPZGjIVxCIN_USSmsOvmTt0pecQXAU0d3yw_l_KNHKOrAI"
                  alt="VeriLabel AI Avatar"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h2 className="font-display text-lg text-slate-900 font-bold tracking-tight">
                VeriLabel AI Assistant
              </h2>
            </div>

            {/* Coming Soon Card */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center space-y-2">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-[#FF9933]" />
                <span>Coming Soon...</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our AI assistant is currently being trained on PCR 2011 statutory clauses, Rule 6(11) Unit Sale Price calculations, and FSSAI guidelines to answer your questions in real time.
              </p>
            </div>

            {/* Quick Starter Topics
            <div className="mt-4 flex flex-col gap-1.5 text-left">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Planned Capabilities
              </span>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs text-slate-700">
                💬 Instant PCR 2011 rule lookup &amp; exemption checks
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs text-slate-700">
                📐 Font height &amp; PDP area ratio calculator
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs text-slate-700">
                ⚖️ Section 36 penalty &amp; compounding fee estimator
              </div>
            </div> */}

            {/* Got it Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full py-3 bg-[#0F2A59] text-white rounded-xl font-semibold text-xs hover:bg-[#1B365D] transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

