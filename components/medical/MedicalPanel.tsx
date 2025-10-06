'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useAgentStore } from '@/lib/stores/agentStore';
import { MedicalSpecialty, ResearchStudyType } from '@/lib/types/medical';
import type { Task } from '@/lib/types';
import { Download, FileText, Database, FileDown, Stethoscope, FlaskConical } from 'lucide-react';

const MEDICAL_SPECIALTIES: Record<MedicalSpecialty, string> = {
  cardiology: 'Cardiology',
  oncology: 'Oncology',
  neurology: 'Neurology',
  psychiatry: 'Psychiatry',
  pediatrics: 'Pediatrics',
  surgery: 'Surgery',
  radiology: 'Radiology',
  pathology: 'Pathology',
  emergency_medicine: 'Emergency Medicine',
  internal_medicine: 'Internal Medicine',
  infectious_disease: 'Infectious Disease',
  endocrinology: 'Endocrinology',
  pulmonology: 'Pulmonology',
  nephrology: 'Nephrology',
  gastroenterology: 'Gastroenterology',
  dermatology: 'Dermatology',
  ophthalmology: 'Ophthalmology',
  orthopedics: 'Orthopedics',
  anesthesiology: 'Anesthesiology',
  public_health: 'Public Health'
};

const STUDY_TYPES: Record<ResearchStudyType, string> = {
  systematic_review: 'Systematic Review',
  meta_analysis: 'Meta-Analysis',
  randomized_controlled_trial: 'Randomized Controlled Trial',
  cohort_study: 'Cohort Study',
  case_control_study: 'Case-Control Study',
  cross_sectional_study: 'Cross-Sectional Study',
  case_report: 'Case Report',
  case_series: 'Case Series',
  clinical_guideline: 'Clinical Guideline',
  literature_review: 'Literature Review',
  experimental_study: 'Experimental Study',
  observational_study: 'Observational Study'
};

export function MedicalPanel() {
  const { 
    objective, 
    medicalMode, 
    currentSpecialty, 
    currentStudyType,
    generateMedicalTasks, 
    exportMedicalReport, 
    setMedicalMode,
    tasks
  } = useAgentStore();

  const [selectedSpecialty, setSelectedSpecialty] = useState<MedicalSpecialty | undefined>(currentSpecialty as MedicalSpecialty);
  const [selectedStudyType, setSelectedStudyType] = useState<ResearchStudyType | undefined>(currentStudyType as ResearchStudyType);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerateMedicalTasks = () => {
    if (objective) {
      generateMedicalTasks(objective, selectedSpecialty, selectedStudyType);
    }
  };

  const handleExportReport = (format: 'markdown' | 'json' | 'csv' | 'pubmed') => {
    const report = exportMedicalReport(format, selectedSpecialty);
    const blob = new Blob([report], { 
      type: format === 'json' ? 'application/json' : 
            format === 'csv' ? 'text/csv' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-research-report.${format === 'pubmed' ? 'txt' : format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedTasks = tasks.filter((t: Task) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const medicalTasks = tasks.filter((t: Task) => t.specialty || t.studyType).length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Medical Research</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        {/* Medical Mode Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Medical Mode</Label>
          <Button
            variant={medicalMode ? "default" : "outline"}
            size="sm"
            onClick={() => setMedicalMode(!medicalMode)}
            className="h-7 text-xs px-2"
          >
            <FlaskConical className="h-3 w-3 mr-1" />
            {medicalMode ? 'On' : 'Off'}
          </Button>
        </div>

        {isExpanded && (
          <>
            <Separator className="my-2" />

        {/* Research Configuration */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Research Configuration</h3>
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Medical Specialty</Label>
              <Select value={selectedSpecialty} onValueChange={(value) => setSelectedSpecialty(value as MedicalSpecialty)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select specialty..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MEDICAL_SPECIALTIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Study Type</Label>
              <Select value={selectedStudyType} onValueChange={(value) => setSelectedStudyType(value as ResearchStudyType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select study type..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STUDY_TYPES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateMedicalTasks}
            disabled={!objective}
            className="w-full"
          >
            Generate Medical Research Tasks
          </Button>
        </div>

        <Separator />

        {/* Research Status */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Research Status</h3>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Total Tasks</div>
              <div className="font-semibold">{totalTasks}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Completed</div>
              <div className="font-semibold text-green-600">{completedTasks}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Medical Tasks</div>
              <div className="font-semibold text-blue-600">{medicalTasks}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Progress</div>
              <div className="font-semibold">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </div>
            </div>
          </div>

          {currentSpecialty && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {MEDICAL_SPECIALTIES[currentSpecialty as MedicalSpecialty]}
              </Badge>
              {currentStudyType && (
                <Badge variant="outline">
                  {STUDY_TYPES[currentStudyType as ResearchStudyType]}
                </Badge>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Export Options */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Export Medical Report</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('markdown')}
              disabled={totalTasks === 0}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Markdown
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('json')}
              disabled={totalTasks === 0}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              JSON
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('csv')}
              disabled={totalTasks === 0}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('pubmed')}
              disabled={totalTasks === 0}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PubMed
            </Button>
          </div>
        </div>

            {medicalMode && (
              <>
                <Separator />
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>🏥 Medical research mode active</div>
                  <div>📊 Evidence-based task generation</div>
                  <div>📋 Clinical guideline compliance</div>
                  <div>🔬 Peer review requirements</div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}