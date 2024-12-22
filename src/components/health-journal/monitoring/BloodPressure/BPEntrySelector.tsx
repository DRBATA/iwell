import React from 'react';
import { Card } from '../../../ui/card';
import { BPEntryForm } from './BPEntryForm';
import { BPReading, BPValidationLimits } from './types';

export interface BPEntrySelectorProps {
  mode: 'quick' | 'standard';
  setMode: (mode: 'quick' | 'standard') => void;
  onSubmit: (reading: Omit<BPReading, 'id' | 'timestamp'>) => void;
  validationLimits: BPValidationLimits;
}

export function BPEntrySelector({
  mode,
  setMode,
  onSubmit,
  validationLimits
}: BPEntrySelectorProps) {
  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode('quick')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'quick'
              ? 'bg-[#00CED1] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Quick Entry
        </button>
        <button
          onClick={() => setMode('standard')}
          className={`px-4 py-2 rounded-lg ${
            mode === 'standard'
              ? 'bg-[#00CED1] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Standard Entry
        </button>
      </div>

      {/* Quick Entry Form */}
      {mode === 'quick' && (
        <Card className="p-4">
          <BPEntryForm
            onSubmit={onSubmit}
            mode="quick"
            requireChecks={false}
            validationLimits={validationLimits}
          />
        </Card>
      )}

      {/* Standard Entry Form */}
      {mode === 'standard' && (
        <Card className="p-4">
          <BPEntryForm
            onSubmit={onSubmit}
            mode="standard"
            requireChecks={true}
            validationLimits={validationLimits}
          />
        </Card>
      )}
    </div>
  );
}
