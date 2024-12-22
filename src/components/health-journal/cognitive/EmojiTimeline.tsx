import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HSJHealthData } from '../../../lib/manifest/types';

type ThoughtEntry = NonNullable<HSJHealthData['cognitive']>['thoughts'][0];

interface EmojiTimelineProps {
  entries: ThoughtEntry[];
  onEntryClick: (thoughtId: string) => void;
}

export default function EmojiTimeline({ entries, onEntryClick }: EmojiTimelineProps) {
  const [viewType, setViewType] = useState<'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter entries based on view type
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    if (viewType === 'day') {
      return entryDate.toDateString() === currentDate.toDateString();
    } else {
      const weekAgo = new Date(currentDate);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo && entryDate <= currentDate;
    }
  });

  // Sort entries by timestamp
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Get emoji for emotion
  const getEmoji = (emotion: string): string => {
    switch (emotion.toLowerCase()) {
      case 'happy':
      case 'joy':
        return '😊';
      case 'sad':
      case 'sadness':
        return '😢';
      case 'angry':
      case 'anger':
        return '😠';
      case 'fear':
      case 'afraid':
        return '😨';
      case 'surprise':
      case 'surprised':
        return '😲';
      default:
        return '😐';
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* View Type Toggle */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setViewType('day')}
          className={`px-3 py-1 rounded ${
            viewType === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          aria-label="View daily entries"
        >
          Day
        </button>
        <button
          onClick={() => setViewType('week')}
          className={`px-3 py-1 rounded ${
            viewType === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
          aria-label="View weekly entries"
        >
          Week
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {sortedEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onEntryClick(entry.id)}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl" role="img" aria-label={entry.emotion}>
                {getEmoji(entry.emotion)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900">
                    {entry.automaticThought}
                  </p>
                  <span className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Feeling:</span> {entry.emotion} (Intensity: {entry.intensity})
                </div>
                {entry.patterns.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {entry.patterns.map((pattern) => (
                      <span
                        key={pattern}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {pattern}
                      </span>
                    ))}
                  </div>
                )}
                {entry.alternativeThought && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Alternative:</span> {entry.alternativeThought}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
