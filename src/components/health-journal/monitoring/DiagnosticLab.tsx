import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertTriangle, Thermometer, Home, AlertCircle } from 'lucide-react';
import { FaHeadSideCough, FaThermometerFull } from 'react-icons/fa';
import { MdSick } from 'react-icons/md';

type SymptomValue = '+' | '+++' | '-' | '+or-';
type SymptomMap = { [key: string]: SymptomValue[] };
type SymptomVariant = { name: string; conditions: string[] };
type SymptomVariants = { [key: string]: SymptomVariant[] };

const CONDITIONS = [
  "Flu", "Cold", "Bronchitis", "Chest Infection", "Middle Ear Infection",
  "Sinusitis", "Glandular Fever", "Allergic Rhinitis", "Viral URTI",
  "Strep Throat", "Submandibular Abscess", "Headache"
] as const;

const SYMPTOM_MAP: SymptomMap = {
  "Sore throat": ["+or-", "+", "-", "-", "-", "-", "-", "-", "+", "+", "-", "-"],
  "Dry cough": ["+", "-", "-", "-", "-", "-", "-", "-", "+", "+", "-", "-"],
  "Wet cough": ["-", "+", "+", "+", "-", "-", "-", "-", "+", "-", "-", "-"],
  "Chesty cough": ["-", "-", "+", "+", "-", "-", "-", "-", "+", "-", "-", "-"],
  "Tiredness": ["+", "-", "-", "-", "-", "-", "+", "-", "+", "-", "-", "-"],
  "Unwell": ["+", "-", "-", "-", "-", "-", "+", "-", "+", "-", "-", "-"],
  "Body aches": ["+++", "+", "+", "+", "-", "-", "+", "-", "+", "-", "-", "-"],
  "Headache": ["+", "+", "-", "-", "-", "+", "-", "-", "+", "-", "-", "+"],
  "Fever": ["+", "+", "-", "+", "-", "-", "-", "-", "+", "-", "-", "+"],
  "Blocked nose": ["+", "+", "-", "-", "-", "+", "-", "+", "+", "-", "-", "+"]
};

const CONDITION_INFO = {
  "Flu": {
    selfCare: [
      "Rest and stay hydrated",
      "Take paracetamol for fever and aches",
      "Keep warm",
      "Consider antiviral medication if within 48 hours of symptoms"
    ],
    warningSign: [
      "Difficulty breathing",
      "Chest pain",
      "Coughing up blood",
      "Severe dizziness",
      "Confusion"
    ],
    typicalDuration: "5-7 days",
    preventionTips: [
      "Annual flu vaccination",
      "Regular hand washing",
      "Avoid close contact with sick people"
    ]
  },
  "Cold": {
    selfCare: [
      "Rest and stay hydrated",
      "Over-the-counter decongestants",
      "Saline nasal sprays",
      "Honey for cough"
    ],
    warningSign: [
      "High fever",
      "Severe headache",
      "Difficulty breathing",
      "Symptoms lasting more than 10 days"
    ],
    typicalDuration: "7-10 days",
    preventionTips: [
      "Regular hand washing",
      "Avoid touching face",
      "Stay away from sick people"
    ]
  }
};

interface Symptom {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  symptoms: Symptom[];
}

const symptomCategories: Category[] = [
  {
    id: 'general',
    name: 'General',
    icon: <FaThermometerFull className="w-6 h-6" />,
    symptoms: [
      { id: 'Sore throat', name: 'Sore Throat', severity: 'medium', description: 'Pain or discomfort in throat' },
      { id: 'Tiredness', name: 'Tiredness', severity: 'medium', description: 'Feeling of tiredness' },
      { id: 'Unwell', name: 'Feeling Unwell', severity: 'medium', description: 'General malaise' },
      { id: 'Body aches', name: 'Body Aches', severity: 'high', description: 'Muscle and joint pain' },
      { id: 'Headache', name: 'Headache', severity: 'medium', description: 'Head pain or pressure' }
    ]
  },
  {
    id: 'respiratory',
    name: 'Respiratory',
    icon: <FaHeadSideCough className="w-6 h-6" />,
    symptoms: [
      { id: 'Dry cough', name: 'Dry Cough', severity: 'medium', description: 'Non-productive cough' },
      { id: 'Wet cough', name: 'Wet Cough', severity: 'medium', description: 'Productive cough with phlegm' },
      { id: 'Chesty cough', name: 'Chesty Cough', severity: 'high', description: 'Deep chest cough' },
      { id: 'Blocked nose', name: 'Blocked Nose', severity: 'low', description: 'Nasal congestion' }
    ]
  }
];

interface SelectedSymptom {
  id: string;
  intensity: number;
  variant?: string;
}

interface Analysis {
  condition: string;
  matchStrength: number;
  matchCategory: 'Most Likely' | 'Possible' | 'Must Not Miss' | 'Unlikely';
  description?: string;
  matchingSymptoms: string[];
  selfCare?: string[];
  warningSign?: string[];
  typicalDuration?: string;
  preventionTips?: string[];
}

export default function DiagnosticLab() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(symptomCategories[0].id);
  const [analysis, setAnalysis] = useState<Analysis[] | null>(null);

  const handleSymptomSelect = (symptomId: string) => {
    if (selectedSymptoms.some(s => s.id === symptomId)) {
      setSelectedSymptoms(prev => prev.filter(s => s.id !== symptomId));
    } else {
      setSelectedSymptoms(prev => [...prev, { id: symptomId, intensity: 1 }]);
    }
  };

  const analyzeSymptoms = () => {
    const conditionScores = CONDITIONS.map(condition => ({
      condition,
      score: 0,
      criticalMatches: 0,
      matchingSymptoms: [] as string[]
    }));

    selectedSymptoms.forEach(({ id }) => {
      if (id in SYMPTOM_MAP) {
        CONDITIONS.forEach((condition, idx) => {
          const symptomValue = SYMPTOM_MAP[id][idx];
          if (symptomValue.includes('+')) {
            conditionScores[idx].score += symptomValue === '+++' ? 3 : 1;
            conditionScores[idx].matchingSymptoms.push(id);
          }
        });
      }
    });

    const results = conditionScores
      .map(cs => {
        let matchCategory: Analysis['matchCategory'] = 'Unlikely';
        if (cs.criticalMatches > 0) {
          matchCategory = 'Must Not Miss';
        } else if (cs.score >= selectedSymptoms.length) {
          matchCategory = 'Most Likely';
        } else if (cs.score > 0) {
          matchCategory = 'Possible';
        }

        const conditionInfo = CONDITION_INFO[cs.condition as keyof typeof CONDITION_INFO];

        return {
          condition: cs.condition,
          matchStrength: cs.score + (cs.criticalMatches * 2),
          matchCategory,
          description: cs.criticalMatches > 0 
            ? `Critical match with ${cs.criticalMatches} specific symptom patterns`
            : `Matches ${cs.score} symptoms`,
          matchingSymptoms: cs.matchingSymptoms,
          ...(conditionInfo && {
            selfCare: conditionInfo.selfCare,
            warningSign: conditionInfo.warningSign,
            typicalDuration: conditionInfo.typicalDuration,
            preventionTips: conditionInfo.preventionTips
          })
        };
      })
      .filter(r => r.matchStrength > 0)
      .sort((a, b) => b.matchStrength - a.matchStrength);

    setAnalysis(results);
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#40E0D0]">Diagnostic Lab</h2>
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            {drawerOpen ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Category Navigation */}
        <div className="flex gap-4 mb-6">
          {symptomCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setCurrentCategory(category.id)}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                currentCategory === category.id
                  ? 'bg-[#40E0D0] text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Symptoms Grid */}
        <div className="grid grid-cols-2 gap-4">
          {symptomCategories
            .find(c => c.id === currentCategory)
            ?.symptoms.map(symptom => (
              <button
                key={symptom.id}
                onClick={() => handleSymptomSelect(symptom.id)}
                className={`p-4 rounded-lg text-left ${
                  selectedSymptoms.some(s => s.id === symptom.id)
                    ? 'bg-[#40E0D0] text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <h3 className="font-semibold">{symptom.name}</h3>
                <p className="text-sm opacity-80">{symptom.description}</p>
                <div className={`mt-2 text-sm ${
                  symptom.severity === 'high' ? 'text-red-400' :
                  symptom.severity === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {symptom.severity.toUpperCase()} severity
                </div>
              </button>
            ))}
        </div>

        {selectedSymptoms.length > 0 && (
          <button
            onClick={analyzeSymptoms}
            className="mt-6 px-6 py-3 bg-[#40E0D0] text-white rounded-lg hover:bg-[#40E0D0]/80"
          >
            Analyze Symptoms
          </button>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-6 space-y-4">
            {analysis.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.matchCategory === 'Must Not Miss'
                    ? 'bg-red-500/20 border-l-4 border-red-500'
                    : result.matchCategory === 'Most Likely'
                    ? 'bg-green-500/20 border-l-4 border-green-500'
                    : 'bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{result.condition}</h3>
                  <span className={`text-sm ${
                    result.matchCategory === 'Must Not Miss' ? 'text-red-400' :
                    result.matchCategory === 'Most Likely' ? 'text-green-400' :
                    'text-yellow-400'
                  }`}>
                    {result.matchCategory}
                  </span>
                </div>

                {/* Matching Symptoms */}
                <div className="mt-2">
                  <p className="text-sm font-medium">Matching Symptoms:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {result.matchingSymptoms.map((symptom, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-white/10 rounded">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Self Care */}
                {result.selfCare && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Home size={16} />
                      <span>Self Care</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {result.selfCare.map((tip, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-[#40E0D0]">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warning Signs */}
                {result.warningSign && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-400">
                      <AlertCircle size={16} />
                      <span>Seek Medical Help If:</span>
                    </div>
                    <ul className="mt-1 space-y-1">
                      {result.warningSign.map((sign, i) => (
                        <li key={i} className="text-sm flex items-start gap-2 text-red-400">
                          <span>•</span>
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Duration */}
                {result.typicalDuration && (
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <Thermometer size={16} className="text-[#40E0D0]" />
                    <span>Typical Duration: {result.typicalDuration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Drawer */}
      {drawerOpen && (
        <div className="w-80 bg-white/10 backdrop-blur p-4">
          <h3 className="text-lg font-semibold mb-4">Analysis Guide</h3>
          <div className="space-y-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <h4 className="font-semibold">Symptom Patterns</h4>
              <p className="text-sm mt-1">Combinations of symptoms help identify specific conditions.</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <h4 className="font-semibold">Severity Levels</h4>
              <p className="text-sm mt-1">High severity symptoms are weighted more heavily in analysis.</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <h4 className="font-semibold">Must Not Miss</h4>
              <p className="text-sm mt-1">Critical combinations that require immediate medical attention.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
