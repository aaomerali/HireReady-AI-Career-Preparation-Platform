import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    AlertCircle, ArrowLeft, FileText, Lightbulb, 
    MessageSquare, Search, Copy, Check, Target, CheckCircle2 
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

// --- واجهة البيانات ---
interface AnalysisData {
    atsScore: number;
    improvedSummary: string; // نص السيرة الذاتية المقترح
    feedback: string;        // تقييم الـ AI العام
    missingKeywords: string[];
}

const AnalysisReport = () => {
    const { resumeId } = useParams<{ resumeId: string }>();
    const navigate = useNavigate();
    
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // --- جلب البيانات من Firestore ---
    useEffect(() => {
        const fetchReport = async () => {
            if (!resumeId) {
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, "cv_results"), 
                    where("resumeId", "==", resumeId)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data() as AnalysisData;
                    setData(docData);
                }
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [resumeId]);

    const handleCopy = () => {
        if (data?.improvedSummary) {
            navigator.clipboard.writeText(data.improvedSummary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Generating Report View...</p>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-500 mb-8">We couldn't retrieve the analysis for this specific CV.</p>
            <button onClick={() => navigate(-1)} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold">
                Return to Dashboard
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FBFF] py-8 px-4 sm:px-6 lg:px-10">
            <div className="max-w-5xl mx-auto">
                
                {/* Back Link */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Resumes
                </button>

                {/* --- Hero Section: Score Only --- */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-40"></div>
                    
                    <div className="flex flex-col items-center justify-center relative z-10 text-center">
                        <div className="relative w-44 h-44 flex items-center justify-center mb-6">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="88" cy="88" r="78" stroke="#F1F5F9" strokeWidth="14" fill="transparent" />
                                <circle 
                                    cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="14" fill="transparent" 
                                    strokeDasharray={490}
                                    strokeDashoffset={490 - (490 * data.atsScore) / 100}
                                    strokeLinecap="round"
                                    className={`${data.atsScore >= 80 ? 'text-green-500' : 'text-orange-500'} transition-all duration-1000`}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-5xl font-black text-gray-900 tracking-tight">{data.atsScore}%</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">ATS Score</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Analysis Overview</h1>
                        <p className="text-gray-400 text-sm mt-1">Overall compatibility with your target position</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Improved Summary Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Suggested Summary</h2>
                                </div>
                                <button 
                                    onClick={handleCopy}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2
                                        ${copied ? 'bg-green-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                >
                                    {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Text</>}
                                </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed font-medium bg-gray-50/50 p-6 rounded-2xl border border-gray-100 italic">
                                "{data.improvedSummary}"
                            </p>
                        </div>

                        {/* 2. AI Detailed Feedback Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Expert Feedback</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {data.feedback}
                            </p>
                        </div>

                        {/* 3. Keywords Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                                    <Search className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Missing Keywords</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.missingKeywords.length > 0 ? (
                                    data.missingKeywords.map((word, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-100">
                                            {word}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-green-600 text-sm font-medium flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Perfect keyword optimization.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Next Steps */}
                    <div className="space-y-8">
                        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5" /> Next Steps
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-indigo-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                                    Use the suggested summary to improve your CV header.
                                </li>
                                <li className="flex gap-3 text-sm text-indigo-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                                    Integrate the missing keywords into your skills section.
                                </li>
                                <li className="flex gap-3 text-sm text-indigo-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                                    Aim for a score above 85% for better ATS ranking.
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4 text-orange-500">
                                <Lightbulb className="w-5 h-5" />
                                <h3 className="font-bold text-gray-900">Quick Tip</h3>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Resumes with a professional summary tailored to the job description have a 40% higher chance of being read by recruiters.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisReport;