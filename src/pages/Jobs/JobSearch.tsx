import { useState, useEffect } from "react";
import axios from "axios";
import { 
    Search, MapPin, Globe, Building2, 
    ExternalLink, Loader2, Calendar, LayoutGrid, X, Briefcase
} from "lucide-react";

interface Job {
    id: string;
    title: string;
    organization: string;
    organization_logo: string;
    locations_derived: string[];
    employment_type: string[];
    date_posted: string;
    url: string;
    remote_derived: boolean;
}

const JobSearch = () => {
    // --- Logic & State ---
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [titleFilter, setTitleFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [isRemote, setIsRemote] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        const queryParams: any = {};
        if (titleFilter.trim() !== "") queryParams.title_filter = titleFilter;
        if (locationFilter.trim() !== "") queryParams.location_filter = locationFilter;
        queryParams.remote = isRemote.toString();

        const options = {
            method: 'GET',
            url: 'https://internships-api.p.rapidapi.com/active-jb-7d',
            params: queryParams,
            headers: {
                'x-rapidapi-key': '37e2b185b7mshff6629783430b04p1cb505jsn24fd0dc2147f',
                'x-rapidapi-host': 'internships-api.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            setJobs(response.data || []);
        } catch (error) {
            console.error("API Error:", error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const clearFilters = () => {
        setTitleFilter("");
        setLocationFilter("");
        setIsRemote(false);
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-10 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section - Matching Allinterviews style */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Job Board</h1>
                        <p className="text-gray-500 mt-1">Find and apply for the latest tech opportunities.</p>
                    </div>
                </div>

                {/* --- Search & Filter Section --- */}
                <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        
                        {/* Title Input */}
                        <div className="md:col-span-4 relative group">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block ml-1">Job Title</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text"
                                    value={titleFilter}
                                    onChange={(e) => setTitleFilter(e.target.value)}
                                    placeholder="e.g. Software Engineer"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Location Input */}
                        <div className="md:col-span-3 relative group">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block ml-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    placeholder="e.g. Riyadh, SA"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Remote Toggle */}
                        <div className="md:col-span-2 flex flex-col justify-end">
                            <button 
                                onClick={() => setIsRemote(!isRemote)}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all
                                ${isRemote ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                            >
                                <Globe className="w-4 h-4" />
                                Remote {isRemote ? 'On' : 'Off'}
                            </button>
                        </div>

                        {/* Search Action */}
                        <div className="md:col-span-3 flex gap-2">
                            <button 
                                onClick={fetchJobs}
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                Search
                            </button>
                            {(titleFilter || locationFilter || isRemote) && (
                                <button 
                                    onClick={clearFilters}
                                    className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                                    title="Clear Filters"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Results Section --- */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <div 
                                    key={job.id} 
                                    className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-all flex flex-col group"
                                >
                                    {/* Card Header: Logo & Badge */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 p-2 border border-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                            {job.organization_logo ? (
                                                <img src={job.organization_logo} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                <Building2 className="w-6 h-6 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 items-end">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                                {job.employment_type?.[0] || "Internship"}
                                            </span>
                                            {job.remote_derived && (
                                                <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                                    Remote
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="flex-1">
                                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {job.title}
                                        </h2>
                                        <p className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            {job.organization}
                                        </p>
                                        
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>{job.locations_derived?.[0] || "Worldwide"}</span>
                                            </div>
                                            <div  className="flex items-center gap-2 text-xs text-gray-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span dir="rtl">{new Date(job.date_posted).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button - Matching "Add Interview" style */}
                                    <div className="mt-6 pt-6 border-t border-gray-50">
                                        <a 
                                            href={job.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                                        >
                                            View Details
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-600 py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                <LayoutGrid className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                                <p className="text-lg font-medium">No jobs found matching your criteria.</p>
                                <p className="text-sm mt-1">Try adjusting the filters or keywords.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSearch;