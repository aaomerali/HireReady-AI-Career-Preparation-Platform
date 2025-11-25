import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../firebase/auth";
import {
  setAuthLoading,
  setAuthError,
  setUser,
} from "../../redux/slices/authSlice";
import type { RootState } from "../../redux/store";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "../../index.css";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const res = await signup(email, password);
      dispatch(setUser(res.user));
      navigate("/dashboard");
    } catch (err: any) {
      dispatch(setAuthError(err.message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[hsl(220,26%,14%)]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl p-6 sm:p-8 shadow-2xl bg-[hsl(220,26%,18%)]">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg bg-linear-to-br from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)]">
              <span className="text-white font-bold text-xl sm:text-2xl">HR</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-[hsl(210,40%,98%)]">
            Create a New Account
          </h1>
          <p className="text-center mb-6 sm:mb-8 text-sm sm:text-base text-[hsl(217,10%,64%)]">
            Join us today and start your journey
          </p>

          {/* Error Message */}
          {error && (
            <p className="mb-4 text-red-600 bg-red-100 p-2 text-sm rounded">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[hsl(210,40%,98%)]">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 sm:h-12 bg-[hsl(220,26%,14%)] border-[hsl(217,91%,60%)]/25 text-[hsl(210,40%,98%)] placeholder:text-[hsl(217,10%,64%)]"
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[hsl(210,40%,98%)]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 sm:h-12 bg-[hsl(220,26%,14%)] border-[hsl(217,91%,60%)]/25 text-[hsl(210,40%,98%)] placeholder:text-[hsl(217,10%,64%)]"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[hsl(210,40%,98%)]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 sm:h-12 bg-[hsl(220,26%,14%)] border-[hsl(217,91%,60%)]/25 text-[hsl(210,40%,98%)] placeholder:text-[hsl(217,10%,64%)]"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-[hsl(210,40%,98%)]">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="h-11 sm:h-12 bg-[hsl(220,26%,14%)] border-[hsl(217,91%,60%)]/25 text-[hsl(210,40%,98%)] placeholder:text-[hsl(217,10%,64%)]"
                required
              />
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 bg-linear-to-r from-[hsl(217,91%,60%)] to-[hsl(217,91%,70%)] text-[hsl(210,40%,98%)] hover:shadow-lg"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6 sm:my-8">
            <div className="flex-1 h-px bg-[hsl(217,91%,60%)]/25"></div>
            <span className="text-sm text-[hsl(217,10%,64%)]">or</span>
            <div className="flex-1 h-px bg-[hsl(217,91%,60%)]/25"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 sm:h-12 text-sm sm:text-base rounded-lg hover:scale-105 transition-all duration-300 bg-[hsl(220,26%,14%)] border-[hsl(217,91%,60%)]/25 text-[hsl(210,40%,98%)] hover:bg-[hsl(220,26%,14%)]"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Switch to Login */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-sm sm:text-base text-[hsl(217,10%,64%)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline text-[hsl(217,91%,60%)]"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm sm:text-base hover:underline inline-flex items-center gap-2 text-[hsl(217,10%,64%)]"
          >
            <span>←</span>
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
