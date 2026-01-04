import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { 
    AlertCircle, ArrowLeft, FileText, Lightbulb, 
    MessageSquare, Search, Copy, Check, Target, CheckCircle2, Loader2 
} from "lucide-react";

import { fetchCVAnalysisResultThunk } from "../../api/aiAnalysisApi";
import type { AppDispatch } from "../../redux/store";
import type {AnalysisData} from '../../types/resume'




const AnalysisReport = () => {
    const { resumeId } = useParams<{ resumeId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    // --- حالة محلية لتخزين البيانات بدلاً من Redux Slice ---
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const getReportData = async () => {
            if (!resumeId) return;

            try {
                setLoading(true);
                const result = await dispatch(fetchCVAnalysisResultThunk(resumeId)).unwrap();
                
                setData({
                    atsScore: result.score || result.atsScore || 0,
                    improvedSummary: result.improvedSummary || result.summary || "",
                    feedback: result.feedback || result.summary || "",
                    missingKeywords: result.missingKeywords || []
                });
            } catch (err: any) {
                console.error("Failed to fetch report:", err);
                setError(err.message || "Failed to load report data");
            } finally {
                setLoading(false);
            }
        };

        getReportData();
    }, [dispatch, resumeId]);

    const handleCopy = () => {
        if (data?.improvedSummary) {
            navigator.clipboard.writeText(data.improvedSummary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium tracking-wide">Fetching AI Insights...</p>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Data Missing</h2>
            <p className="text-gray-500 max-w-sm mb-8">{error || "We couldn't find the analysis for this CV."}</p>
            <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100">
                Go Back
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFF] py-8 px-4 sm:px-6 lg:px-10 font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* Navigation */}
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Resumes
                </button>

                {/* --- Section 1: ATS Match Rate (Simplified) --- */}
                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 mb-8 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
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
                                <span className="text-5xl font-black text-gray-900 leading-none">{data.atsScore}%</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Overall Match</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Analysis Overview</h1>
                        <p className="text-gray-400 text-sm mt-1">AI-powered evaluation for your target role</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Analysis Column */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 2. Suggested Summary Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative group">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Optimized Summary</h2>
                                </div>
                                <button 
                                    onClick={handleCopy}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2
                                        ${copied ? 'bg-green-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                                >
                                    {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Summary</>}
                                </button>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 border-l-4 border-l-green-400">
                                <p className="text-gray-700 leading-relaxed font-medium italic text-[15px]">
                                    "{data.improvedSummary}"
                                </p>
                            </div>
                        </div>
                        

                        {/* 4. Missing Keywords Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                                    <Search className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Missing Keywords</h2>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {data.missingKeywords.length > 0 ? (
                                    data.missingKeywords.map((word, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-100 hover:border-orange-200 transition-colors">
                                            {word}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-green-600 text-sm font-medium flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                                        <CheckCircle2 className="w-4 h-4" /> Keyword density is optimal.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Strategic Advice */}
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
                                <Lightbulb className="w-5 h-5 animate-pulse" />
                                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Expert Tip</h3>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                                ATS systems prioritize resumes that mention specific technologies within the first 50% of the document. Keep your key skills high up.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisReport;