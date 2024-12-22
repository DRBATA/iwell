import React, { useState } from 'react';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../../ui/radio-group';
import { BPValidationLimits } from './types';

interface BPEntryFormProps {
  onSubmit: (reading: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    setting?: 'home' | 'clinic';
    position?: 'sitting' | 'standing' | 'lying';
  }) => void;
  mode: 'quick' | 'standard';
  requireChecks: boolean;
  validationLimits: BPValidationLimits;
}

export function BPEntryForm({
  onSubmit,
  mode,
  requireChecks,
  validationLimits
}: BPEntryFormProps) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [setting, setSetting] = useState<'home' | 'clinic'>('home');
  const [position, setPosition] = useState<'sitting' | 'standing' | 'lying'>('sitting');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reading = {
      systolic: parseInt(systolic) || 0,
      diastolic: parseInt(diastolic) || 0,
      heartRate: parseInt(heartRate) || 0,
      setting,
      position
    };

    // Validate readings
    if (reading.systolic < validationLimits.systolic.min || 
        reading.systolic > validationLimits.systolic.max ||
        reading.diastolic < validationLimits.diastolic.min || 
        reading.diastolic > validationLimits.diastolic.max) {
      alert('Please check your readings. Values seem outside normal range.');
      return;
    }

    onSubmit(reading);

    // Reset form
    setSystolic('');
    setDiastolic('');
    setHeartRate('');
    setSetting('home');
    setPosition('sitting');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="systolic">Systolic</Label>
          <Input
            id="systolic"
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            placeholder="120"
            required
          />
        </div>
        <div>
          <Label htmlFor="diastolic">Diastolic</Label>
          <Input
            id="diastolic"
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            placeholder="80"
            required
          />
        </div>
        <div>
          <Label htmlFor="heartRate">Heart Rate</Label>
          <Input
            id="heartRate"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="72"
            required
          />
        </div>
      </div>

      {mode === 'standard' && (
        <div className="space-y-4">
          <div>
            <Label>Setting</Label>
            <RadioGroup value={setting} onValueChange={(value: 'home' | 'clinic') => setSetting(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="setting-home" />
                <Label htmlFor="setting-home">Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="clinic" id="setting-clinic" />
                <Label htmlFor="setting-clinic">Clinic</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Position</Label>
            <RadioGroup 
              value={position} 
              onValueChange={(value: 'sitting' | 'standing' | 'lying') => setPosition(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sitting" id="position-sitting" />
                <Label htmlFor="position-sitting">Sitting</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standing" id="position-standing" />
                <Label htmlFor="position-standing">Standing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lying" id="position-lying" />
                <Label htmlFor="position-lying">Lying</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 bg-[#00CED1] text-white rounded-lg hover:bg-[#00CED1]/80"
      >
        Save Reading
      </button>
    </form>
  );
}
