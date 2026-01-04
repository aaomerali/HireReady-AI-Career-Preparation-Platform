import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    FileText, CloudUpload, Trash2, Eye, Search, Calendar, Loader2
} from "lucide-react";

// --- Imports from your existing files ---
import { fetchCVFiles, uploadCVMetadata, deleteCVFile } from "../../api/cvAnalysisApi";
import { generateCVAnalysisThunk, saveCVAnalysisResultThunk } from "../../api/aiAnalysisApi";
import { extractTextFromPDF } from '../../utils/pdfExtractor';
import type { AppDispatch, RootState } from "../../redux/store";
import type { CVFile } from "@/types/resume";

const AllResumes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // 1. Get real data from Redux
    const { files, loading: filesLoading } = useSelector((state: RootState) => state.resume);
    const { user } = useSelector((state: RootState) => state.auth);

    // --- UI State ---
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [targetRole, setTargetRole] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 2. Fetch files on component mount
    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchCVFiles(user.uid));
        }
    }, [dispatch, user]);

    // --- The Main Analysis Logic ---
    const handleStartAnalysis = async () => {
        if (!selectedFile || !user) return;

        try {
            setIsProcessing(true);

            // STEP 1: Extract Text locally
            console.log("📄 Extracting text locally from PDF...");
            const resumeText = await extractTextFromPDF(selectedFile);

            // STEP 2: Run Gemini Analysis
            console.log("🤖 Sending text to Gemini AI...");
            const aiResult = await dispatch(generateCVAnalysisThunk({
                resumeText,
                targetRole: targetRole || "General Position"
            })).unwrap();

            console.log("✅ Gemini Analysis Complete:", aiResult);

            // STEP 3: Save Metadata to Firestore
            const metadataAction = await dispatch(uploadCVMetadata({
                userId: user.uid,
                fileName: selectedFile.name,
                fileUrl: "",
                targetRole: targetRole || "General Position",
                score: aiResult.score || aiResult.atsScore || 0
            })).unwrap();

            // STEP 4: Save Detailed Analysis Results
            await dispatch(saveCVAnalysisResultThunk({
                resumeId: metadataAction.id,
                userId: user.uid,
                atsScore: aiResult.score || aiResult.atsScore,
                feedback: aiResult.feedback || aiResult.summary,
                missingKeywords: aiResult.missingKeywords,
                improvedSummary: aiResult.improvedSummary || aiResult.summary
            })).unwrap();

            // Cleanup
            setShowUploadModal(false);
            setSelectedFile(null);
            setTargetRole("");

            // Success: Navigate to the new report automatically
            alert("Resume Analysis Report Created Successfully")

        } catch (error) {
            console.error("🛑 Critical Workflow Error:", error);
            alert("Something went wrong during the analysis process.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this analysis?")) {
            dispatch(deleteCVFile(id));
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-10 bg-gray-50/30">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Resumes</h1>
                    </div>

                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                        <CloudUpload className="w-5 h-5" />
                        Analyze New CV
                    </button>
                </div>

                {/* Data Grid Section */}
                {filesLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mb-4" />
                        <p className="text-gray-500 animate-pulse">Loading your reports...</p>
                    </div>
                ) : (
                    <>
                        {files.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center max-w-4xl mx-auto">
                                <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <FileText className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">No Reports Yet</h2>
                                <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                                    Upload a CV to generate an AI analysis. Files are processed locally and only text results are saved.
                                </p>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                                >
                                    <CloudUpload className="w-5 h-5" />
                                    Analyze Your First CV
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {files.map((file: CVFile) => (
                                    <div key={file.id} className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                {file.score || 0}% Match
                                            </div>
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 truncate">{file.fileName}</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                            <Search className="w-4 h-4" />
                                            <span className="truncate">Target: {file.targetRole || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                            <Calendar className="w-4 h-4" />
                                            <span dir="rtl">
                                                {file.createdAt?.toDate ?
                                                    file.createdAt.toDate().toLocaleDateString() :
                                                    new Date(file.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-50">
                                            <button
                                                onClick={() => navigate(`/resume/report/${file.id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-semibold text-sm"
                                            >
                                                <Eye className="w-4 h-4" /> View Report
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file.id)}
                                                className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyze New Resume</h2>
                            <p className="text-gray-500 text-sm mb-6">Our AI will evaluate your CV for ATS compatibility and keyword relevance.</p>

                            {/* File Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
                        ${selectedFile ? 'border-green-400 bg-green-50/30' : 'border-gray-200 hover:border-indigo-300'}`}
                            >
                                <CloudUpload className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                                <p className="text-gray-900 font-semibold">{selectedFile ? selectedFile.name : "Choose PDF File"}</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </div>

                            {/* --- NEW: Detailed File Requirements Section --- */}
                            <div className="mt-6 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Upload Guidelines</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                        <span className="text-xs text-slate-600 font-medium">Format: PDF only</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                        <span className="text-xs text-slate-600 font-medium">Max Size: 5MB</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                        <span className="text-xs text-slate-600 font-medium">Language: English</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                        <span className="text-xs text-slate-600 font-medium">Text-based (No scans)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Target Role Input */}
                            <div className="mt-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Job Role</label>
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g. Frontend Developer"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/80 px-8 py-5 flex gap-3 border-t border-gray-100">
                            <button
                                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                                className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStartAnalysis}
                                disabled={!selectedFile || isProcessing}
                                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Start Analysis"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllResumes;