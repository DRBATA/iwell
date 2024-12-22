import React from 'react';
import Card from '../components/Card';

interface OpportunityMetrics {
  marketSize: string;
  roi: string;
  impact: string;
  timeline: string;
  source: string;
  ease: "High" | "Moderate" | "Low";
}

interface OpportunityCardProps {
  title: string;
  description: string;
  metrics: OpportunityMetrics;
  whyItMatters?: string;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  description,
  metrics,
  whyItMatters
}) => (
  <Card className="p-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <div className="grid grid-cols-2 gap-4 mb-2">
      <div>
        <div className="text-sm font-medium">Market Size</div>
        <div className="text-lg">{metrics.marketSize}</div>
      </div>
      <div>
        <div className="text-sm font-medium">ROI</div>
        <div className="text-lg">{metrics.impact}</div>
      </div>
      <div>
        <div className="text-sm font-medium">Implementation</div>
        <div className="text-sm text-gray-600">
          {implementationSteps[title] || "System setup • Team training • Process update"}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium">Timeline</div>
        <div className="text-lg">{metrics.timeline}</div>
      </div>
    </div>
    {whyItMatters && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-700">{whyItMatters}</div>
      </div>
    )}
    <div className="text-xs text-gray-500 mt-4">
      Source: {metrics.source}
    </div>
  </Card>
);

const implementationSteps: Record<string, string> = {
  "ADHD Healthcare Optimization": "Write protocols • Train GPs • Track results",
  "PANDAS Early Detection": "Set up tests • Train practice • Monitor cases",
  "Point of Care Testing": "Get equipment in • Train staff • Update ED flow",
  "Integrated Care Contracts": "Draft contracts • Align services • Change process",
  "Antimicrobial Stewardship": "Set guidelines • Train doctors • Track usage",
  "Misdiagnosis Prevention": "Set standards • Train teams • Check impact"
};

export const OpportunityCards: React.FC = () => {
  const opportunities: OpportunityCardProps[] = [
    {
      title: "ADHD Healthcare Optimization",
      description: "Standardized care pathways reducing misdiagnosis and treatment cycles",
      metrics: {
        marketSize: "£290.0B",
        roi: "High",
        impact: "£3,000/yr + 10% redundant GP visits",
        timeline: "6-12 months",
        source: "Cleveland Clinic Journal [4], ADHD Evidence Blog [5]",
        ease: "High" as const
      },
      whyItMatters: "Standardized ADHD pathways can reduce redundant GP visits by 10% and cut treatment costs through better initial diagnosis."
    },
    {
      title: "PANDAS Early Detection",
      description: "Early strep detection preventing costly psychiatric interventions",
      metrics: {
        marketSize: "£180.0B",
        roi: "Moderate",
        impact: "£2,500/child + repeated GP visits",
        timeline: "9-15 months",
        source: "Autism Eye [6], ADHD Australia [9]",
        ease: "Moderate" as const
      },
      whyItMatters: "Early strep detection and treatment prevents escalation to costly psychiatric interventions and reduces long-term care burden."
    },
    {
      title: "Point of Care Testing",
      description: "Rapid testing reducing ED strain and improving decision-making",
      metrics: {
        marketSize: "£515.0B",
        roi: "High",
        impact: "20% ED reduction + £148/patient",
        timeline: "3-6 months",
        source: "BMJ Open Quality [3], MedTek [4]",
        ease: "High" as const
      },
      whyItMatters: "Point of care testing enables immediate clinical decisions, reducing ED admissions and improving resource utilization."
    },
    {
      title: "Integrated Care Contracts",
      description: "Unified care delivery reducing administrative overhead",
      metrics: {
        marketSize: "£380.0B",
        roi: "Moderate",
        impact: "£2,000 overhead + GP efficiency",
        timeline: "12-18 months",
        source: "PMC: Economic Analysis [8]",
        ease: "Moderate" as const
      },
      whyItMatters: "Unified care contracts eliminate duplicate administrative work and streamline patient pathways across services."
    },
    {
      title: "Antimicrobial Stewardship",
      description: "Evidence-based prescribing reducing resistance and costs",
      metrics: {
        marketSize: "£150.0B",
        roi: "High",
        impact: "£2,000 + 10% resistance reduction",
        timeline: "3-9 months",
        source: "PMC: POCT Decision Time [7]",
        ease: "High" as const
      },
      whyItMatters: "Evidence-based prescribing with POCT validation reduces unnecessary broad-spectrum antibiotic use and associated costs."
    },
    {
      title: "Misdiagnosis Prevention",
      description: "Accurate diagnosis preventing ineffective treatment cycles",
      metrics: {
        marketSize: "£220.0B",
        roi: "Moderate",
        impact: "£1,600/case + reduced referrals",
        timeline: "6-12 months",
        source: "PMC: ADHD Misdiagnosis [5]",
        ease: "Moderate" as const
      },
      whyItMatters: "Better diagnostic protocols identify true underlying conditions, preventing costly ineffective treatment cycles."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {opportunities.map((opp, index) => (
        <OpportunityCard key={index} {...opp} />
      ))}
    </div>
  );
};
