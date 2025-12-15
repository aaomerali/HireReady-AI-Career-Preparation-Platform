import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createInterview,
  fetchInterviewById,
  updateInterview,
} from "../../api/interviewsApi";
import { aiClient, MODEL_NAME } from "../../ai/geminiAI";




const CreateInterview = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { interviewId } = useParams();
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const selectedInterview = useSelector(
    (state: RootState) => state.interview.selected
  );

  const [form, setForm] = useState({
    position: "",
    description: "",
    experience: "",
    techStack: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // جلب بيانات المقابلة عند وجود interviewId
  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterviewById(interviewId));
    }
  }, [interviewId]);

  // تعبئة البيانات في حالة التعديل
  useEffect(() => {
    if (interviewId && selectedInterview) {
      setForm({
        position: selectedInterview.position,
        description: selectedInterview.description,
        experience: selectedInterview.experience.toString(),
        techStack: selectedInterview.techStack,
      });
    }
  }, [selectedInterview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const generateAiResponse = async (data: any) => {
    const prompt = `
        As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}

        The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
        also the quetions shouldn't be long .. make it something short and need short answer
        `;

    const response = await aiClient.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });



    // استخراج النص وتحويله
    const textResponse = response.text;

    if (!textResponse) throw new Error("No response from AI");

    const parsedData = JSON.parse(textResponse);
    return parsedData;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userId) {
      setError("You must be logged in.");
      setIsLoading(false);
      return;
    }

    if (!form.position.trim()) {
      setError("Position is required");
      setIsLoading(false);
      return;
    }
    if (!form.description.trim()) {
      setError("Description is required");
      setIsLoading(false);
      return;
    }
    if (!form.experience) {
      setError("Experience is required");
      setIsLoading(false);
      return;
    }
    if (!form.techStack.trim()) {
      setError("Tech Stack is required");
      setIsLoading(false);
      return;
    }

    setError("");





    try {
      let questions = [];

      if (!interviewId) {
        const aiData = {
          position: form.position,
          description: form.description,
          experience: Number(form.experience),
          techStack: form.techStack,
        };



        questions = await generateAiResponse(aiData);

      } else {
        questions = selectedInterview?.questions || [];
      }

      const interviewData = {
        position: form.position,
        description: form.description,
        experience: Number(form.experience),
        techStack: form.techStack,
        userId: userId,
        questions: questions,
        updateAt: new Date(),
        createdAt: interviewId ? selectedInterview?.createdAt! : new Date(),
      };


      if (interviewId) {
        await dispatch(updateInterview({ id: interviewId, data: interviewData })).unwrap();
      } else {
        await dispatch(createInterview(interviewData)).unwrap();
      }

      navigate("/interview");
    } catch (error) {
      setError("An error occurred while saving the interview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {interviewId ? "Edit Interview" : "Create New Interview"}
          </h1>
          <p className="text-gray-600">
            {interviewId
              ? "Update your interview details below"
              : "Fill in the details to create a new interview process"
            }
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Position Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                  placeholder="e.g. Senior Frontend Developer, Full Stack Engineer..."
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 resize-none"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              />
            </div>

            {/* Experience & Tech Stack Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    min={0}
                    max={50}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none"
                    placeholder="0"
                  />
                  <div className="absolute right-3 top-3">
                    <span className="text-gray-400">years</span>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technology Stack *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="techStack"
                    value={form.techStack}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="React, Node.js, TypeScript, PostgreSQL..."
                  />
                  <div className="absolute right-3 top-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/interview")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 text-center"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {interviewId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={interviewId ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    {interviewId ? "Update Interview" : "Create Interview"}
                  </>
                )}
              </button>
            </div>

            {/* Required fields note */}
            <p className="text-xs text-gray-500 text-center pt-4">
              * Fields marked with an asterisk are required
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;