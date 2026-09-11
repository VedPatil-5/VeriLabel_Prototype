import React from 'react';
import { SampleDataset } from '../types';

interface PhotosGridProps {
  isOpen: boolean;
  samples: SampleDataset[];
  onSelectSample: (sample: SampleDataset) => void;
  onCancel: () => void;
}

export const PhotosGrid: React.FC<PhotosGridProps> = ({
  isOpen,
  samples,
  onSelectSample,
  onCancel
}) => {
  if (!isOpen) return null;

  // We display exactly the 5 plain square images edge-to-edge as specified
  const displaySamples = samples.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9ff] flex flex-col font-sans select-none animate-fadeIn">
      {/* Native iOS Photos Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 pt-safe">
        <div className="h-14 px-4 flex items-center justify-between relative">
          <button
            type="button"
            onClick={onCancel}
            className="text-[#007AFF] text-[17px] font-normal active:opacity-60 transition-opacity min-h-[44px] flex items-center cursor-pointer"
          >
            Cancel
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              Photos
            </h1>
          </div>
          <div className="w-12" /> {/* Balancing spacer */}
        </div>
      </header>

      {/* Edge-to-edge Native Photos Grid (Plain square images, no captions or labels) */}
      <main className="flex-1 overflow-y-auto pb-safe">
        <div className="grid grid-cols-3 gap-[2px] bg-slate-200">
          {displaySamples.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="relative aspect-square w-full bg-slate-100 overflow-hidden active:opacity-60 transition-opacity cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <img
                src={sample.thumbnailUrl || sample.imagePath}
                alt=""
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

