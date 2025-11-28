import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchInterviews, deleteInterview } from "../../api/interviewsApi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { interviews, loading } = useSelector((state: RootState) => state.interview);


  useEffect(() => {
    dispatch(fetchInterviews());
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Interviews</h1>

      <Link
        to="/interview/create"
        className="bg-blue-500 text-white px-4 py-2 rounded block w-fit mt-4"
      >
        Add Interview
      </Link>

      <div className="mt-5 space-y-4">
        {interviews.map((item: any) => (
          <div
            key={item.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{item.position}</h2>
              <p className="text-sm text-gray-500">{item.techStack}</p>
            </div>

            <div className="flex gap-3">
              <Link
                to={`/interviews/${item.id}`}
                className="text-blue-600 underline"
              >
                View
              </Link>

              <Link
                to={`/interview/create/${item.id}`}
                className="text-green-600 underline"
              >
                Edit
              </Link>

              <button
                onClick={() => dispatch(deleteInterview(item.id))}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
