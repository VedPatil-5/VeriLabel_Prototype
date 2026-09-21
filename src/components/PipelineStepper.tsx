import React from 'react';
import { Layers, Scan, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../i18n';

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PipelineStepperProps {
  currentStageIndex: number;
  stageProgress: number; // 0 to 100
  stageLabel: string;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  currentStageIndex,
  stageProgress,
  stageLabel
}) => {
  const { t } = useI18n();
  const stages = [
    { id: 'prep', name: 'Pre-processing', icon: <Layers className="w-4 h-4" /> },
    { id: 'ocr', name: 'OCR', icon: <Scan className="w-4 h-4" /> },
    { id: 'rules', name: 'Rule Validation', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'verdict', name: 'Verdict', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 font-sans flex flex-col gap-3 animate-fadeIn">
      {/* Header with live progress % */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-ping" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('analysis')}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-[#007AFF]">
          {Math.min(100, Math.round(stageProgress))}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-[#007AFF] via-[#2563EB] to-[#15803D] transition-all duration-300 rounded-full"
          style={{ width: `${stageProgress}%` }}
        />
      </div>

      {/* 4 Stages Indicator */}
      <div className="grid grid-cols-4 gap-1 pt-1">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div
              key={stage.id}
              className={`flex flex-col items-center text-center gap-1 transition-all ${
                isDone
                  ? 'text-[#15803D]'
                  : isCurrent
                  ? 'text-[#007AFF] font-semibold scale-105'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-400 text-[#15803D]'
                    : isCurrent
                    ? 'bg-blue-50 border-[#007AFF] text-[#007AFF] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {stage.icon}
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight">
                {stage.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stage Status Subtitle */}
      <div className="text-center text-xs text-slate-500 font-medium pt-1">
        {stageLabel}
      </div>
    </div>
  );
};
