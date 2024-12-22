import { MarketSegment } from './types';

export const cannabinoidMarketData: MarketSegment = {
  id: "root",
  name: "Global Market",
  marketSize: "£400B",
  growthRate: "7.5% CAGR",
  keyMetric: "25% YoY Revenue Growth",
  profitMargin: "35%",
  customerAcquisitionCost: "£800",
  lifetimeValue: "£8,000",
  revenuePerEmployee: "£400,000",
  projectedGrowth: [400, 430, 462.2, 496.9, 534.2],
  children: [
    {
      id: "chronic-pain",
      name: "Chronic Pain Management",
      marketSize: "£64B",
      growthRate: "9.5% CAGR",
      keyMetric: "30% Reduction in Opioid Prescriptions",
      profitMargin: "40%",
      customerAcquisitionCost: "£1,600",
      lifetimeValue: "£40,000",
      revenuePerEmployee: "£480,000",
      projectedGrowth: [64, 70.1, 76.8, 84.1, 92.0],
      matrix: {
        rating: {
          marketSize: 4,
          accessibility: 4,
          barriers: 2,
          regulatory: 3
        },
        entryPath: "GP protocol standardization"
      }
    },
    {
      id: "cancer-treatment",
      name: "Cancer Treatment Side Effects",
      marketSize: "£56B",
      growthRate: "8.0% CAGR",
      keyMetric: "£960 Savings per Patient per Year",
      profitMargin: "35%",
      customerAcquisitionCost: "£1,440",
      lifetimeValue: "£36,000",
      revenuePerEmployee: "£440,000",
      projectedGrowth: [56, 60.5, 65.3, 70.5, 76.1],
      matrix: {
        rating: {
          marketSize: 4,
          accessibility: 3,
          barriers: 3,
          regulatory: 4
        },
        entryPath: "Oncology pathway integration"
      }
    },
    {
      id: "anxiety-disorders",
      name: "Anxiety Disorders",
      marketSize: "£48B",
      growthRate: "10.0% CAGR",
      keyMetric: "£720 Savings on Benzodiazepines per Patient",
      profitMargin: "38%",
      customerAcquisitionCost: "£1,200",
      lifetimeValue: "£32,000",
      revenuePerEmployee: "£400,000",
      projectedGrowth: [48, 52.8, 58.1, 63.9, 70.3],
      matrix: {
        rating: {
          marketSize: 3,
          accessibility: 4,
          barriers: 2,
          regulatory: 3
        },
        entryPath: "Primary care pathway alignment"
      }
    },
    {
      id: "ptsd",
      name: "PTSD Management",
      marketSize: "£32B",
      growthRate: "7.0% CAGR",
      keyMetric: "20% Reduction in Psychiatric Medication Use",
      profitMargin: "30%",
      customerAcquisitionCost: "£1,760",
      lifetimeValue: "£28,000",
      revenuePerEmployee: "£320,000",
      projectedGrowth: [32, 34.2, 36.6, 39.2, 41.9],
      matrix: {
        rating: {
          marketSize: 3,
          accessibility: 2,
          barriers: 4,
          regulatory: 4
        },
        entryPath: "Mental health service integration"
      }
    },
    {
      id: "sleep-disorders",
      name: "Sleep Disorders",
      marketSize: "£40B",
      growthRate: "9.0% CAGR",
      keyMetric: "15% Reduction in Prescription Sleep Aid Usage",
      profitMargin: "37%",
      customerAcquisitionCost: "£960",
      lifetimeValue: "£24,000",
      revenuePerEmployee: "£360,000",
      projectedGrowth: [40, 43.6, 47.5, 51.8, 56.5],
      matrix: {
        rating: {
          marketSize: 3,
          accessibility: 3,
          barriers: 3,
          regulatory: 3
        },
        entryPath: "Sleep clinic protocol development"
      }
    },
    {
      id: "fibromyalgia",
      name: "Fibromyalgia",
      marketSize: "£36B",
      growthRate: "8.5% CAGR",
      keyMetric: "10% Reduction in Polypharmacy Costs",
      profitMargin: "36%",
      customerAcquisitionCost: "£1,360",
      lifetimeValue: "£22,400",
      revenuePerEmployee: "£336,000",
      projectedGrowth: [36, 39.1, 42.4, 46.0, 49.9],
      matrix: {
        rating: {
          marketSize: 3,
          accessibility: 2,
          barriers: 4,
          regulatory: 4
        },
        entryPath: "Treatment pathway standardization"
      }
    },
    {
      id: "neuropathic-pain",
      name: "Neuropathic Pain",
      marketSize: "£44B",
      growthRate: "8.7% CAGR",
      keyMetric: "£640 Savings per Patient on Anticonvulsants",
      profitMargin: "34%",
      customerAcquisitionCost: "£1,280",
      lifetimeValue: "£25,600",
      revenuePerEmployee: "£384,000",
      projectedGrowth: [44, 47.8, 52.0, 56.5, 61.4],
      matrix: {
        rating: {
          marketSize: 3,
          accessibility: 3,
          barriers: 3,
          regulatory: 3
        },
        entryPath: "Pain clinic protocol alignment"
      }
    },
    {
      id: "autism",
      name: "Autism Spectrum Disorders",
      marketSize: "£24B",
      growthRate: "7.8% CAGR",
      keyMetric: "£9,600 Reduction in Behavioral Intervention Costs",
      profitMargin: "32%",
      customerAcquisitionCost: "£2,400",
      lifetimeValue: "£40,000",
      revenuePerEmployee: "£240,000",
      projectedGrowth: [24, 25.9, 27.9, 30.1, 32.4],
      matrix: {
        rating: {
          marketSize: 2,
          accessibility: 2,
          barriers: 5,
          regulatory: 5
        },
        entryPath: "Specialist pathway development"
      }
    }
  ]
};
