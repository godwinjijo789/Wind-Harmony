import { Router, RequestHandler } from "express";
import {
  AdminStats,
  BankDetails,
  PaymentMethods,
  TermsContent,
  ApiResponse,
} from "@shared/api";

export const router = Router();

// In-memory storage for demo purposes
let bankDetails: BankDetails = {
  accountName: "WindHarmony Music Platform LLC",
  accountNumber: "****-****-****-4521",
  routingNumber: "123456789",
  bankName: "First National Bank",
  swiftCode: "FNBMUS33",
  isActive: true,
};

let paymentMethods: PaymentMethods = {
  paytm: {
    merchantId: "PAYTM123456",
    phoneNumber: "+91-9876543210",
    isActive: true,
  },
  upi: {
    upiId: "windharmony@paytm",
    qrCode:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    isActive: true,
  },
  crypto: {
    bitcoinAddress: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    ethereumAddress: "0x742d35Cc6634C0532925a3b8D400bb5e7a7c2C75",
    isActive: false,
  },
  netBanking: {
    supportedBanks: [
      "State Bank of India",
      "HDFC Bank",
      "ICICI Bank",
      "Axis Bank",
      "Punjab National Bank",
    ],
    isActive: true,
  },
};

let termsContent: TermsContent = {
  effectiveDate: new Date().toLocaleDateString(),
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      content:
        "Welcome to WindHarmony. These Terms and Conditions govern your use of our wind instrument music creation platform.",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      content:
        "To access our premium features, you must create an account with accurate information.",
      lastUpdated: new Date().toISOString(),
    },
  ],
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

    // Check if user is admin (userId '1' is admin in our demo)
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

// Get admin statistics
export const getAdminStats: RequestHandler = (req, res) => {
  const stats: AdminStats = {
    totalUsers: 147,
    activeUsers: 89,
    totalProjects: 234,
    totalRevenue: 2847,
    pendingPayments: 3,
    totalFeedback: 45,
  };

  res.json({
    success: true,
    data: stats,
    timestamp: new Date().toISOString(),
  } as ApiResponse<AdminStats>);
};

// Get bank details
export const getBankDetails: RequestHandler = (req, res) => {
  res.json({
    success: true,
    data: bankDetails,
    timestamp: new Date().toISOString(),
  } as ApiResponse<BankDetails>);
};

// Update bank details
export const updateBankDetails: RequestHandler = (req, res) => {
  const updates: Partial<BankDetails> = req.body;

  bankDetails = { ...bankDetails, ...updates };

  res.json({
    success: true,
    data: bankDetails,
    message: "Bank details updated successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<BankDetails>);
};

// Get payment methods
export const getPaymentMethods: RequestHandler = (req, res) => {
  res.json({
    success: true,
    data: paymentMethods,
    timestamp: new Date().toISOString(),
  } as ApiResponse<PaymentMethods>);
};

// Update payment methods
export const updatePaymentMethods: RequestHandler = (req, res) => {
  const updates: Partial<PaymentMethods> = req.body;

  paymentMethods = { ...paymentMethods, ...updates };

  res.json({
    success: true,
    data: paymentMethods,
    message: "Payment methods updated successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<PaymentMethods>);
};

// Get terms and conditions
export const getTermsContent: RequestHandler = (req, res) => {
  res.json({
    success: true,
    data: termsContent,
    timestamp: new Date().toISOString(),
  } as ApiResponse<TermsContent>);
};

// Update terms and conditions
export const updateTermsContent: RequestHandler = (req, res) => {
  const updates: TermsContent = req.body;

  termsContent = updates;

  res.json({
    success: true,
    data: termsContent,
    message: "Terms and conditions updated successfully",
    timestamp: new Date().toISOString(),
  } as ApiResponse<TermsContent>);
};

// Get all users (admin only)
export const getAllUsers: RequestHandler = (req, res) => {
  // Mock users data
  const users = [
    {
      id: "1",
      email: "admin@windharmony.com",
      name: "Admin User",
      licenseType: "enterprise",
      status: "active",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date().toISOString(),
    },
    {
      id: "2",
      email: "user@windharmony.com",
      name: "Demo User",
      licenseType: "professional",
      status: "active",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  res.json({
    success: true,
    data: users,
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Get storage analytics
export const getStorageAnalytics: RequestHandler = (req, res) => {
  const analytics = {
    totalUsed: 1247.8, // MB
    totalAllocated: 5120, // MB
    userBreakdown: [
      {
        userId: "1",
        email: "admin@windharmony.com",
        name: "Admin User",
        usedStorage: 245.5,
        maxStorage: 1024,
        projects: 8,
        recordings: 15,
        lastAccess: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        userId: "2",
        email: "user@windharmony.com",
        name: "Demo User",
        usedStorage: 512.3,
        maxStorage: 2048,
        projects: 12,
        recordings: 23,
        lastAccess: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };

  res.json({
    success: true,
    data: analytics,
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Update user storage
export const updateUserStorage: RequestHandler = (req, res) => {
  const { userId } = req.params;
  const { maxStorage } = req.body;

  if (!maxStorage || maxStorage < 0) {
    return res.status(400).json({
      success: false,
      message: "Valid storage limit is required",
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }

  // In production, update database
  res.json({
    success: true,
    message: `Storage limit updated for user ${userId}`,
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};

// Export data
export const exportData: RequestHandler = (req, res) => {
  const { type } = req.params;

  let data: any;
  let filename: string;

  switch (type) {
    case "users":
      data =
        "User ID,Email,Name,License Type,Status,Created At\n1,admin@windharmony.com,Admin User,enterprise,active,2024-01-01";
      filename = "users.csv";
      break;
    case "payments":
      data =
        "Transaction ID,User Email,Plan,Amount,Status,Date\nTXN-123,user@windharmony.com,professional,$29,completed,2024-01-15";
      filename = "payments.csv";
      break;
    case "feedback":
      data =
        "ID,Email,Category,Message,Rating,Date\n1,user@windharmony.com,general,Great app!,5,2024-01-15";
      filename = "feedback.csv";
      break;
    default:
      return res.status(400).json({
        success: false,
        message: "Invalid export type",
        timestamp: new Date().toISOString(),
      } as ApiResponse);
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(data);
};

// Route definitions
router.use(authenticateAdmin);
router.get("/stats", getAdminStats);
router.get("/bank-details", getBankDetails);
router.put("/bank-details", updateBankDetails);
router.get("/payment-methods", getPaymentMethods);
router.put("/payment-methods", updatePaymentMethods);
router.get("/terms", getTermsContent);
router.put("/terms", updateTermsContent);
router.get("/users", getAllUsers);
router.get("/storage", getStorageAnalytics);
router.put("/users/:userId/storage", updateUserStorage);
router.get("/export/:type", exportData);
