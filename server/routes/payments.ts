import { Router, RequestHandler } from "express";
import {
  Payment,
  PaymentRequest,
  ApiResponse,
  PaginatedResponse,
} from "@shared/api";

export const router = Router();

// In-memory storage for demo purposes
const payments: Payment[] = [
  {
    id: "1",
    userId: "2",
    transactionId: "TXN-1737123456",
    plan: "professional",
    amount: 29,
    paymentMethod: "Credit Card",
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "1",
    transactionId: "TXN-1737123457",
    plan: "enterprise",
    amount: 99,
    paymentMethod: "Bank Transfer",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Authentication middleware
const authenticateUser = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }
};

// Admin authentication middleware
const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    req.userId = decoded.userId;

    if (decoded.userId !== "1") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }
};

// Process payment
export const processPayment: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const { plan, paymentMethod, amount }: PaymentRequest = req.body;

  if (!plan || !paymentMethod || !amount) {
    return res.status(400).json({
      success: false,
      message: "Plan, payment method, and amount are required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  if (!["professional", "enterprise"].includes(plan)) {
    return res.status(400).json({
      success: false,
      message: "Invalid plan type",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // Generate transaction ID
  const transactionId = `TXN-${Date.now()}`;

  const newPayment: Payment = {
    id: (payments.length + 1).toString(),
    userId,
    transactionId,
    plan,
    amount,
    paymentMethod,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  payments.push(newPayment);

  // Simulate payment processing
  setTimeout(() => {
    const paymentIndex = payments.findIndex((p) => p.id === newPayment.id);
    if (paymentIndex !== -1) {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.1; // 90% success rate

      payments[paymentIndex].status = success ? "completed" : "failed";
      payments[paymentIndex].updatedAt = new Date().toISOString();

      console.log(
        `Payment ${transactionId} ${success ? "completed" : "failed"}`,
      );
    }
  }, 2000);

  res.status(201).json({
    success: true,
    data: newPayment,
    message: "Payment initiated successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<Payment>);
};

// Get payment status
export const getPaymentStatus: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const { transactionId } = req.params;

  const payment = payments.find(
    (p) => p.transactionId === transactionId && p.userId === userId,
  );

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  res.json({
    success: true,
    data: payment,
    timestamp: new Date().toISOString(),
  } as ApiResponse<Payment>);
};

// Get user payments
export const getUserPayments: RequestHandler = (req: any, res) => {
  const userId = req.userId;
  const { page = 1, limit = 10 } = req.query;

  const userPayments = payments.filter((p) => p.userId === userId);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPayments = userPayments.slice(startIndex, endIndex);

  const response: PaginatedResponse<Payment> = {
    data: paginatedPayments,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(userPayments.length / limit),
      totalItems: userPayments.length,
      hasNext: endIndex < userPayments.length,
      hasPrev: page > 1,
    },
  };

  res.json({
    success: true,
    data: response,
    timestamp: new Date().toISOString(),
  } as ApiResponse<PaginatedResponse<Payment>>);
};

// Get all payments (admin only)
export const getAllPayments: RequestHandler = (req: any, res) => {
  const { page = 1, limit = 10, status, plan } = req.query;

  let filteredPayments = [...payments];

  if (status) {
    filteredPayments = filteredPayments.filter((p) => p.status === status);
  }

  if (plan) {
    filteredPayments = filteredPayments.filter((p) => p.plan === plan);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const response: PaginatedResponse<Payment> = {
    data: paginatedPayments,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredPayments.length / limit),
      totalItems: filteredPayments.length,
      hasNext: endIndex < filteredPayments.length,
      hasPrev: page > 1,
    },
  };

  res.json({
    success: true,
    data: response,
    timestamp: new Date().toISOString(),
  } as ApiResponse<PaginatedResponse<Payment>>);
};

// Update payment status (admin only)
export const updatePaymentStatus: RequestHandler = (req: any, res) => {
  const { id } = req.params;
  const { status, refundAmount } = req.body;

  if (!["pending", "completed", "failed", "refunded"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const paymentIndex = payments.findIndex((p) => p.id === id);

  if (paymentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  payments[paymentIndex].status = status;
  payments[paymentIndex].updatedAt = new Date().toISOString();

  if (status === "refunded" && refundAmount) {
    payments[paymentIndex].refundAmount = refundAmount;
  }

  res.json({
    success: true,
    data: payments[paymentIndex],
    message: "Payment status updated successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<Payment>);
};

// Get payment statistics (admin only)
export const getPaymentStats: RequestHandler = (req, res) => {
  const stats = {
    totalPayments: payments.length,
    totalRevenue: payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    completedPayments: payments.filter((p) => p.status === "completed").length,
    failedPayments: payments.filter((p) => p.status === "failed").length,
    refundedPayments: payments.filter((p) => p.status === "refunded").length,
    planBreakdown: payments.reduce(
      (acc, p) => {
        acc[p.plan] = (acc[p.plan] || 0) + 1;
        return acc;
      },
      {} as { [key: string]: number },
    ),
    methodBreakdown: payments.reduce(
      (acc, p) => {
        acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
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

// Refund payment (admin only)
export const refundPayment: RequestHandler = (req: any, res) => {
  const { id } = req.params;
  const { refundAmount } = req.body;

  const paymentIndex = payments.findIndex((p) => p.id === id);

  if (paymentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const payment = payments[paymentIndex];

  if (payment.status !== "completed") {
    return res.status(400).json({
      success: false,
      message: "Only completed payments can be refunded",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  const refundAmountToProcess = refundAmount || payment.amount;

  if (refundAmountToProcess > payment.amount) {
    return res.status(400).json({
      success: false,
      message: "Refund amount cannot exceed payment amount",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  payments[paymentIndex].status = "refunded";
  payments[paymentIndex].refundAmount = refundAmountToProcess;
  payments[paymentIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: payments[paymentIndex],
    message: "Payment refunded successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<Payment>);
};

// Route definitions
router.post("/", authenticateUser, processPayment);
router.get("/status/:transactionId", authenticateUser, getPaymentStatus);
router.get("/user", authenticateUser, getUserPayments);
router.get("/admin/all", authenticateAdmin, getAllPayments);
router.get("/admin/stats", authenticateAdmin, getPaymentStats);
router.put("/admin/:id/status", authenticateAdmin, updatePaymentStatus);
router.post("/admin/:id/refund", authenticateAdmin, refundPayment);
