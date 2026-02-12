// Expected data interface returned by the AI
export interface AIAnalysisResult {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
}

export const analyzeResumeWithAI = async (_text: string, targetRole: string): Promise<AIAnalysisResult> => {
    console.log("🤖 AI is processing the text for role:", targetRole);

    // Simulate network delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In the next phase we'll replace this with a real Gemini API request
    return {
        score: Math.floor(Math.random() * 41) + 55, // Random score between 55 and 95
        summary: "The resume shows strong technical foundations but needs better keyword optimization for the target role.",
        strengths: ["Clear layout", "Strong technical stack", "Relevant project experience"],
        improvements: ["Add more quantifiable achievements", "Improve the professional summary section"],
        missingKeywords: ["Docker", "CI/CD Pipelines", "Unit Testing", "System Design"]
    };
};