import React, { useState } from "react";
import { 
  FileText, 
  CloudUpload, 
  Trash2, 
  Eye, 
  PlusCircle, 
  FileCheck,
  Search,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

// تعريف واجهة البيانات (ستربطها لاحقاً بـ Redux)
interface Resume {
  id: string;
  fileName: string;
  analysisDate: string;
  score: number; // نسبة التوافق مع ATS
  targetRole: string;
}

const AllResumes = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // بيانات تجريبية (Mock Data) للعرض فقط حالياً
  const [resumes] = useState<Resume[]>([
    { id: "1", fileName: "Omar_Software_Eng_CV.pdf", analysisDate: "2026-01-02", score: 85, targetRole: "Frontend Developer" },
    { id: "2", fileName: "My_Resume_V2.pdf", analysisDate: "2025-12-28", score: 72, targetRole: "UI/UX Designer" },
  ]);

  const handleDeleteClick = (id: string) => {
    setSelectedResumeId(id);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume AI Analysis</h1>
            <p className="text-gray-500 mt-1">Check how well your CV matches the job market.</p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md w-full sm:w-auto"
          >
            <CloudUpload className="w-5 h-5" />
            Upload New CV
          </button>
        </div>

        {/* Resumes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium">No CVs analyzed yet.</p>
              <p className="text-sm mt-1">Upload your resume to get instant AI feedback.</p>
            </div>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all flex flex-col group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors text-blue-600">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    resume.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {resume.score}% Match
                  </div>
                </div>

                <h2 className="text-lg font-bold text-gray-900 truncate" title={resume.fileName}>
                  {resume.fileName}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Search className="w-4 h-4" />
                    <span>Target: {resume.targetRole}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{resume.analysisDate}</span>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-3 pt-6 mt-auto border-t border-gray-50">
                  <Link
                    to={`/cv-analysis/report/${resume.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all font-medium text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Report
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(resume.id)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ----------------- UPLOAD MODAL ----------------- */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Resume</h2>
              <p className="text-gray-500 mb-6 text-sm">Our AI will analyze your CV for ATS compatibility and keywords.</p>
              
              <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-10 text-center hover:border-blue-400 transition-colors cursor-pointer group">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <CloudUpload className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-700 font-medium">Click or drag file to upload</p>
                <p className="text-gray-400 text-xs mt-1">PDF, DOCX (Max 5MB)</p>
                <input type="file" className="hidden" />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Role (Optional)</label>
                <input 
                    type="text" 
                    placeholder="e.g. React Developer" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Start Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- CONFIRM DELETE MODAL ----------------- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900">حذف التحليل؟</h2>
            <p className="text-gray-500 text-sm mb-6">سيتم حذف بيانات تحليل هذه السيرة الذاتية بشكل نهائي.</p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 font-medium transition-all shadow-md"
              >
                نعم، حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllResumes;