// Emotional Intelligence Types
export interface EmotionalMetrics {
  selfAwareness: number;
  selfRegulation: number;
  empathy: number;
  motivation: number;
  socialSkills: number;
}

// Mindfulness Types
export interface MindfulnessMetrics {
  presentMomentAwareness: number;
  nonJudgmentalAwareness: number;
  bodyAwareness: number;
}

// Core Beliefs
export interface CoreBeliefs {
  self: readonly string[];
  others: readonly string[];
  world: readonly string[];
  future: readonly string[];
}

// Thought Patterns
export type ThoughtPatternKey = 'stormy' | 'sunny' | 'cloudy';

export interface ThoughtPattern {
  label: string;
  description: string;
  color: string;
  level: 'ground' | 'first' | 'second' | 'third';
}

// Emotional Spectrum
export interface EmotionGradation {
  primary: string;
  gradations: readonly string[];
  sensations: readonly string[];
}

// Physical Sensations
export type PhysicalSensationCategory = readonly string[];

// Analysis Types
export type EgoState = 'Parent' | 'Adult' | 'Child';

export interface CognitiveAnalysis {
  egoState: EgoState;
  emotionalIntelligence: EmotionalMetrics;
  mindfulness: MindfulnessMetrics;
  attachmentStyle: string;
  thoughtPattern: ThoughtPattern;
  emotionalContext: EmotionGradation;
}

// Constants
export const THOUGHT_PATTERNS: Record<ThoughtPatternKey, ThoughtPattern> = {
  'stormy': {
    label: 'Stormy Thoughts',
    description: 'Turbulent, overwhelming thoughts',
    color: '#4A5568',
    level: 'ground'
  },
  'sunny': {
    label: 'Clear Skies',
    description: 'Clear, optimistic thinking',
    color: '#F6E05E',
    level: 'ground'
  },
  'cloudy': {
    label: 'Clouded Judgment',
    description: 'Unclear, uncertain thoughts',
    color: '#718096',
    level: 'ground'
  }
} as const;

export const EMOTIONAL_SPECTRUM = {
  joy: {
    primary: '😊',
    gradations: ['content', 'happy', 'elated', 'ecstatic'],
    sensations: ['warmth', 'lightness', 'energy']
  },
  sadness: {
    primary: '😢',
    gradations: ['disappointed', 'sad', 'grief', 'despair'],
    sensations: ['heaviness', 'fatigue', 'emptiness']
  }
} as const;

export const PHYSICAL_SENSATIONS = {
  tension: ['neck', 'shoulders', 'jaw', 'chest'],
  energy: ['high', 'low', 'scattered', 'focused'],
  comfort: ['relaxed', 'uneasy', 'restless', 'calm']
} as const;

export const CORE_BELIEFS = {
  self: ['worthy', 'capable', 'lovable', 'strong'],
  world: ['safe', 'fair', 'abundant', 'meaningful'],
  others: ['trustworthy', 'supportive', 'accepting', 'kind'],
  future: ['hopeful', 'possible', 'bright', 'open']
} as const;

// Insight Types
export interface CognitiveInsights {
  egoStates: Record<EgoState, number>;
  emotionalGrowth: EmotionalMetrics[];
  mindfulness: MindfulnessMetrics[];
  attachmentTrends: string[];
  thoughtPatterns: {
    pattern: string;
    count: number;
    info: ThoughtPattern;
  }[];
}

// Processing Stage Types
export type ProcessingStage = 'initial' | 'analyzed' | 'reframed';

export interface ProcessingProgress {
  currentStage: ProcessingStage;
  completedSteps: string[];
  overallProgress: number;
}
