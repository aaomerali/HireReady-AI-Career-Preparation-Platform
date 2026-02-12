export interface CVFile {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string; 
  targetRole: string;
  score:number;
  createdAt: any;
}


 export interface AnalysisData {
    atsScore: number;
      improvedSummary: string; // Suggested resume summary text
      feedback: string;        // Overall AI feedback
    missingKeywords: string[];
}