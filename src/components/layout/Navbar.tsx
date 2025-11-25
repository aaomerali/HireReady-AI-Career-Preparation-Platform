import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Edit, LogOut } from "lucide-react";
import { logout } from "../../firebase/auth";
import {
  setAuthLoading,
  setAuthError,
  setUser,
} from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      logout();
      dispatch(setUser(null));
      navigate("/login");
    } catch (err: any) {
      dispatch(setAuthError(err.message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // روابط الناف بار الرئيسية (بدون صفحات فرعية)
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Interviews", path: "/interview" }, // لاحظ إزالة /all
    { name: "Resume", path: "/resume" },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-[hsl(214.3,31.8%,91.4%)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg md:text-xl">HR</span>
            </div>
            <span className="text-lg md:text-xl font-bold">HireReady</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`relative font-medium transition-colors ${
                    isActive ? "text-blue-600" : "hover:text-blue-600"
                  }`}
                >
                  {item.name}

                  {isActive && (
                    <span className="absolute left-0 -bottom-5 w-full h-1 bg-blue-600"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>

          {/* User Icon */}
          <div className="hidden lg:flex gap-4">
            <div className="relative" ref={menuRef}>
              <button
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="w-6 h-6 text-gray-700" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 min-w-[175px] bg-white shadow-lg rounded-md p-4">
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                    onClick={() => alert("Edit Account")}
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                    Edit Account
                  </button>

                  <hr className="my-2 border-gray-200" />

                  <button
                    className="w-full flex px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 text-white mr-2" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t shadow-md flex flex-col p-4 gap-4 animate-fadeIn">
          {navItems.map((item, index) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={index}
                to={item.path}
                className={`block px-4 py-2 text-sm rounded-md ${
                  isActive
                    ? "text-blue-600 font-semibold bg-blue-50 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 py-2 rounded-md bg-[hsl(210,40%,96.1%)] font-medium"
              onClick={() => alert("Edit Account")}
            >
              Edit Account
            </button>

            <button
              className="flex-1 py-2 rounded-md bg-red-600 text-white font-semibold shadow-md"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
