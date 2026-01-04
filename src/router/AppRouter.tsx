// src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Landing from "../pages/Landing";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

// User Layout
import UserLayout from "../layout/UserLayout";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

// User Pages
import Dashboard from "../pages/Dashboard/Dashboard";

// Resume Pages
import AllResumes from "../pages/Resume/AllResumes";
import AnalysisReport from "../pages/Resume/AnalysisReport";


// Interview Pages
import CreateInterview from "../pages/Interview/CreateInterview";
import InterviewPreparation from "../pages/Interview/InterviewPreparation";
import StartInterview from "../pages/Interview/StartInterview";
import InterviewEvaluation from "../pages/Interview/InterviewEvaluation";
import AllInterviews from "../pages/Interview/AllInterviews";
import TestRecord from "@/pages/Interview/TestRecord";


// job resourses Pages
import JobResources from "@/pages/Resoures/JobResources";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Layout (Protected) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />


          {/* Interviews */}
          <Route path="interview/create" element={<CreateInterview />} />
          <Route path="interview/create/:interviewId" element={<CreateInterview />} />
          <Route path="interview/preparation/:interviewId" element={<InterviewPreparation />} />
          <Route path="interview/start/:interviewId" element={<StartInterview />} />
          <Route path="interview/evaluation/:interviewId" element={<InterviewEvaluation />} />
          <Route path="interview" element={<AllInterviews />} />
          <Route path="interview/test" element={<TestRecord />} />


          {/* Resume */}
          <Route path="resume" element={<AllResumes />} />
          <Route path="resume/report/:resumeId" element={<AnalysisReport />} />


          {/* Resourses */}
          <Route path="resources" element={<JobResources />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}
