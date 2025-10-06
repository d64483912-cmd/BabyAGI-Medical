import { Task } from '../types';
import { MedicalSpecialty, ResearchStudyType, MedicalResearchTemplate, MedicalTaskTemplate } from '../types/medical';

// Medical specialty templates for task generation
export const MEDICAL_TASK_TEMPLATES: Partial<Record<MedicalSpecialty, MedicalTaskTemplate>> = {
  cardiology: {
    category: 'clinical',
    specialty: 'cardiology',
    templates: [
      'Analyze cardiovascular risk factors in patient population',
      'Review latest evidence on heart failure treatments',
      'Investigate arrhythmia patterns and treatment protocols',
      'Assess effectiveness of preventive cardiology interventions'
    ],
    evidenceBasedPrompts: [
      'Based on current ACC/AHA guidelines',
      'Using evidence from major cardiology journals',
      'Following ESC clinical practice guidelines',
      'Incorporating latest clinical trial data'
    ],
    citations: true,
    peerReviewRequirements: ['Board-certified cardiologist review', 'Statistical methodology validation']
  },
  oncology: {
    category: 'research',
    specialty: 'oncology',
    templates: [
      'Systematic review of cancer treatment efficacy',
      'Meta-analysis of immunotherapy outcomes',
      'Clinical trial design for novel cancer therapeutics',
      'Biomarker validation studies for precision oncology'
    ],
    evidenceBasedPrompts: [
      'Following NCCN clinical practice guidelines',
      'Based on ASCO evidence-based recommendations',
      'Using CONSORT guidelines for clinical trials',
      'Incorporating FDA-approved treatment protocols'
    ],
    citations: true,
    peerReviewRequirements: ['Oncology specialist review', 'Biostatistician validation', 'IRB approval']
  },
  neurology: {
    category: 'clinical',
    specialty: 'neurology',
    templates: [
      'Neurological assessment protocols development',
      'Brain imaging analysis for diagnostic accuracy',
      'Neurodegenerative disease progression studies',
      'Cognitive assessment battery validation'
    ],
    evidenceBasedPrompts: [
      'Based on AAN practice guidelines',
      'Following neuroimaging best practices',
      'Using validated neuropsychological assessments',
      'Incorporating latest neuroscience research'
    ],
    citations: true,
    peerReviewRequirements: ['Neurologist specialist review', 'Neuroimaging expert validation']
  },
  psychiatry: {
    category: 'clinical',
    specialty: 'psychiatry',
    templates: [
      'Mental health screening tool validation',
      'Psychopharmacology treatment response analysis',
      'Behavioral intervention effectiveness studies',
      'Psychiatric comorbidity pattern analysis'
    ],
    evidenceBasedPrompts: [
      'Following DSM-5-TR diagnostic criteria',
      'Based on APA practice guidelines',
      'Using evidence-based psychotherapy protocols',
      'Incorporating patient-reported outcome measures'
    ],
    citations: true,
    peerReviewRequirements: ['Psychiatrist specialist review', 'Clinical psychology validation']
  },
  pediatrics: {
    category: 'clinical',
    specialty: 'pediatrics',
    templates: [
      'Pediatric growth and development studies',
      'Childhood vaccination efficacy analysis',
      'Pediatric medication dosing protocols',
      'Child safety and injury prevention research'
    ],
    evidenceBasedPrompts: [
      'Following AAP clinical guidelines',
      'Based on pediatric evidence-based medicine',
      'Using age-appropriate assessment tools',
      'Incorporating parental consent protocols'
    ],
    citations: true,
    peerReviewRequirements: ['Pediatrician specialist review', 'Child development expert validation', 'Ethics committee approval']
  }
};

// Research study templates
export const RESEARCH_STUDY_TEMPLATES: Partial<Record<ResearchStudyType, MedicalResearchTemplate>> = {
  systematic_review: {
    id: 'systematic_review_template',
    name: 'Systematic Review Protocol',
    specialty: 'internal_medicine',
    studyType: 'systematic_review',
    evidenceLevel: 'level_1a',
    description: 'Comprehensive systematic review following PRISMA guidelines',
    objectives: [
      'Define clear research question using PICO framework',
      'Conduct comprehensive literature search across multiple databases',
      'Apply systematic inclusion and exclusion criteria',
      'Assess study quality and risk of bias'
    ],
    methodology: [
      'PRISMA 2020 guidelines compliance',
      'Multiple database search strategy',
      'Independent reviewer selection process',
      'Quality assessment using appropriate tools'
    ],
    expectedOutcomes: [
      'PRISMA flow diagram',
      'Evidence synthesis and meta-analysis if appropriate',
      'Risk of bias assessment',
      'Clinical recommendations based on evidence'
    ],
    ethicalConsiderations: [
      'Protocol registration in PROSPERO',
      'Declaration of conflicts of interest',
      'Transparent reporting of all findings'
    ],
    timeline: [
      'Protocol development: 2-4 weeks',
      'Literature search: 2-3 weeks',
      'Study selection: 3-4 weeks',
      'Data extraction: 4-6 weeks',
      'Analysis and writing: 6-8 weeks'
    ],
    requiredResources: [
      'Access to medical databases',
      'Reference management software',
      'Statistical analysis software',
      'Multiple independent reviewers'
    ],
    statisticalMethods: [
      'Meta-analysis using random-effects model',
      'Heterogeneity assessment (I² statistic)',
      'Subgroup analysis if appropriate',
      'Publication bias assessment'
    ]
  },
  randomized_controlled_trial: {
    id: 'rct_template',
    name: 'Randomized Controlled Trial',
    specialty: 'internal_medicine',
    studyType: 'randomized_controlled_trial',
    evidenceLevel: 'level_1b',
    description: 'Gold standard clinical trial design for intervention effectiveness',
    objectives: [
      'Test efficacy of intervention compared to control',
      'Establish safety profile of intervention',
      'Determine optimal dosing or treatment parameters'
    ],
    methodology: [
      'CONSORT guidelines compliance',
      'Randomization and allocation concealment',
      'Blinding of participants and investigators',
      'Intention-to-treat analysis'
    ],
    expectedOutcomes: [
      'Primary efficacy endpoint achievement',
      'Secondary endpoint analysis',
      'Safety and tolerability profile',
      'Cost-effectiveness analysis'
    ],
    ethicalConsiderations: [
      'IRB/Ethics committee approval',
      'Informed consent procedures',
      'Data safety monitoring board',
      'Trial registration in clinical trials registry'
    ],
    timeline: [
      'Protocol development: 3-6 months',
      'Regulatory approval: 2-4 months',
      'Patient recruitment: 6-18 months',
      'Follow-up period: 6-24 months',
      'Data analysis: 3-6 months'
    ],
    requiredResources: [
      'Clinical research staff',
      'Investigational product supply',
      'Laboratory and imaging capabilities',
      'Electronic data capture system'
    ],
    statisticalMethods: [
      'Sample size calculation with power analysis',
      'Interim analysis planning',
      'Multiple comparison adjustment',
      'Time-to-event analysis if applicable'
    ],
    inclusionCriteria: [
      'Adult patients (≥18 years)',
      'Confirmed diagnosis of target condition',
      'Stable concomitant medications',
      'Ability to provide informed consent'
    ],
    exclusionCriteria: [
      'Pregnancy or nursing',
      'Significant comorbidities',
      'Recent participation in other trials',
      'Contraindications to study intervention'
    ],
    primaryEndpoints: [
      'Primary efficacy measure at study endpoint'
    ],
    secondaryEndpoints: [
      'Quality of life measures',
      'Biomarker changes',
      'Healthcare utilization',
      'Long-term safety outcomes'
    ]
  }
};

export function generateMedicalTasks(
  objective: string,
  specialty?: MedicalSpecialty,
  studyType?: ResearchStudyType
): Task[] {
  const taskId = Date.now();
  const tasks: Task[] = [];

  // If specialty is specified, use specialty-specific templates
  if (specialty && MEDICAL_TASK_TEMPLATES[specialty]) {
    const template = MEDICAL_TASK_TEMPLATES[specialty];
    template.templates.forEach((taskTemplate, index) => {
      tasks.push({
        id: `${taskId + index}`,
        title: `${taskTemplate} - ${objective}`,
        description: `${template.evidenceBasedPrompts[0]} for ${objective}`,
        status: 'pending',
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
        createdAt: new Date(),
        specialty: specialty,
        evidenceLevel: template.category === 'research' ? 'level_1b' : 'level_4'
      });
    });
  }

  // If study type is specified, use research templates
  if (studyType && RESEARCH_STUDY_TEMPLATES[studyType]) {
    const template = RESEARCH_STUDY_TEMPLATES[studyType];
    template.objectives.forEach((objective, index) => {
      tasks.push({
        id: `${taskId + 1000 + index}`,
        title: objective,
        description: `${template.description} - ${objective}`,
        status: 'pending',
        priority: index === 0 ? 'high' : 'medium',
        createdAt: new Date(),
        studyType: studyType,
        evidenceLevel: template.evidenceLevel
      });
    });
  }

  // If no specific specialty or study type, generate general medical research tasks
  if (!specialty && !studyType) {
    const generalTasks = [
      'Conduct comprehensive literature review',
      'Define research methodology and study design',
      'Identify target population and inclusion criteria',
      'Develop data collection protocols',
      'Plan statistical analysis approach',
      'Consider ethical implications and IRB requirements',
      'Prepare study timeline and resource allocation'
    ];

    generalTasks.forEach((task, index) => {
      tasks.push({
        id: `${taskId + 2000 + index}`,
        title: `${task} for ${objective}`,
        description: `Evidence-based approach to ${task.toLowerCase()} related to ${objective}`,
        status: 'pending',
        priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
        createdAt: new Date(),
        evidenceLevel: 'level_4'
      });
    });
  }

  return tasks;
}