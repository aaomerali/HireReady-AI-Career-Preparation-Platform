import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../firebase/auth";
import {
  setAuthLoading,
  setAuthError,
  setUser,
} from "../../redux/slices/authSlice";
import type { RootState } from "../../redux/store";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const res = await login(email, password);
      dispatch(setUser(res.user));
      navigate("/dashboard");
    } catch (err: any) {
      dispatch(setAuthError(err.message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-color-light px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-secondary mb-6 text-center">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="mb-4 text-red-600 bg-red-100 p-2 text-sm rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
