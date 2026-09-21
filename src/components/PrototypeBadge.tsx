import React, { useState } from 'react';
import { FlaskConical, X } from 'lucide-react';
import { useI18n } from '../i18n';

interface PrototypeBadgeProps {
  variant?: 'banner' | 'pill' | 'compact';
}

export const PrototypeBadge: React.FC<PrototypeBadgeProps> = ({ variant = 'banner' }) => {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useI18n();

  if (dismissed && variant === 'banner') return null;

  if (variant === 'pill') {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#e6eeff] text-[#00153b] font-mono text-[11px] font-semibold border border-[#c4c6d0]/40 shadow-xs">
        <span>{t('prototype')}</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center text-xs text-[#0f2a59] font-medium bg-[#eff4ff] px-2 py-1 rounded border border-[#0f2a59]/15">
        <span>{t('prototype')}</span>
      </div>
    );
  }

  return (
    <div className="bg-[#d5e3fc]/70 border border-[#0f2a59]/20 px-3.5 py-2.5 rounded-xl flex items-start justify-between gap-3 shadow-xs font-sans">
      <div className="flex items-start gap-2.5 min-w-0">
        <FlaskConical className="w-4 h-4 text-[#0f2a59] shrink-0 mt-0.5" />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-xs text-[#0f2a59] uppercase tracking-wider">
              Legal Metrology Sandbox
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#0f2a59] text-white text-[10px] font-mono font-bold">
              {t('prototype')}
            </span>
          </div>
          <p className="text-xs text-[#44474f] mt-0.5 leading-relaxed">
            Demonstration environment showcasing client-side optical bounding box overlays, PCR 2011 Rule 6 / Rule 18 statutory checks, and downloadable PDF inspection notices with sample datasets.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss prototype note"
        className="text-[#44474f] hover:text-[#0f2a59] p-1 shrink-0 rounded transition-colors cursor-pointer"
        title="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
