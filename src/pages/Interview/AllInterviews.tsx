import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchInterviews, deleteInterview } from "../../api/interviewsApi";
import { Link } from "react-router-dom";

import {
  PlayCircle,
  Pencil,
  Trash2,
  MessageCircle,
  PlusCircle,
} from "lucide-react";

const Allinterviews = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { interviews, loading } = useSelector(
    (state: RootState) => state.interview
  );

  const currentUserId = useSelector((state: RootState) => state.auth.user?.uid);



  const [showConfirm, setShowConfirm] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setInterviewToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (interviewToDelete) {
      dispatch(deleteInterview(interviewToDelete));
    }
    setShowConfirm(false);
    setInterviewToDelete(null);
  };

  useEffect(() => {
    if (currentUserId) { 
      dispatch(fetchInterviews(currentUserId));
    }
  }, [dispatch, currentUserId]);


  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Interviews
          </h1>

          <Link
            to="/interview/create"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md w-full sm:w-auto"
          >
            <PlusCircle className="w-5 h-5" />
            Add Interview
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.length === 0 && (
            <div className="col-span-full text-center text-gray-600 py-24">
              <p className="text-lg">No interviews created yet.</p>
              <p className="text-sm mt-1">
                Click "Add Interview" to create your first one.
              </p>
            </div>
          )}

          {interviews.map((item: any) => (
            <div
              key={item.id}
              className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              
              {/* Info section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.position}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{item.techStack}</p>
              </div>

              {/* Buttons Row */}
              <div className="flex items-center gap-4 pt-6 mt-auto">
                
                {/* Start */}
                <div className="relative group">
                  <Link
                    to={`/interview/preparation/${item.id}`}
                    className="p-2 rounded-xl text-blue-600 hover:bg-blue-100 transition"
                  >
                    <PlayCircle className="w-5 h-5" />
                  </Link>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                    bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                    group-hover:opacity-100 transition pointer-events-none">
                    Start
                  </span>
                </div>

                {/* Edit */}
                <div className="relative group">
                  <Link
                    to={`/interview/create/${item.id}`}
                    className="p-2 rounded-xl text-green-600 hover:bg-green-100 transition"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                    bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                    group-hover:opacity-100 transition pointer-events-none">
                    Edit
                  </span>
                </div>

                {/* Feedback */}
                <div className="relative group">
                  <Link
                    to={`/interview/evaluation/${item.id}`}
                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-100 transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                    bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                    group-hover:opacity-100 transition pointer-events-none">
                    Feedback
                  </span>
                </div>

                {/* Delete */}
                <div className="relative group">
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                    bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                    group-hover:opacity-100 transition pointer-events-none">
                    Delete
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- CONFIRM DELETE MODAL ----------------- */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              هل أنت متأكد أنك تريد حذف هذه المقابلة؟
            </h2>

            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
              >
                نعم، حذف
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-xl hover:bg-gray-400"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allinterviews;
