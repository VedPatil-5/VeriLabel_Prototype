import React, { useState, useRef } from 'react';
import { SAMPLE_DATASETS } from '../data/presets';
import { SampleDataset } from '../types';
import { ActionSheet } from './ActionSheet';
import { PhotosGrid } from './PhotosGrid';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';
import { PipelineStepper } from './PipelineStepper';
import { ResultsPanel } from './ResultsPanel';
import { generateInspectionPdf } from '../services/pdfService';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FlipHorizontal,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ScannerTab: React.FC = () => {
  const [activeSample, setActiveSample] = useState<SampleDataset>(SAMPLE_DATASETS[0]);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState<boolean>(false);
  const [isPhotosGridOpen, setIsPhotosGridOpen] = useState<boolean>(false);

  // Simulated Scanning & Pipeline State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [stageLabel, setStageLabel] = useState<string>('Ready to scan');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  // PDF Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Run the 3-4s simulated pipeline animation
  const runSimulatedScan = (sampleToLoad: SampleDataset) => {
    setIsScanning(true);
    setShowBoundingBoxes(false);
    setStageIndex(0);
    setStageProgress(5);
    setStageLabel('Pre-processing image and enhancing contrast...');

    // Stage 1: Pre-processing (0 - 800ms)
    setTimeout(() => {
      setStageIndex(0);
      setStageProgress(25);
      setStageLabel('Binarizing typography & isolating text regions...');
    }, 800);

    // Stage 2: OCR (800ms - 1800ms)
    setTimeout(() => {
      setStageIndex(1);
      setStageProgress(50);
      setStageLabel('Extracting optical characters & text tokens...');
    }, 1800);

    // Stage 3: Rule Validation (1800ms - 2800ms)
    setTimeout(() => {
      setStageIndex(2);
      setStageProgress(75);
      setStageLabel('Validating declarations against PCR 2011 Rule 6 & 11...');
    }, 2800);

    // Stage 4: Verdict (2800ms - 3500ms)
    setTimeout(() => {
      setStageIndex(3);
      setStageProgress(100);
      setStageLabel('Finalizing compliance verdict & bounding boxes...');
    }, 3400);

    // Complete buffer and reveal bounding boxes (3600ms)
    setTimeout(() => {
      setActiveSample(sampleToLoad);
      setIsScanning(false);
      setShowBoundingBoxes(true);

      if (sampleToLoad.defaultStatus === 'COMPLIANT') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
        showToast('100% Compliant • All PCR 2011 declarations verified');
      } else {
        showToast(`Loaded ${sampleToLoad.name}`);
      }
    }, 3600);
  };

  // Select Sample from Photos Grid
  const handleSelectFromLibrary = (sample: SampleDataset) => {
    setIsPhotosGridOpen(false);
    runSimulatedScan(sample);
  };

  // Action Sheet Handlers
  const handleTakePhoto = () => {
    setIsActionSheetOpen(false);
    runSimulatedScan(activeSample);
    showToast('Camera capture simulated');
  };

  const handleChooseFromLibrary = () => {
    setIsActionSheetOpen(false);
    setTimeout(() => {
      setIsPhotosGridOpen(true);
    }, 200);
  };

  const handleChooseFiles = () => {
    setIsActionSheetOpen(false);
    fileInputRef.current?.click();
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const nextSample = SAMPLE_DATASETS.find(s =>
        file.name.toLowerCase().includes(s.id) || file.name.toLowerCase().includes('rajkamal')
      ) || SAMPLE_DATASETS[1];
      runSimulatedScan(nextSample);
      showToast(`Loaded file: ${file.name}`);
    }
  };

  // PDF Export
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateInspectionPdf(activeSample);
      showToast('Inspection report PDF downloaded');
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Error generating PDF report');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto space-y-5 pb-16 font-sans">
      {/* Top Intro Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
          Product Label Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Point camera at mandatory declaration panels or pick a packaged commodity test sample.
        </p>
      </div>

      {/* UPI-style Camera Viewfinder Frame */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-200/80">
        {/* Background Image Viewport */}
        <div
          className="relative w-full h-72 sm:h-80 bg-cover bg-center transition-all duration-300"
          style={{ backgroundImage: `url('${activeSample.imagePath}')` }}
        >
          {/* Dark gradient overlay like UPI scan screen */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

          {/* Top info tag on viewfinder */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-30">
            <div className="px-3 py-1 rounded-md bg-black/50 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[220px]">Active: {activeSample.name}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsActionSheetOpen(true)}
              className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
              title="Switch Product"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Laser Alignment Frame */}
          <div className="absolute inset-6 pointer-events-none flex flex-col justify-between z-20">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 border-t-4 border-l-4 border-[#004ac6] rounded-tl-lg" />
              <div className="w-8 h-8 border-t-4 border-r-4 border-[#004ac6] rounded-tr-lg" />
            </div>

            {/* Laser animated horizontal line */}
            <div className="relative w-full h-[2px] bg-linear-to-r from-transparent via-[#2563eb] to-transparent shadow-[0_0_12px_#2563eb] animate-pulse my-auto" />

            <div className="flex justify-between items-end">
              <div className="w-8 h-8 border-b-4 border-l-4 border-[#004ac6] rounded-bl-lg" />
              <div className="w-8 h-8 border-b-4 border-r-4 border-[#004ac6] rounded-br-lg" />
            </div>
          </div>

          {/* Pre-placed Bounding Box Overlays */}
          <BoundingBoxOverlay
            boxes={activeSample.boundingBoxes}
            isVisible={showBoundingBoxes && !isScanning}
          />
        </div>
      </div>

      {/* Prominent Upload Action Button */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsActionSheetOpen(true)}
          disabled={isScanning}
          className="w-full py-3.5 px-6 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] active:bg-[#00174b] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <UploadCloud className="w-5 h-5" />
          <span>Upload Label Image</span>
        </button>
      </div>

      {/* Pipeline Stepper (Visible during scan) */}
      {isScanning && (
        <PipelineStepper
          currentStageIndex={stageIndex}
          stageProgress={stageProgress}
          stageLabel={stageLabel}
        />
      )}

      {/* Inspection Results Dossier */}
      <ResultsPanel
        sample={activeSample}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
      />

      {/* Secondary Bottom Action: Test Another Product */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsPhotosGridOpen(true)}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-4 h-4 text-[#004ac6]" />
          <span>Test Another Product</span>
        </button>
      </div>

      {/* Hidden File Input for Custom Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCustomFileUpload}
      />

      {/* Native iOS Action Sheet Modal */}
      <ActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onTakePhoto={handleTakePhoto}
        onChooseLibrary={handleChooseFromLibrary}
        onChooseFiles={handleChooseFiles}
      />

      {/* Native iOS Photos Grid Picker */}
      <PhotosGrid
        isOpen={isPhotosGridOpen}
        samples={SAMPLE_DATASETS}
        onSelectSample={handleSelectFromLibrary}
        onCancel={() => setIsPhotosGridOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between transition-all duration-300 z-50 animate-slideUp">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
