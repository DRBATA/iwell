export interface MarketRating {
  marketSize: number;
  accessibility: number;
  barriers: number;
  regulatory: number;
}

export interface MarketMatrix {
  rating: MarketRating;
  costSavings: string;
}

export interface MarketSegment {
  id: string;
  name: string;
  marketSize: string;
  growthRate: string;
  keyMetric: string;
  profitMargin: string;
  customerAcquisitionCost: string;
  lifetimeValue: string;
  revenuePerEmployee: string;
  projectedGrowth: number[];
  matrix?: MarketMatrix;
  children?: MarketSegment[];
}
