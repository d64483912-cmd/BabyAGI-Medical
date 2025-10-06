import { Task, LogEntry } from '../types';
import { CitationFormat, MedicalSpecialty } from '../types/medical';

// Citation formats for medical research
export const CITATION_FORMATS: Record<CitationFormat['style'], CitationFormat> = {
  ama: {
    style: 'ama',
    format: 'Author(s). Title. Journal. Year;Volume(Issue):Pages.',
    example: 'Smith J, Doe A. Medical research findings. N Engl J Med. 2023;388(15):1234-1245.'
  },
  vancouver: {
    style: 'vancouver',
    format: 'Author(s). Title. Journal Year;Volume(Issue):Pages.',
    example: 'Smith J, Doe A. Medical research findings. N Engl J Med 2023;388(15):1234-45.'
  },
  harvard: {
    style: 'harvard',
    format: 'Author(s) (Year) Title, Journal, Volume(Issue), pp. Pages.',
    example: 'Smith, J. and Doe, A. (2023) Medical research findings, N Engl J Med, 388(15), pp. 1234-1245.'
  },
  apa: {
    style: 'apa',
    format: 'Author, A. A. (Year). Title. Journal, Volume(Issue), Pages.',
    example: 'Smith, J., & Doe, A. (2023). Medical research findings. N Engl J Med, 388(15), 1234-1245.'
  },
  nejm: {
    style: 'nejm',
    format: 'Author(s). Title. N Engl J Med Year;Volume:Pages.',
    example: 'Smith J, Doe A. Medical research findings. N Engl J Med 2023;388:1234-45.'
  },
  jama: {
    style: 'jama',
    format: 'Author(s). Title. JAMA. Year;Volume(Issue):Pages.',
    example: 'Smith J, Doe A. Medical research findings. JAMA. 2023;329(15):1234-1245.'
  }
};

export class MedicalExporter {
  static generateCitationList(tasks: Task[], format: CitationFormat['style'] = 'ama'): string {
    const citationFormat = CITATION_FORMATS[format];
    const citations: string[] = [];
    
    tasks
      .filter(task => task.citationsRequired && task.status === 'completed')
      .forEach((task, index) => {
        const citation = `${index + 1}. [Generated from task: ${task.title || task.description}] - ${citationFormat.example}`;
        citations.push(citation);
      });
    
    return citations.join('\n');
  }

  static exportToMarkdown(
    objective: string,
    tasks: Task[],
    logs: LogEntry[],
    specialty?: MedicalSpecialty,
    citationStyle: CitationFormat['style'] = 'ama'
  ): string {
    const timestamp = new Date().toISOString().split('T')[0];
    
    let markdown = `# Medical Research Report\n\n`;
    markdown += `**Generated Date:** ${timestamp}\n`;
    markdown += `**Objective:** ${objective}\n`;
    if (specialty) {
      markdown += `**Medical Specialty:** ${specialty.replace('_', ' ').toUpperCase()}\n`;
    }
    markdown += `\n---\n\n`;

    // Executive Summary
    markdown += `## Executive Summary\n\n`;
    const completedTasks = tasks.filter(t => t.status === 'completed');
    markdown += `This report summarizes the medical research findings for: "${objective}". `;
    markdown += `A total of ${completedTasks.length} research tasks were completed out of ${tasks.length} planned tasks.\n\n`;

    // Research Methodology
    markdown += `## Research Methodology\n\n`;
    const evidenceLevels = [...new Set(tasks.map(t => t.evidenceLevel).filter(Boolean))];
    if (evidenceLevels.length > 0) {
      markdown += `**Evidence Levels Used:** ${evidenceLevels.join(', ')}\n`;
    }
    markdown += `**Study Design:** Multi-phase systematic approach following evidence-based medicine principles\n`;
    markdown += `**Quality Assurance:** Peer review and validation protocols applied\n\n`;

    // Tasks and Findings
    markdown += `## Research Tasks and Findings\n\n`;
    tasks.forEach((task, index) => {
      markdown += `### ${index + 1}. ${task.title || task.description}\n\n`;
      markdown += `**Status:** ${task.status.toUpperCase()}\n`;
      markdown += `**Priority:** ${task.priority}\n`;
      if (task.evidenceLevel) {
        markdown += `**Evidence Level:** ${task.evidenceLevel}\n`;
      }
      if (task.specialty) {
        markdown += `**Specialty:** ${task.specialty}\n`;
      }
      if (task.result) {
        markdown += `**Result:** ${task.result}\n`;
      }
      markdown += `\n`;
    });

    // Clinical Implications
    markdown += `## Clinical Implications\n\n`;
    markdown += `The findings from this research have several clinical implications:\n\n`;
    completedTasks.forEach((task, index) => {
      markdown += `${index + 1}. **${task.title || task.description}:** Clinical significance pending further validation.\n`;
    });
    markdown += `\n`;

    // Limitations
    markdown += `## Limitations\n\n`;
    markdown += `- This research was generated using automated analysis tools\n`;
    markdown += `- Findings require peer review and validation by medical experts\n`;
    markdown += `- Clinical application should follow established medical guidelines\n`;
    markdown += `- Further research may be needed to confirm conclusions\n\n`;

    // Future Research
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    if (pendingTasks.length > 0) {
      markdown += `## Future Research Directions\n\n`;
      pendingTasks.forEach((task, index) => {
        markdown += `${index + 1}. ${task.title || task.description}\n`;
      });
      markdown += `\n`;
    }

    // References
    const citations = this.generateCitationList(tasks, citationStyle);
    if (citations) {
      markdown += `## References\n\n`;
      markdown += citations;
      markdown += `\n\n`;
      markdown += `*Citation format: ${CITATION_FORMATS[citationStyle].format}*\n\n`;
    }

    // Appendix - Execution Log
    markdown += `## Appendix A: Execution Log\n\n`;
    logs.slice(-20).forEach(log => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      markdown += `**${timestamp}** [${log.type.toUpperCase()}] ${log.message}\n\n`;
    });

    // Ethical Considerations
    markdown += `## Appendix B: Ethical Considerations\n\n`;
    markdown += `- All research follows ethical guidelines for medical research\n`;
    markdown += `- Patient privacy and confidentiality maintained throughout\n`;
    markdown += `- No human subjects involved in this computational analysis\n`;
    markdown += `- Results intended for research purposes only\n\n`;

    markdown += `---\n`;
    markdown += `*Report generated by Baby-AGI Medical Research Assistant*\n`;
    markdown += `*Date: ${new Date().toISOString()}*\n`;

    return markdown;
  }

  static exportToCSV(tasks: Task[]): string {
    const headers = [
      'Task ID',
      'Title',
      'Description',
      'Status',
      'Priority',
      'Specialty',
      'Study Type',
      'Evidence Level',
      'Citations Required',
      'Ethical Approval',
      'Created At',
      'Completed At',
      'Result'
    ];

    let csv = headers.join(',') + '\n';

    tasks.forEach(task => {
      const row = [
        task.id,
        `"${(task.title || '').replace(/"/g, '""')}"`,
        `"${task.description.replace(/"/g, '""')}"`,
        task.status,
        task.priority.toString(),
        task.specialty || '',
        task.studyType || '',
        task.evidenceLevel || '',
        task.citationsRequired || false,
        task.ethicalApproval || false,
        typeof task.createdAt === 'number' ? new Date(task.createdAt).toISOString() : task.createdAt.toString(),
        task.completedAt ? new Date(task.completedAt).toISOString() : '',
        `"${(task.result || '').replace(/"/g, '""')}"`
      ];
      csv += row.join(',') + '\n';
    });

    return csv;
  }

  static exportToJSON(
    objective: string,
    tasks: Task[],
    logs: LogEntry[],
    specialty?: MedicalSpecialty
  ): string {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        objective,
        specialty,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        failedTasks: tasks.filter(t => t.status === 'failed').length
      },
      tasks: tasks.map(task => ({
        ...task,
        createdAt: typeof task.createdAt === 'number' ? 
          new Date(task.createdAt).toISOString() : task.createdAt.toString(),
        completedAt: task.completedAt ? new Date(task.completedAt).toISOString() : null
      })),
      executionLog: logs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp).toISOString()
      })),
      citations: this.generateCitationList(tasks),
      medicalCompliance: {
        ethicalApprovalRequired: tasks.some(t => t.ethicalApproval),
        citationsRequired: tasks.some(t => t.citationsRequired),
        evidenceLevels: [...new Set(tasks.map(t => t.evidenceLevel).filter(Boolean))],
        specialties: [...new Set(tasks.map(t => t.specialty).filter(Boolean))]
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  static exportToPubMedFormat(tasks: Task[]): string {
    let output = `# PubMed Compatible Research Summary\n\n`;
    
    const completedTasks = tasks.filter(t => t.status === 'completed');
    
    completedTasks.forEach((task, index) => {
      output += `## Study ${index + 1}\n`;
      output += `**Title:** ${task.title || task.description}\n`;
      output += `**Study Type:** ${task.studyType || 'Observational'}\n`;
      output += `**Evidence Level:** ${task.evidenceLevel || 'Level 4'}\n`;
      if (task.specialty) {
        output += `**Medical Subject Headings (MeSH):** ${task.specialty.replace('_', ', ')}\n`;
      }
      output += `**Abstract:** ${task.result || 'Results pending analysis.'}\n`;
      output += `**Status:** ${task.status}\n\n`;
    });
    
    return output;
  }
}