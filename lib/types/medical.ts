export type MedicalSpecialty = 
  | 'cardiology'
  | 'oncology' 
  | 'neurology'
  | 'psychiatry'
  | 'pediatrics'
  | 'surgery'
  | 'radiology'
  | 'pathology'
  | 'emergency_medicine'
  | 'internal_medicine'
  | 'infectious_disease'
  | 'endocrinology'
  | 'pulmonology'
  | 'nephrology'
  | 'gastroenterology'
  | 'dermatology'
  | 'ophthalmology'
  | 'orthopedics'
  | 'anesthesiology'
  | 'public_health';

export type ResearchStudyType = 
  | 'systematic_review'
  | 'meta_analysis'
  | 'randomized_controlled_trial'
  | 'cohort_study'
  | 'case_control_study'
  | 'cross_sectional_study'
  | 'case_report'
  | 'case_series'
  | 'clinical_guideline'
  | 'literature_review'
  | 'experimental_study'
  | 'observational_study';

export type EvidenceLevel = 
  | 'level_1a' // Systematic review of RCTs
  | 'level_1b' // Individual RCT
  | 'level_2a' // Systematic review of cohort studies
  | 'level_2b' // Individual cohort study
  | 'level_3a' // Systematic review of case-control studies
  | 'level_3b' // Individual case-control study
  | 'level_4'  // Case series
  | 'level_5'; // Expert opinion

export interface MedicalResearchTemplate {
  id: string;
  name: string;
  specialty: MedicalSpecialty;
  studyType: ResearchStudyType;
  evidenceLevel?: EvidenceLevel;
  description: string;
  objectives: string[];
  methodology: string[];
  expectedOutcomes: string[];
  ethicalConsiderations: string[];
  timeline: string[];
  requiredResources: string[];
  statisticalMethods: string[];
  inclusionCriteria?: string[];
  exclusionCriteria?: string[];
  primaryEndpoints?: string[];
  secondaryEndpoints?: string[];
}

export interface MedicalTaskTemplate {
  category: 'research' | 'clinical' | 'analysis' | 'review' | 'methodology';
  specialty: MedicalSpecialty;
  templates: string[];
  evidenceBasedPrompts: string[];
  citations: boolean;
  peerReviewRequirements: string[];
}

export interface CitationFormat {
  style: 'ama' | 'vancouver' | 'harvard' | 'apa' | 'nejm' | 'jama';
  format: string;
  example: string;
}

export interface MedicalExportFormat {
  format: 'json' | 'csv' | 'pdf' | 'markdown' | 'docx' | 'latex';
  templateType: 'research_paper' | 'case_report' | 'systematic_review' | 'clinical_guideline';
  includeReferences: boolean;
  includeFigures: boolean;
  includeStatistics: boolean;
}

export interface EthicalConsideration {
  type: 'irb_approval' | 'informed_consent' | 'data_privacy' | 'vulnerable_populations' | 'conflict_of_interest';
  description: string;
  requirements: string[];
  documentation: string[];
}

export interface ClinicalTrial {
  phase: 'preclinical' | 'phase_1' | 'phase_2' | 'phase_3' | 'phase_4';
  primaryObjective: string;
  secondaryObjectives: string[];
  inclusion: string[];
  exclusion: string[];
  sampleSize: number;
  statisticalPower: number;
  primaryEndpoint: string;
  secondaryEndpoints: string[];
  safetyConcerns: string[];
  regulatoryRequirements: string[];
}