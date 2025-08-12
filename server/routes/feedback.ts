import { Router, RequestHandler } from "express";
import {
  Feedback,
  FeedbackRequest,
  ApiResponse,
  PaginatedResponse,
} from "@shared/api";

export const router = Router();

// In-memory storage for demo purposes
const feedbackSubmissions: Feedback[] = [
  {
    id: "1",
    userId: "2",
    email: "user@windharmony.com",
    category: "general",
    message: "Love the new interface! The wind instruments sound amazing.",
    rating: 5,
    source: "workspace-dialog",
    wouldRecommend: true,
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    email: "musician@example.com",
    category: "feature-request",
    message:
      "Could you add more saxophone variations? The current ones are great but I need more variety.",
    rating: 4,
    source: "feedback-page",
    wouldRecommend: true,
    status: "reviewed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Optional authentication middleware
const optionalAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());
      req.userId = decoded.userId;
    } catch {
      // Invalid token, but continue without user ID
    }
  }

  next();
};

// Submit feedback
export const submitFeedback: RequestHandler = (req: any, res) => {
  const {
    email,
    category,
    message,
    rating,
    source,
    wouldRecommend,
  }: FeedbackRequest = req.body;
  const userId = req.userId;

  if (!email || !message || !category) {
    return res.status(400).json({
      success: false,
      message: "Email, message, and category are required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const newFeedback: Feedback = {
    id: (feedbackSubmissions.length + 1).toString(),
    userId,
    email,
    category,
    message,
    rating: rating || 5,
    source: source || "unknown",
    wouldRecommend: wouldRecommend !== undefined ? wouldRecommend : true,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  feedbackSubmissions.push(newFeedback);

  res.status(201).json({
    success: true,
    data: newFeedback,
    message: "Feedback submitted successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<Feedback>);
};

// Get all feedback (admin only)
export const getAllFeedback: RequestHandler = (req: any, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());

    // Check if user is admin
    if (decoded.userId !== "1") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const { page = 1, limit = 10, status, category } = req.query;

  let filteredFeedback = [...feedbackSubmissions];

  if (status) {
    filteredFeedback = filteredFeedback.filter((f) => f.status === status);
  }

  if (category) {
    filteredFeedback = filteredFeedback.filter((f) => f.category === category);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

  const response: PaginatedResponse<Feedback> = {
    data: paginatedFeedback,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredFeedback.length / limit),
      totalItems: filteredFeedback.length,
      hasNext: endIndex < filteredFeedback.length,
      hasPrev: page > 1,
    },
  };

  res.json({
    success: true,
    data: response,
    timestamp: new Date().toISOString(),
  } as ApiResponse<PaginatedResponse<Feedback>>);
};

// Get feedback by ID
export const getFeedback: RequestHandler = (req: any, res) => {
  const { id } = req.params;
  const feedback = feedbackSubmissions.find((f) => f.id === id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: "Feedback not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  res.json({
    success: true,
    data: feedback,
    timestamp: new Date().toISOString(),
  } as ApiResponse<Feedback>);
};

// Update feedback status (admin only)
export const updateFeedbackStatus: RequestHandler = (req: any, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());

    if (decoded.userId !== "1") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "reviewed", "resolved"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const feedbackIndex = feedbackSubmissions.findIndex((f) => f.id === id);

  if (feedbackIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Feedback not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  feedbackSubmissions[feedbackIndex].status = status;
  feedbackSubmissions[feedbackIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: feedbackSubmissions[feedbackIndex],
    message: "Feedback status updated successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<Feedback>);
};

// Get feedback statistics
export const getFeedbackStats: RequestHandler = (req, res) => {
  const stats = {
    total: feedbackSubmissions.length,
    pending: feedbackSubmissions.filter((f) => f.status === "pending").length,
    reviewed: feedbackSubmissions.filter((f) => f.status === "reviewed").length,
    resolved: feedbackSubmissions.filter((f) => f.status === "resolved").length,
    averageRating:
      feedbackSubmissions.reduce((sum, f) => sum + f.rating, 0) /
        feedbackSubmissions.length || 0,
    recommendationRate:
      feedbackSubmissions.filter((f) => f.wouldRecommend).length /
        feedbackSubmissions.length || 0,
    categoryBreakdown: feedbackSubmissions.reduce(
      (acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number },
    ),
  };

  res.json({
    success: true,
    data: stats,
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Delete feedback (admin only)
export const deleteFeedback: RequestHandler = (req: any, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());

    if (decoded.userId !== "1") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const { id } = req.params;
  const feedbackIndex = feedbackSubmissions.findIndex((f) => f.id === id);

  if (feedbackIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Feedback not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  feedbackSubmissions.splice(feedbackIndex, 1);

  res.json({
    success: true,
    message: "Feedback deleted successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Route definitions
router.post("/", optionalAuth, submitFeedback);
router.get("/", getAllFeedback);
router.get("/stats", getFeedbackStats);
router.get("/:id", getFeedback);
router.put("/:id/status", updateFeedbackStatus);
router.delete("/:id", deleteFeedback);
