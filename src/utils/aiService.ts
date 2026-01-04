// واجهة البيانات المتوقعة من الذكاء الاصطناعي
export interface AIAnalysisResult {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
}

export const analyzeResumeWithAI = async (text: string, targetRole: string): Promise<AIAnalysisResult> => {
    console.log("🤖 AI is processing the text for role:", targetRole);

    // محاكاة تأخير الشبكة (2 ثانية)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // في المرحلة القادمة، سنستبدل هذا الجزء بطلب حقيقي لـ Gemini API
    return {
        score: Math.floor(Math.random() * 41) + 55, // درجة عشوائية بين 55 و 95
        summary: "The resume shows strong technical foundations but needs better keyword optimization for the target role.",
        strengths: ["Clear layout", "Strong technical stack", "Relevant project experience"],
        improvements: ["Add more quantifiable achievements", "Improve the professional summary section"],
        missingKeywords: ["Docker", "CI/CD Pipelines", "Unit Testing", "System Design"]
    };
};