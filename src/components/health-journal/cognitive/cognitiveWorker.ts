import { ThoughtEntry } from '../../../hooks/useHSJData';
import {
  EgoState,
  EmotionalMetrics,
  MindfulnessMetrics,
  CognitiveAnalysis,
  CognitiveInsights,
  THOUGHT_PATTERNS,
  ThoughtPatternKey
} from './types';

export class CognitiveProcessor {
  private analyzeEgoStatePatterns(entries: ThoughtEntry[]): Record<EgoState, number> {
    const patterns: Record<EgoState, number> = {
      Parent: 0,
      Adult: 0,
      Child: 0
    };
    
    entries.forEach(entry => {
      const state = entry.analysis?.egoState;
      if (state && (state === 'Parent' || state === 'Adult' || state === 'Child')) {
        patterns[state as EgoState] += 1;
      }
    });

    return patterns;
  }

  private analyzeEmotionalPatterns(entries: ThoughtEntry[]): EmotionalMetrics[] {
    return entries
      .map(entry => entry.analysis?.emotionalIntelligence)
      .filter((ei): ei is EmotionalMetrics => ei !== undefined);
  }

  private analyzeMindfulnessPatterns(entries: ThoughtEntry[]): MindfulnessMetrics[] {
    return entries
      .map(entry => entry.analysis?.mindfulness)
      .filter((m): m is MindfulnessMetrics => m !== undefined);
  }

  private analyzeAttachmentTrends(entries: ThoughtEntry[]): string[] {
    return entries
      .map(entry => entry.analysis?.attachmentStyle)
      .filter((style): style is string => style !== undefined);
  }

  private analyzeThoughtPatterns(entries: ThoughtEntry[]): CognitiveInsights['thoughtPatterns'] {
    const patterns = entries.reduce((acc: Record<string, number>, entry) => {
      const pattern = entry.pattern;
      if (!pattern) return acc;
      
      return {
        ...acc,
        [pattern]: (acc[pattern] || 0) + 1
      };
    }, {});

    return Object.entries(patterns).map(([pattern, count]) => ({
      pattern,
      count,
      info: THOUGHT_PATTERNS[pattern as ThoughtPatternKey]
    }));
  }
}
