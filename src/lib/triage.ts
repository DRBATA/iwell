// Multi-dimensional triage system
// Layer 1: Binary emergency/not (like base carrier wave)
// Layer 2: Category patterns (like frequency bands)
// Layer 3: Detailed assessment (like signal modulation)

export type CareDestination = 
  | 'EMERGENCY_999'
  | 'AE'
  | 'MIU'
  | 'GP'
  | 'PHARMACY'
  | 'SELF_CARE';

interface TriagePattern {
  // Layer 1: Binary emergency indicators
  emergency: {
    keywords: string[];
    timeframe?: 'immediate' | '4_hours' | 'today' | 'routine';
  };
  // Layer 2: Category patterns
  category: {
    physical?: string[];    // Physical symptoms
    mental?: string[];      // Mental health indicators
    systemic?: string[];    // System-wide symptoms
  };
  // Layer 3: Detailed assessment
  assessment: {
    questions: string[];    // Follow-up questions
    indicators: string[];   // Key clinical indicators
    escalators: string[];   // Things that make it more serious
  };
}

// Multi-dimensional pattern matching
export const TRIAGE_PATTERNS: Record<string, TriagePattern> = {
  breathing: {
    emergency: {
      keywords: ["cant breathe", "gasping", "choking"],
      timeframe: 'immediate'
    },
    category: {
      physical: ["wheezing", "chest tight"],
      systemic: ["blue lips", "drowsy"]
    },
    assessment: {
      questions: ["When did it start?", "Previous asthma?"],
      indicators: ["unable to speak", "exhaustion"],
      escalators: ["getting worse", "not improving with inhaler"]
    }
  },

  chest_pain: {
    emergency: {
      keywords: ["chest pain", "heart attack"],
      timeframe: 'immediate'
    },
    category: {
      physical: ["crushing", "tight"],
      systemic: ["sweating", "nausea"]
    },
    assessment: {
      questions: ["Where exactly?", "Pain spreading?"],
      indicators: ["central chest", "arm pain"],
      escalators: ["getting worse", "shortness of breath"]
    }
  },

  stroke: {
    emergency: {
      keywords: ["stroke", "face drooping"],
      timeframe: '4_hours'
    },
    category: {
      physical: ["weakness", "numbness"],
      systemic: ["confusion", "speech"]
    },
    assessment: {
      questions: ["When exactly did it start?", "FAST test?"],
      indicators: ["one-sided", "sudden onset"],
      escalators: ["getting worse", "multiple symptoms"]
    }
  },

  mental_health: {
    emergency: {
      keywords: ["suicide", "harm", "crisis"],
      timeframe: 'immediate'
    },
    category: {
      mental: ["depression", "anxiety", "psychosis"],
      physical: ["panic", "chest tight"]
    },
    assessment: {
      questions: ["Do you feel safe?", "Support available?"],
      indicators: ["plan to harm", "severe distress"],
      escalators: ["getting worse", "no support"]
    }
  }
};

// Layer 1: Binary emergency decision
function isEmergency(input: string): boolean {
  return Object.values(TRIAGE_PATTERNS).some(pattern =>
    pattern.emergency.keywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    )
  );
}

// Layer 2: Category matching
function matchCategory(input: string): string[] {
  const matches: string[] = [];
  const lowerInput = input.toLowerCase();

  Object.entries(TRIAGE_PATTERNS).forEach(([name, pattern]) => {
    const allKeywords = [
      ...(pattern.category.physical || []),
      ...(pattern.category.mental || []),
      ...(pattern.category.systemic || [])
    ];

    if (allKeywords.some(keyword => lowerInput.includes(keyword))) {
      matches.push(name);
    }
  });

  return matches;
}

// Layer 3: Assessment generation
function getAssessment(category: string): string[] {
  const pattern = TRIAGE_PATTERNS[category];
  if (!pattern) return [];

  return [
    ...pattern.assessment.questions,
    ...pattern.assessment.indicators.map(i => `Check for: ${i}`),
    ...pattern.assessment.escalators.map(e => `Warning if: ${e}`)
  ];
}

// Multi-dimensional triage decision
export function determineCareDestination(symptoms: string[]): CareDestination {
  const input = symptoms.join(' ');

  // Layer 1: Emergency check
  if (isEmergency(input)) {
    return 'EMERGENCY_999';
  }

  // Layer 2: Category matching
  const categories = matchCategory(input);
  
  // Layer 3: Assessment based routing
  if (categories.some(c => TRIAGE_PATTERNS[c].emergency.timeframe === '4_hours')) {
    return 'AE';
  }

  if (categories.length > 0) {
    const hasUrgentIndicators = categories.some(c =>
      TRIAGE_PATTERNS[c].assessment.escalators.some(e => 
        input.toLowerCase().includes(e)
      )
    );
    return hasUrgentIndicators ? 'MIU' : 'GP';
  }

  return 'SELF_CARE';
}

export function getDestinationExplanation(destination: CareDestination): string {
  switch (destination) {
    case 'EMERGENCY_999':
      return "⚠️ CALL 999 IMMEDIATELY. These symptoms require emergency assessment.";
    case 'AE':
      return "You need to go to A&E. Some conditions (like early stroke) have better outcomes with quick treatment.";
    case 'MIU':
      return "Visit a Minor Injuries Unit. They can assess and treat many urgent conditions.";
    case 'GP':
      return "Book an appointment with your GP. If symptoms worsen, call 111.";
    case 'PHARMACY':
      return "Visit your pharmacy for advice and treatment.";
    case 'SELF_CARE':
      return "These symptoms can usually be managed at home. If they worsen, contact your GP.";
  }
}
