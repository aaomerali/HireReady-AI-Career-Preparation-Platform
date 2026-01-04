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
    improvedSummary: string; // نص السيرة الذاتية المقترح
    feedback: string;        // تقييم الـ AI العام
    missingKeywords: string[];
}