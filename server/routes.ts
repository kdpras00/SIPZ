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
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Current nisab values (updated daily in real app)
  const CURRENT_NISAB = {
    goldPrice: 1000000, // per gram
    silverPrice: 15000, // per gram
    goldNisab: 85, // grams
    silverNisab: 595 // grams
  };

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public routes (no authentication required)
  app.get("/api/nisab", (req, res) => {
    res.json(CURRENT_NISAB);
  });

  // Protected routes (require authentication)
  
  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Zakat calculation routes
  app.post("/api/zakat/calculate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const calculationData = insertZakatCalculationSchema.parse({
        ...req.body,
        userId
      });
      
      const calculation = await storage.createZakatCalculation(calculationData);
      res.json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid calculation data", errors: error.errors });
      } else {
        console.error("Calculation error:", error);
        res.status(500).json({ message: "Failed to save calculation" });
      }
    }
  });

  app.get("/api/zakat/calculations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const calculations = await storage.getZakatCalculationsByUser(userId);
      res.json(calculations);
    } catch (error) {
      console.error("Get calculations error:", error);
      res.status(500).json({ message: "Failed to fetch calculations" });
    }
  });

  // Zakat payment routes
  app.post("/api/zakat/payment", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const paymentData = insertZakatPaymentSchema.parse({
        ...req.body,
        userId
      });
      
      const payment = await storage.createZakatPayment(paymentData);
      res.json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid payment data", errors: error.errors });
      } else {
        console.error("Payment creation error:", error);
        res.status(500).json({ message: "Failed to create payment" });
      }
    }
  });

  app.get("/api/zakat/payments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getZakatPaymentsByUser(userId);
      res.json(payments);
    } catch (error) {
      console.error("Get payments error:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.patch("/api/zakat/payment/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const payment = await storage.updateZakatPayment(id, updates);
      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }
      
      res.json(payment);
    } catch (error) {
      console.error("Payment update error:", error);
      res.status(500).json({ message: "Failed to update payment" });
    }
  });

  app.get("/api/zakat/upcoming", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [upcoming, overdue] = await Promise.all([
        storage.getUpcomingPayments(userId),
        storage.getOverduePayments(userId)
      ]);
      
      res.json({ upcoming, overdue });
    } catch (error) {
      console.error("Upcoming payments error:", error);
      res.status(500).json({ message: "Failed to fetch upcoming payments" });
    }
  });

  // Infaq & Shadaqoh routes
  app.post("/api/infaq", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const infaqData = insertInfaqShadaqohSchema.parse({
        ...req.body,
        userId
      });
      
      const infaq = await storage.createInfaqShadaqoh(infaqData);
      res.json(infaq);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid infaq data", errors: error.errors });
      } else {
        console.error("Infaq creation error:", error);
        res.status(500).json({ message: "Failed to create infaq record" });
      }
    }
  });

  app.get("/api/infaq", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const infaqRecords = await storage.getInfaqShadaqohByUser(userId);
      res.json(infaqRecords);
    } catch (error) {
      console.error("Get infaq error:", error);
      res.status(500).json({ message: "Failed to fetch infaq records" });
    }
  });

  app.get("/api/infaq/recent", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const recentInfaq = await storage.getRecentInfaqShadaqoh(userId, limit);
      res.json(recentInfaq);
    } catch (error) {
      console.error("Recent infaq error:", error);
      res.status(500).json({ message: "Failed to fetch recent infaq" });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Notifications error:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.get("/api/notifications/count", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Notification count error:", error);
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });

  // Notification settings routes
  app.get("/api/notifications/settings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let settings = await storage.getNotificationSettings(userId);
      
      if (!settings) {
        // Create default settings
        settings = await storage.createOrUpdateNotificationSettings({
          userId,
          yearlyReminderEnabled: true,
          yearlyReminderDays: 30,
          monthlyReminderEnabled: false,
          monthlyReminderDate: 7,
          emailNotificationEnabled: true,
          email: null
        });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Notification settings error:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  app.post("/api/notifications/settings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settingsData = insertNotificationSettingsSchema.parse({
        ...req.body,
        userId
      });
      
      const settings = await storage.createOrUpdateNotificationSettings(settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        console.error("Settings update error:", error);
        res.status(500).json({ message: "Failed to update notification settings" });
      }
    }
  });

  // Reports routes
  app.get("/api/reports/yearly", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      
      const [zakatTotal, infaqTotal, transactions] = await Promise.all([
        storage.getYearlyZakatTotal(userId, year),
        storage.getYearlyInfaqTotal(userId, year),
        storage.getTransactionsByUser(userId, year)
      ]);
      
      res.json({
        year,
        zakatTotal,
        infaqTotal,
        total: zakatTotal + infaqTotal,
        transactions
      });
    } catch (error) {
      console.error("Yearly report error:", error);
      res.status(500).json({ message: "Failed to generate yearly report" });
    }
  });

  app.get("/api/reports/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      
      const transactions = await storage.getTransactionsByUser(userId, year);
      res.json(transactions);
    } catch (error) {
      console.error("Transactions report error:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}