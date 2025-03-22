import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const registerUser = (mobile: string) =>
  api.post("/register", { mobile });

export const verifyOtp = (mobile: string, otp: string) =>
  api.post("/verify-otp", { mobile, otp });

export const updateProfile = (formData: FormData) =>
  api.post("/profile", formData);

export const selectPackage = (mobile: string, packageId: number) =>
  api.post("/select-package", { mobile, package_id: packageId });

export const getPackages = () => api.get("/packages");
