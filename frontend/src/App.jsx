import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/authStore";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";

import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Check if user is trying to access the "/verify-email" route
  const isVerifyEmailRoute = location.pathname === "/verify-email";

  // Case 1: If the user is authenticated and verified, redirect them to dashboard
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  // Case 2: If the user is unverified and not on the verify email route, redirect them to the verify email page
  if (isAuthenticated && user && !user.isVerified && !isVerifyEmailRoute) {
    return <Navigate to="/verify-email" replace />;
  }

  // if (!isAuthenticated && !user && isVerifyEmailRoute) {
  //   return <Navigate to="/login" replace />;
  // }

  // If none of the above conditions apply, render the child components
  return children;

  // if (isAuthenticated && user.isVerified) {
  //   return <Navigate to="/" replace />;
  // }

  // if (user && !user.isVerified) {
  //   return <Navigate to="/verify-email" replace />;
  // }

  // return children;
};

function App() {
  const { isCheckingAuth, checkAuth, setUser, setErrorMessage } =
    useAuthStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");

    if (!error) {
      checkAuth();
    }
  }, [checkAuth]);

  useEffect(() => {
    // After singing up with Google :  Check if a JWT token is available in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = urlParams.get("user");
    const error = urlParams.get("error");

    if (token && user) {
      // Set the user in the Zustand store and mark as authenticated
      setUser(JSON.parse(user), token);
    } else if (error) {
      if (error === "EmailAlreadyRegistered") {
        // Handle the error for already registered email
        setErrorMessage(
          "This email is already registered. Please log in using your email and password."
        );
      }
    }
  }, [setUser, setErrorMessage]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    // from-slate-900 via-gray-900 to-zinc-900  <== dark
    // rom-slate-100 via-gray-100 to-zinc-100 <== light
    // from-gray-900 via-green-900 to-emerald-900
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100 flex items-center justify-center relative overflow-hidden">
      <Routes>
        {/* Automatically redirect "/" to "/dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerificationPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        {/* catch all routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
