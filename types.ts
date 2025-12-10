
export interface ProcessingStep {
  step: number;
  instruction: string;
}

export interface PlantAnalysis {
  name: string;
  scientificName: string;
  confidence: number;
  mlMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  isMedicinal: boolean;
  benefits: string[];
  description: string;
  processingGuide: ProcessingStep[];
  sideEffects: string[];
}

export interface KaggleDatasetInfo {
  title: string;
  url: string;
  description: string;
  imageCount: string;
  classes: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
