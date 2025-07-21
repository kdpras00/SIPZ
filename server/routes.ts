import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { 
  insertZakatCalculationSchema,
  insertZakatPaymentSchema,
  insertInfaqShadaqohSchema,
  insertNotificationSettingsSchema
} from "@shared/schema";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Current nisab values (updated daily in real app)
  const CURRENT_NISAB = {
    goldPrice: 1000000, // per gram
    silverPrice: 15000, // per gram
    goldNisab: 85, // grams
    silverNisab: 595 // grams
  };

  // Get current user (simplified - in real app use auth middleware)
  const getCurrentUserId = () => 1;

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const currentYear = new Date().getFullYear();
      
      const zakatTotal = await storage.getYearlyZakatTotal(userId, currentYear);
      const infaqTotal = await storage.getYearlyInfaqTotal(userId, currentYear);
      const upcomingPayments = await storage.getUpcomingPayments(userId);
      const nisabGold = CURRENT_NISAB.goldPrice * CURRENT_NISAB.goldNisab;
      
      res.json({
        zakatTotal,
        infaqTotal,
        scheduledCount: upcomingPayments.length,
        nisabGold,
        goldPrice: CURRENT_NISAB.goldPrice
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Get current nisab values
  app.get("/api/nisab", (req, res) => {
    res.json(CURRENT_NISAB);
  });

  // Zakat calculations
  app.post("/api/zakat/calculate", async (req, res) => {
    try {
      const calculationData = insertZakatCalculationSchema.parse({
        ...req.body,
        userId: getCurrentUserId()
      });
      
      const calculation = await storage.createZakatCalculation(calculationData);
      res.json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid calculation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save calculation" });
      }
    }
  });

  app.get("/api/zakat/calculations", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const calculations = await storage.getZakatCalculationsByUser(userId);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calculations" });
    }
  });

  // Zakat payments
  app.post("/api/zakat/schedule", async (req, res) => {
    try {
      const paymentData = insertZakatPaymentSchema.parse({
        ...req.body,
        userId: getCurrentUserId(),
        status: "scheduled"
      });
      
      const payment = await storage.createZakatPayment(paymentData);
      res.json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to schedule payment" });
      }
    }
  });

  app.get("/api/zakat/payments", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const payments = await storage.getZakatPaymentsByUser(userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.get("/api/zakat/upcoming", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const upcoming = await storage.getUpcomingPayments(userId);
      const overdue = await storage.getOverduePayments(userId);
      
      res.json({ upcoming, overdue });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming payments" });
    }
  });

  app.patch("/api/zakat/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      if (updates.status === 'paid' && !updates.paidDate) {
        updates.paidDate = new Date();
      }
      
      const payment = await storage.updateZakatPayment(id, updates);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update payment" });
    }
  });

  // Infaq & Shadaqoh
  app.post("/api/infaq", async (req, res) => {
    try {
      const infaqData = insertInfaqShadaqohSchema.parse({
        ...req.body,
        userId: getCurrentUserId()
      });
      
      const infaq = await storage.createInfaqShadaqoh(infaqData);
      res.json(infaq);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid infaq data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save infaq record" });
      }
    }
  });

  app.get("/api/infaq", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const infaqRecords = await storage.getInfaqShadaqohByUser(userId);
      res.json(infaqRecords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch infaq records" });
    }
  });

  app.get("/api/infaq/recent", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const limit = parseInt(req.query.limit as string) || 5;
      const recentInfaq = await storage.getRecentInfaqShadaqoh(userId, limit);
      res.json(recentInfaq);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent infaq" });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/count", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Notification settings
  app.get("/api/notifications/settings", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const settings = await storage.getNotificationSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  app.post("/api/notifications/settings", async (req, res) => {
    try {
      const settingsData = insertNotificationSettingsSchema.parse({
        ...req.body,
        userId: getCurrentUserId()
      });
      
      const settings = await storage.createOrUpdateNotificationSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save notification settings" });
      }
    }
  });

  // Reports
  app.get("/api/reports/summary", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      
      const zakatTotal = await storage.getYearlyZakatTotal(userId, year);
      const infaqTotal = await storage.getYearlyInfaqTotal(userId, year);
      const transactions = await storage.getTransactionsByUser(userId, year);
      
      const infaqOnly = transactions.filter(t => 'type' in t && t.type === 'infaq');
      const shadaqohOnly = transactions.filter(t => 'type' in t && t.type === 'shadaqoh');
      const totalInfaqAmount = infaqOnly.reduce((sum, t) => sum + Number(t.amount), 0);
      const totalShadaqohAmount = shadaqohOnly.reduce((sum, t) => sum + Number(t.amount), 0);
      
      res.json({
        totalZakat: zakatTotal,
        totalInfaq: totalInfaqAmount,
        totalShadaqoh: totalShadaqohAmount,
        totalTransactions: transactions.length,
        year
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report summary" });
    }
  });

  app.get("/api/reports/transactions", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const allTransactions = await storage.getTransactionsByUser(userId, year);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const transactions = allTransactions.slice(startIndex, endIndex);
      
      res.json({
        transactions,
        total: allTransactions.length,
        page,
        totalPages: Math.ceil(allTransactions.length / limit)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
