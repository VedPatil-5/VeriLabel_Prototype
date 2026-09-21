import React, { useState } from 'react';
import { SampleDataset } from '../types';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useI18n } from '../i18n';

interface ResultsPanelProps {
  sample: SampleDataset;
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  sample,
  onDownloadPdf,
  isGeneratingPdf = false
}) => {
  const { t } = useI18n();
  const [violationsExpanded, setViolationsExpanded] = useState(true);
  const [compliantExpanded, setCompliantExpanded] = useState(true);

  const hasViolations = sample.violations && sample.violations.length > 0;
  const compliantCount = sample.compliant?.length || 0;
  const violationsCount = sample.violations?.length || 0;

  return (
    <div className="flex flex-col gap-4 font-sans">
      {/* 1. Violations Found Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <button
          type="button"
          onClick={() => setViolationsExpanded(!violationsExpanded)}
          className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors select-none text-left cursor-pointer border-b border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                hasViolations ? 'bg-red-100 text-[#B91C1C]' : 'bg-emerald-100 text-[#15803D]'
              }`}
            >
              {hasViolations ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 font-display">
                {t('violationsFound')}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  hasViolations
                    ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'
                    : 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                }`}
              >
                {violationsCount}
              </span>
            </div>
          </div>
          {violationsExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {violationsExpanded && (
          <div className="p-4 flex flex-col gap-3 bg-slate-50/30">
            {!hasViolations ? (
              <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#15803D] shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#15803D]">
                    {t('noViolations')}
                  </span>
                  <span className="text-xs text-slate-600 mt-0.5">
                    All mandatory declaration parameters comply strictly with PCR 2011 and regulatory requirements.
                  </span>
                </div>
              </div>
            ) : (
              sample.violations.map((v) => {
                const isCritical = v.severity === 'critical';
                return (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl border border-red-200/80 bg-[#FEF2F2]/60 flex flex-col gap-1.5 transition-all hover:bg-[#FEF2F2]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCritical ? (
                          <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
                        )}
                        <span className="text-xs font-bold text-[#B91C1C] uppercase tracking-wider font-mono">
                          {v.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isCritical
                              ? 'bg-[#B91C1C] text-white'
                              : 'bg-[#D97706] text-white'
                          }`}
                        >
                          {v.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-800 font-medium pl-6 leading-relaxed">
                      {v.desc}
                    </p>
                    <p className="text-[11px] text-slate-500 font-normal pl-6 leading-snug">
                      {v.rule}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 2. Compliant Elements Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <button
          type="button"
          onClick={() => setCompliantExpanded(!compliantExpanded)}
          className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50/50 transition-colors select-none text-left cursor-pointer border-b border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#15803D] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 font-display">
                {t('compliantElements')}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]">
                {compliantCount}
              </span>
            </div>
          </div>
          {compliantExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {compliantExpanded && (
          <div className="p-4 flex flex-col gap-2.5 bg-slate-50/30">
            {sample.compliant.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl border border-emerald-200/60 bg-[#F0FDF4]/50 flex items-start gap-3 transition-all hover:bg-[#F0FDF4]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {c.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#15803D] text-white text-[10px] font-bold leading-none">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {c.desc}
                  </p>
                  <p className="text-xs font-medium text-slate-800 mt-0.5">
                    <span className="text-slate-400 font-normal">Value: </span>
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Action Download Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className="w-full py-3.5 px-4 rounded-xl bg-[#0F2A59] hover:bg-[#1B365D] active:bg-[#0A1B3A] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isGeneratingPdf ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>
                    {isGeneratingPdf ? t('generatingPdf') : t('downloadPdf')}
          </span>
        </button>
      </div>
    </div>
  );
};

