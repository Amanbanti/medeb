import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface User {
  id: number;
  phone: string;
  username?: string;
  balance: number;
}

interface AuthStore {
  user: User | null;
  isCheckingAuth: boolean;
  isRequestingOTP: boolean;
  isVerifyingOTP: boolean;
  checkAuth: () => Promise<void>;
  requestOTP: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isCheckingAuth: true,
  isRequestingOTP: false,
  isVerifyingOTP: false,

  // ✅ Check if user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/check-auth");
      set({ user: res.data.user || null });
    } catch (err) {
      console.error("Auth check failed", err);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ Request OTP
  requestOTP: async (phone: string) => {
    set({ isRequestingOTP: true });
    try {
      const res = await axiosInstance.post("/users/auth/request-otp", { phone });
      toast.success("OTP sent to your phone!");
      console.log("OTP for debug:", res.data.otp); // Remove in production
    } catch (err) {
      const msg = (err as any)?.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
    } finally {
      set({ isRequestingOTP: false });
    }
  },

  // ✅ Verify OTP
  verifyOTP: async (phone: string, otp: string) => {
    set({ isVerifyingOTP: true });
    try {
      const res = await axiosInstance.post("/users/auth/verify-otp", { phone, otp });
      set({ user: res.data.user });
      toast.success("Login successful!");
    } catch (err) {
      const msg = (err as any)?.response?.data?.message || "OTP verification failed";
      toast.error(msg);
    } finally {
      set({ isVerifyingOTP: false });
    }
  },

  // ✅ Logout
  logout: async () => {
    try {
      await axiosInstance.post("/users/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (err) {
      const msg = (err as any)?.response?.data?.message || "Logout failed";
      toast.error(msg);
    }
  },
}));
