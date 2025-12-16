import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  MessageSquare,
  FileText,
  CheckCircle,
  BarChart2,
  PlusCircle,
} from "lucide-react";

// Interface for individual Stat Cards
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  colorClass: string;
}

// Component for a single Statistic Card
const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  description,
  colorClass,
}) => (
  <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all">
    <div className={`p-3 rounded-xl inline-flex mb-4 ${colorClass}`}>
      {icon}
    </div>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    <p className="text-xs text-gray-400 mt-2">{description}</p>
  </div>
);

// Interface for Quick Action Card
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  to: string;
  gradientClass: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  subtitle,
  to,
  gradientClass,
}) => (
  <Link
    to={to}
    className={`p-6 rounded-2xl text-white flex flex-col items-start justify-between h-40 ${gradientClass} transition-all hover:scale-[1.02] transform shadow-lg`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <div className="flex flex-col items-start">
      <p className="text-sm opacity-90 mb-2">{subtitle}</p>
      <span className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-full inline-flex items-center gap-1">
        <PlusCircle className="w-4 h-4" />
        Start Now
      </span>
    </div>
  </Link>
);


const Dashboard = () => {
  // Static Interview Statistics Data
  const interviewStats = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Total Interviews",
      value: "3",
      description: "Total number of virtual interviews conducted.",
      colorClass: "bg-blue-100",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: "Completed Evaluations",
      value: "2",
      description: "Interviews that have been fully reviewed.",
      colorClass: "bg-green-100",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
      title: "Average Score",
      value: "8.5 / 10",
      description: "Your average performance score across all interviews.",
      colorClass: "bg-indigo-100",
    },
  ];

  // Static CV/Resume Analysis Statistics Data
  const cvStats = [
    {
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      title: "Resumes Created",
      value: "5",
      description: "Total number of resumes in your profile.",
      colorClass: "bg-purple-100",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-yellow-600" />,
      title: "Highest Analysis Match",
      value: "92%",
      description: "Your best job compatibility score.",
      colorClass: "bg-yellow-100",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-teal-600" />,
      title: "Top Career Focus",
      value: "Software Engineer",
      description: "The most recurring field in your analyses.",
      colorClass: "bg-teal-100",
    },
  ];

  // Router links
  const allInterviewsLink = "/interview"; 
  const createInterviewLink = "/interview/create";
  const createCVLink = "/cv/create"; 


  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Dashboard
          </h1>
          <Link
            to={allInterviewsLink} 
            className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-300 transition-all shadow-sm w-full sm:w-auto"
          >
            <Briefcase className="w-5 h-5" />
            View All Interviews
          </Link>
        </div>

        {/* --- Quick Actions Section --- */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <ActionCard
            icon={<Briefcase className="w-6 h-6" />}
            title="Create New Interview"
            subtitle="Start a personalized virtual interview for your career path."
            to={createInterviewLink}
            gradientClass="bg-gradient-to-r from-blue-600 to-indigo-600"
          />
          <ActionCard
            icon={<FileText className="w-6 h-6" />}
            title="Analyze Resume/CV"
            subtitle="Upload your resume for job compatibility analysis."
            to={createCVLink}
            gradientClass="bg-gradient-to-r from-teal-500 to-green-600"
          />
        </div>


        {/* ------------------------------------------- */}
        {/* --- Statistics Section - Virtual Interviews --- */}
        {/* ------------------------------------------- */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">
          Virtual Interviews 🎙️
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* ------------------------------------------- */}
        {/* --- Statistics Section - CV/Resume Analysis --- */}
        {/* ------------------------------------------- */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">
          CV/Resume Analysis 📄
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;