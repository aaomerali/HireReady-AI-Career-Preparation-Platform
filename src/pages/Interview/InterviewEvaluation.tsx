// pages/EvaluationPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";

// API Actions
import { fetchInterviewById } from "../../api/interviewsApi";
import { fetchUserAnswers } from "../../api/interviewAnswersApi";

// Icons
import { 
  Star, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Lightbulb,
  BookOpen
} from "lucide-react";

import {type UserAnswerData} from '../../types/interview'

const EvaluationPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const currentUserId = useSelector((state: RootState) => state.auth.user?.uid);

  const [interviewData, setInterviewData] = useState<any>(null);
  const [answers, setAnswers] = useState<UserAnswerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvaluationData = async () => {
      if (!interviewId || !currentUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedInterview = await dispatch(fetchInterviewById(interviewId)).unwrap();
        if (!fetchedInterview) {
          setError("Interview not found.");
          setLoading(false);
          return;
        }

        const fetchedAnswersResult = await dispatch(fetchUserAnswers({
            mockIdRef: interviewId,
            userId: currentUserId,
            allQuestions: fetchedInterview.questions 
        })).unwrap();
        
        const rawAnswers = fetchedAnswersResult.answers || [];
        // التعديل 2: عكس ترتيب عرض الإجابات
        const sortedAnswers = (rawAnswers as unknown as UserAnswerData[]).sort(
          (a, b) => (a.questionIndex || 0) - (b.questionIndex || 0) 
        );

        setInterviewData(fetchedInterview);
        setAnswers(sortedAnswers);

      } catch (err) {
        console.error("Error fetching evaluation:", err);
        setError("Failed to load evaluation data.");
      } finally {
        setLoading(false);
      }
    };

    loadEvaluationData();
  }, [interviewId, currentUserId, dispatch]);

  // --- Logic Helpers ---

  // التعديل 1: حساب الدرجة النهائية من 10 (المتوسط)
  const calculateOverallScore = () => {
    if (answers.length === 0) return 0;
    
    // جمع التقييمات (التي هي من 1 إلى 10)
    const totalRating = answers.reduce((acc, curr) => acc + curr.rating, 0);
    
    // حساب المتوسط
    const averageRating = totalRating / answers.length; 
    return parseFloat(averageRating.toFixed(1)); // النتيجة برقم عشري واحد بين 0.0 و 10.0
  };

  const isInterviewComplete = () => {
    if (!interviewData || !answers) return false;
    return answers.length === interviewData.questions.length;
  };

  // --- Render States ---

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !interviewData) {
     return (
        <div className="max-w-3xl mx-auto mt-10 p-8 text-center bg-white shadow rounded-lg">
           <XCircle className="mx-auto text-red-500 mb-4" size={48} />
           <h2 className="text-2xl font-bold text-gray-800">Error Loading Evaluation</h2>
           <p className="text-gray-600 mt-2">{error || "Could not retrieve interview data."}</p>
           <button 
             onClick={() => navigate('/interview')}
             className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
           >
             Go Home
           </button>
        </div>
     );
  }

  if (!isInterviewComplete()) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 text-center bg-white shadow-lg rounded-xl border border-yellow-200">
         <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={56} />
         <h2 className="text-2xl font-bold text-gray-800">Evaluation Not Ready</h2>
         <p className="text-gray-500 mt-1">
           Please complete the entire interview to generate your personalized AI evaluation report.
         </p>
         <button 
           onClick={() => navigate(`/interview/start/${interviewId}`)}
           className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md transition-transform transform hover:-translate-y-1"
         >
           Continue Interview
         </button>
      </div>
    );
  }

  // --- Main Evaluation View (Complete) ---
  const overallScore = calculateOverallScore();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      
      {/* Header & Overall Score */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
         <div>
            <h1 className="text-3xl font-bold text-gray-800">{interviewData.position} <span className="text-indigo-600">interview Report</span></h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500"/> 
              Interview Completed on {new Date().toLocaleDateString()}
            </p>
         </div>

         <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg border border-indigo-100 min-w-[150px]">
            <span className="text-sm font-semibold text-indigo-800 uppercase tracking-wider">Overall Score</span>
            <div className="flex items-center gap-2 mt-1">
               {/* التعديل 1: شروط الألوان بناءً على 10 */}
               <span className={`text-4xl font-extrabold ${overallScore >= 7 ? 'text-green-600' : overallScore >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                 {overallScore.toFixed(1)} {/* عرض رقم عشري واحد */}
               </span>
               {/* التعديل 1: العرض من 10 */}
               <span className="text-gray-400 text-xl">/ 10</span>
            </div>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  // التعديل 1: معادلة النجوم (الدرجة * 0.5) لتحويل الـ 10 إلى 5 نجوم
                  className={`${star <= Math.round(overallScore * 0.5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                />
              ))}
            </div>
         </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => navigate('/interview')} className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium transition">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      {/* Questions Breakdown */}
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Detailed Question Analysis</h3>
      
      <div className="space-y-6">
        {answers.map((ans, index) => {
          // التعديل 1: درجة السؤال الفردي تبقى كما هي (من 10)
          const questionScore = ans.rating; 

          return (
            <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {/* Question Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">Question {index + 1}</span>
                  <h4 className="text-lg font-semibold text-gray-800 mt-1">{ans.question}</h4>
                </div>
                {/* التعديل 1: شروط الألوان للسؤال الفردي بناءً على 10 */}
                <div className={`px-3 py-1 rounded-full text-sm font-bold border ${
                   questionScore >= 7 ? 'bg-green-100 text-green-700 border-green-200' :
                   questionScore >= 4 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                   'bg-red-100 text-red-700 border-red-200'
                }`}>
                  {questionScore}/10
                </div>
              </div>

              <div className="p-5 space-y-5">
                
                {/* User Answer Section */}
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                     Your Answer
                  </h5>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-700 italic border border-gray-100">
                    "{ans.user_ans}"
                  </div>
                </div>

                {/* AI Feedback Section */}
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold text-blue-600 flex items-center gap-2">
                     <Lightbulb size={16} /> AI Feedback
                  </h5>
                  <div className="p-4 bg-blue-50 rounded-lg text-gray-800 text-sm leading-relaxed border border-blue-100">
                    {ans.feedback}
                  </div>
                </div>

                {/* Model Answer */}
                <div className="pt-4 border-t border-gray-100">
                  <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-indigo-600 font-medium text-sm list-none select-none">
                       <BookOpen size={16} />
                       <span>Show Model Answer</span>
                       <span className="transition group-open:rotate-180">
                         <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                       </span>
                    </summary>
                    <div className="mt-3 p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-100">
                      <strong>Model Answer: </strong> {ans.correct_ans}
                    </div>
                  </details>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default EvaluationPage;