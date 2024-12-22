import React, { useState } from 'react';
import { Card } from '../../ui/card';
import BPChart from './BloodPressure/BPChart';
import { BPEntrySelector } from './BloodPressure/BPEntrySelector';
import { BPReading, BloodPressureProps } from './BloodPressure/types';

export default function BloodPressure({
  healthData,
  onUpdate
}: BloodPressureProps) {
  const [mode, setMode] = useState<'quick' | 'standard'>('quick');
  const [selectedReading, setSelectedReading] = useState<BPReading | null>(null);

  // Safely access readings with null check
  const readings = healthData?.bloodPressure?.readings || [];

  // Default safety limits
  const getLimits = () => ({
    systolic: { min: 90, max: 180 },
    diastolic: { min: 60, max: 110 }
  });

  const handleReadingClick = (reading: BPReading) => {
    setSelectedReading(reading);
  };

  const handleSubmit = (reading: Omit<BPReading, 'id' | 'timestamp'>) => {
    const newReading: BPReading = {
      ...reading,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      setting: mode === 'quick' ? 'home' : (reading.setting || 'home'),
      position: reading.position || 'sitting',
      systolic: reading.systolic || 0,
      diastolic: reading.diastolic || 0,
      heartRate: reading.heartRate || 0
    };

    const updatedReadings = [...readings, newReading];
    onUpdate({ readings: updatedReadings });
  };

  return (
    <div className="space-y-6">
      {/* Entry Form */}
      <Card className="p-6">
        <BPEntrySelector
          mode={mode}
          setMode={setMode}
          onSubmit={handleSubmit}
          validationLimits={getLimits()}
        />
      </Card>

      {/* Chart */}
      <Card className="p-6">
        <BPChart 
          readings={readings}
          onReadingClick={handleReadingClick}
          validationLimits={getLimits()}
        />
      </Card>
    </div>
  );
}
