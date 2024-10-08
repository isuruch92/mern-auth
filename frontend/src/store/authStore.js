import { create } from "zustand";
import axios from "axios";
import { verifyTokenLocally } from "../utils/verifyTokenLocally";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  errorCode: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        errorCode: error.response.data.code,
        isLoading: false,
      });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  resendVerifyEmail: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/resend-verify-email`, {
        email,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      set({
        error:
          error.response.data.message || "Error sending verification email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    const isOnline = window.navigator.onLine; // Check if the user is online

    if (isOnline) {
      // Online: Verify with the backend
      try {
        const response = await axios.get(`${API_URL}/check-auth`);
        set({
          user: response.data.user,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } catch (error) {
        set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      }
    } else {
      // Offline support: Verify token locally
      const isTokenValid = verifyTokenLocally();

      if (isTokenValid) {
        const user = JSON.parse(localStorage.getItem("user"));
        // If valid, allow the user to proceed
        set({ isAuthenticated: true, isCheckingAuth: false, user });
      } else {
        // If invalid, mark the user as unauthenticated
        set({ error: null, isAuthenticated: false, isCheckingAuth: false });
      }
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    const isOnline = window.navigator.onLine; // Check if the user is online

    if (isOnline) {
      try {
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });
        set({
          isAuthenticated: true,
          user: response.data.user,
          error: null,
          isLoading: false,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        set({
          error: error.response?.data?.message || "Error logging in",
          isLoading: false,
        });
        throw error;
      }
    } else {
      // Offline support: Verify token locally
      const isTokenValid = verifyTokenLocally();
      if (isTokenValid) {
        const user = JSON.parse(localStorage.getItem("user"));
        set({ isAuthenticated: true, user, error: null, isLoading: false });
      } else {
        // If invalid, mark the user as unauthenticated
        set({
          error: "Error logging in",
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
  clearErrors: () => {
    set({ error: null });
  },
  setUser: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      user,
      isAuthenticated: true,
      token,
    });
  },
  setErrorMessage: (errorMessage) => {
    set({
      error: errorMessage,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: false,
    });
  },
}));
