import { Router, RequestHandler } from "express";
import { AuthRequest, AuthResponse, User, ApiResponse } from "@shared/api";

export const router = Router();

// In-memory storage for demo purposes (replace with database in production)
const users: User[] = [
  {
    id: "1",
    email: "admin@windharmony.com",
    name: "Admin User",
    licenseType: "enterprise",
    expiryDate: "2025-12-31",
    status: "active",
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@windharmony.com",
    name: "Demo User",
    licenseType: "professional",
    expiryDate: "2024-12-31",
    status: "active",
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simple JWT simulation (use proper JWT library in production)
const generateToken = (userId: string): string => {
  return Buffer.from(
    JSON.stringify({ userId, timestamp: Date.now() }),
  ).toString("base64");
};

const verifyToken = (token: string): string | null => {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    return decoded.userId;
  } catch {
    return null;
  }
};

// Login endpoint
export const login: RequestHandler = (req, res) => {
  const { email, password }: AuthRequest = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Simple authentication (replace with proper password hashing in production)
  const user = users.find((u) => u.email === email);

  if (!user || password !== "password123") {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const token = generateToken(user.id);

  res.json({
    success: true,
    user,
    token,
    message: "Login successful",
    timestamp: new Date().toISOString(),
  } as AuthResponse);
};

// Signup endpoint
export const signup: RequestHandler = (req, res) => {
  const { email, password, name }: AuthRequest = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: "Email, password, and name are required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Create new user
  const newUser: User = {
    id: (users.length + 1).toString(),
    email,
    name,
    licenseType: "free",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days trial
    status: "active",
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  const token = generateToken(newUser.id);

  res.status(201).json({
    success: true,
    user: newUser,
    token,
    message: "Account created successfully",
    timestamp: new Date().toISOString(),
  } as AuthResponse);
};

// Get current user
export const getCurrentUser: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const userId = verifyToken(token);
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  res.json({
    success: true,
    data: user,
    timestamp: new Date().toISOString(),
  } as ApiResponse<User>);
};

// Generate OTP
export const generateOTP: RequestHandler = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // In production, save OTP to database and send via email/SMS
  console.log(`OTP for ${email}: ${otp}`);

  res.json({
    success: true,
    data: { otp }, // Remove this in production
    message: "OTP sent successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Verify OTP
export const verifyOTP: RequestHandler = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // In production, verify OTP from database
  // For demo, accept any 6-digit number
  if (otp.length === 6 && /^\d+$/.test(otp)) {
    res.json({
      success: true,
      message: "OTP verified successfully",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid OTP",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }
};

// Route definitions
router.post("/login", login);
router.post("/signup", signup);
router.get("/me", getCurrentUser);
router.post("/otp/generate", generateOTP);
router.post("/otp/verify", verifyOTP);
