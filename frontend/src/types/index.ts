export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  org: string;
  message: string;
}

export interface ProblemItem {
  num: string;
  title: string;
  description: string;
}

export interface FeatureItem {
  glyph: string;
  title: string;
  description: string;
}

export interface BenefitItem {
  glyph: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface TrackingStep {
  step: number;
  title: string;
  description: string;
  done: boolean;
}

export interface AudienceItem {
  glyph: string;
  title: string;
  description: string;
}

export interface GetStartedStep {
  step: number;
  title: string;
  description: string;
}

export interface StatItem {
  num: string;
  label: string;
}
