import React, { useState, useCallback } from 'react';
import { useHSJ } from '../../../../lib/manifest';
import { BPEntryForm } from './BPEntryForm';
import BPChart from './BPChart';

export default function BloodPressure() {
  const { manifest, healthData, updateHealthData } = useHSJ();
  const [mode, setMode] = useState<'quick' | 'standard'>('quick');

  // Early return if feature is disabled in manifest
  if (!manifest?.configurations.bloodPressure.enabled) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Blood Pressure Monitoring</h2>
        <p className="text-gray-600">This feature is currently disabled.</p>
      </div>
    );
  }

  // Get configuration from manifest
  const config = manifest.configurations.bloodPressure;
  const readings = healthData?.bloodPressure?.readings ?? [];

  const handleSubmit = useCallback(async (reading: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    position?: 'sitting' | 'standing' | 'lying';
  }) => {
    const newReading = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      systolic: reading.systolic,
      diastolic: reading.diastolic,
      heartRate: reading.heartRate,
      setting: mode === 'quick' ? 'home' : 'clinic',
      position: reading.position || 'sitting'
    };

    // Update through manifest system
    await updateHealthData({
      path: 'bloodPressure.readings',
      operation: 'add',
      value: [...readings, newReading],
      timestamp: new Date().toISOString()
    });
  }, [mode, readings, updateHealthData]);

  const handleReadingClick = useCallback((reading: any) => {
    console.log('Reading clicked:', reading);
    // Implement reading details view
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Blood Pressure Monitor</h2>
        
        {/* Mode Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Mode</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setMode('quick')}
              className={`px-4 py-2 rounded ${
                mode === 'quick'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Quick Entry
            </button>
            <button
              onClick={() => setMode('standard')}
              className={`px-4 py-2 rounded ${
                mode === 'standard'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Standard Entry
            </button>
          </div>
        </div>

        {/* Entry Form */}
        <BPEntryForm
          onSubmit={handleSubmit}
          mode={mode}
          requireChecks={mode === 'standard'}
          validationLimits={config.limits}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">History</h3>
        <BPChart
          readings={readings}
          onReadingClick={handleReadingClick}
          validationLimits={config.limits}
        />
      </div>

      {/* Analysis Section */}
      {healthData?.bloodPressure?.analysis && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Analysis</h3>
          <div className="space-y-4">
            {healthData.bloodPressure.analysis.trends.map((trend, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded">
                {trend}
              </div>
            ))}
            {healthData.bloodPressure.analysis.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-green-50 rounded">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
