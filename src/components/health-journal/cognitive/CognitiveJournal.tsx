import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '../../ui/card';
import { useHSJ } from '../../../lib/manifest';
import EmojiTimeline from './EmojiTimeline';
import { CognitiveInsights } from './CognitiveInsights';
import { THOUGHT_PATTERNS, EMOTIONAL_SPECTRUM } from './types';

export default function CognitiveJournal() {
  const { manifest, healthData, updateHealthData } = useHSJ();
  const [automaticThought, setAutomaticThought] = useState('');
  const [emotion, setEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(50);
  const [patterns, setPatterns] = useState<string[]>([]);
  const [alternativeThought, setAlternativeThought] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const newThought = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      automaticThought,
      emotion,
      intensity,
      patterns,
      alternativeThought
    };

    await updateHealthData({
      path: 'cognitive.thoughts',
      operation: 'add',
      value: [...(healthData?.cognitive?.thoughts || []), newThought],
      timestamp: new Date().toISOString()
    });

    // Reset form
    setAutomaticThought('');
    setEmotion('');
    setIntensity(50);
    setPatterns([]);
    setAlternativeThought('');
  }, [automaticThought, emotion, intensity, patterns, alternativeThought, healthData, updateHealthData]);

  const handleEntryClick = useCallback((thoughtId: string) => {
    setSelectedEntry(thoughtId);
  }, []);

  // Early return if feature is disabled in manifest
  if (!manifest?.configurations.cognitive.enabled) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Cognitive Journal</h2>
        <p className="text-gray-600">This feature is currently disabled.</p>
      </div>
    );
  }

  const thoughts = healthData?.cognitive?.thoughts ?? [];

  return (
    <div className="space-y-6">
      {/* Entry Form */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">New Journal Entry</h2>
          <div className="space-y-4">
            {/* Automatic Thought */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What's on your mind?
              </label>
              <textarea
                value={automaticThought}
                onChange={(e) => setAutomaticThought(e.target.value)}
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder="Write your thoughts here..."
              />
            </div>

            {/* Emotion and Intensity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Emotion
                </label>
                <input
                  type="text"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="How are you feeling?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Intensity (1-100)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center">{intensity}</div>
              </div>
            </div>

            {/* Thought Patterns */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Thought Patterns
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(THOUGHT_PATTERNS).map(([key, pattern]) => (
                  <button
                    key={key}
                    onClick={() => setPatterns(prev => 
                      prev.includes(key)
                        ? prev.filter(p => p !== key)
                        : [...prev, key]
                    )}
                    className={`px-3 py-1 rounded ${
                      patterns.includes(key)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {pattern.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alternative Thought */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Alternative Perspective
              </label>
              <textarea
                value={alternativeThought}
                onChange={(e) => setAlternativeThought(e.target.value)}
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder="Try to reframe your thought..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Save Entry
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Journal Timeline</h3>
          <EmojiTimeline
            entries={thoughts}
            onEntryClick={handleEntryClick}
          />
        </CardContent>
      </Card>

      {/* Insights */}
      {healthData?.cognitive?.analysis && (
        <CognitiveInsights />
      )}
    </div>
  );
}
