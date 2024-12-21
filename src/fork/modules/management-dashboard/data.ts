import { MarketSegment } from './types';

export const cannabinoidMarketData: MarketSegment = {
  id: "root",
  name: "Global Market",
  marketSize: "£500B",
  growthRate: "8.6% CAGR",
  keyMetric: "8-20% Care Cost Reduction",
  profitMargin: "35%",
  customerAcquisitionCost: "£1,000",
  lifetimeValue: "£10,000",
  revenuePerEmployee: "£500,000",
  projectedGrowth: [500, 537.5, 577.8, 621.1, 667.7],
  children: [
    {
      id: "chronic-pain",
      name: "Chronic Pain Management",
      marketSize: "£80B",
      growthRate: "9.5% CAGR",
      keyMetric: "€148 saved per patient due to reduced waiting times",
      profitMargin: "40%",
      customerAcquisitionCost: "£2,000",
      lifetimeValue: "£50,000",
      revenuePerEmployee: "£600,000",
      projectedGrowth: [80, 87.6, 96.0, 105.1, 115.0],
      matrix: {
        rating: {
          marketSize: 5,
          accessibility: 4,
          barriers: 3,
          regulatory: 4
        },
        costSavings: "£20B/year"
      }
    },
    {
      id: "cancer-treatment",
      name: "Cancer Treatment Side Effects",
      marketSize: "£70B",
      growthRate: "8.0% CAGR",
      keyMetric: "20% reduction in ED admissions through POCT",
      profitMargin: "35%",
      customerAcquisitionCost: "£1,800",
      lifetimeValue: "£45,000",
      revenuePerEmployee: "£550,000",
      projectedGrowth: [70, 75.6, 81.6, 88.1, 95.1],
      matrix: {
        rating: {
          marketSize: 4,
          accessibility: 3,
          barriers: 4,
          regulatory: 3
        },
        costSavings: "£1.2B/year"
      }
    },
    {
      id: "anxiety-disorders",
      name: "Anxiety Disorders",
      marketSize: "£60B",
      growthRate: "10.0% CAGR",
      keyMetric: "€7,700 lower personal costs with proper diagnosis",
      profitMargin: "38%",
      customerAcquisitionCost: "£1,500",
      lifetimeValue: "£40,000",
      revenuePerEmployee: "£500,000",
      projectedGrowth: [60, 66.0, 72.6, 79.9, 87.9],
      matrix: {
        rating: {
          marketSize: 4,
          accessibility: 3,
          barriers: 2,
          regulatory: 2
        },
        costSavings: "£900M/year"
      }
    },
    {
      id: "neuropathic-pain",
      name: "Neuropathic Pain",
      marketSize: "£55B",
      growthRate: "8.7% CAGR",
      keyMetric: "1 in 200 children affected - $2,500 saved per child",
      profitMargin: "34%",
      customerAcquisitionCost: "£1,700",
      lifetimeValue: "£38,000",
      revenuePerEmployee: "£480,000",
      projectedGrowth: [55, 59.8, 65.0, 70.7, 76.8],
      matrix: {
        rating: {
          marketSize: 3,
          accessibility: 2,
          barriers: 4,
          regulatory: 3
        },
        costSavings: "£800M/year"
      }
    },
    {
      id: "sleep-disorders",
      name: "Sleep Disorders",
      marketSize: "£50B",
      growthRate: "9.0% CAGR",
      keyMetric: "£29 savings per 100 patients using POCT",
      profitMargin: "37%",
      customerAcquisitionCost: "£1,200",
      lifetimeValue: "£30,000",
      revenuePerEmployee: "£450,000",
      projectedGrowth: [50, 54.5, 59.4, 64.7, 70.6],
      matrix: {
        rating: {
          marketSize: 3,
          accessibility: 4,
          barriers: 2,
          regulatory: 2
        },
        costSavings: "£600M/year"
      }
    },
    {
      id: "fibromyalgia",
      name: "Fibromyalgia",
      marketSize: "£45B",
      growthRate: "8.5% CAGR",
      keyMetric: "10% Reduction in Polypharmacy Costs",
      profitMargin: "36%",
      customerAcquisitionCost: "£1,900",
      lifetimeValue: "£35,000",
      revenuePerEmployee: "£470,000",
      projectedGrowth: [45, 48.8, 53.0, 57.5, 62.4],
      matrix: {
        rating: {
          marketSize: 3,
          accessibility: 2,
          barriers: 3,
          regulatory: 3
        },
        costSavings: "£500M/year"
      }
    },
    {
      id: "ptsd",
      name: "PTSD Management",
      marketSize: "£40B",
      growthRate: "7.0% CAGR",
      keyMetric: "20% Reduction in Psychiatric Medication Use",
      profitMargin: "30%",
      customerAcquisitionCost: "£2,200",
      lifetimeValue: "£35,000",
      revenuePerEmployee: "£400,000",
      projectedGrowth: [40, 42.8, 45.8, 49.0, 52.4],
      matrix: {
        rating: {
          marketSize: 2,
          accessibility: 2,
          barriers: 4,
          regulatory: 3
        },
        costSavings: "£600M/year"
      }
    },
    {
      id: "autism",
      name: "Autism Spectrum Disorders",
      marketSize: "£30B",
      growthRate: "7.8% CAGR",
      keyMetric: "25% Improvement in Sleep Quality Metrics",
      profitMargin: "32%",
      customerAcquisitionCost: "£2,500",
      lifetimeValue: "£42,000",
      revenuePerEmployee: "£420,000",
      projectedGrowth: [30, 32.3, 34.8, 37.5, 40.4],
      matrix: {
        rating: {
          marketSize: 2,
          accessibility: 1,
          barriers: 5,
          regulatory: 4
        },
        costSavings: "£400M/year"
      }
    },
    {
      id: "diagnostic-tech",
      name: "Diagnostic Technologies",
      marketSize: "£85B",
      growthRate: "11.2% CAGR",
      keyMetric: "8-20% Total Care Cost Reduction via POCT",
      profitMargin: "42%",
      customerAcquisitionCost: "£1,800",
      lifetimeValue: "£55,000",
      revenuePerEmployee: "£650,000",
      projectedGrowth: [85, 94.5, 105.1, 116.9, 130.0],
      matrix: {
        rating: {
          marketSize: 5,
          accessibility: 4,
          barriers: 2,
          regulatory: 3
        },
        costSavings: "$143-266B Annual ADHD Economic Burden"
      }
    }
  ]
};
