import {
  users,
  zakatCalculations,
  zakatPayments,
  infaqShadaqoh,
  notifications,
  notificationSettings,
  type User,
  type UpsertUser,
  type ZakatCalculation,
  type InsertZakatCalculation,
  type ZakatPayment,
  type InsertZakatPayment,
  type InfaqShadaqoh,
  type InsertInfaqShadaqoh,
  type Notification,
  type InsertNotification,
  type NotificationSettings,
  type InsertNotificationSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sum, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Zakat calculations
  createZakatCalculation(calculation: InsertZakatCalculation): Promise<ZakatCalculation>;
  getZakatCalculationsByUser(userId: string): Promise<ZakatCalculation[]>;
  getZakatCalculation(id: number): Promise<ZakatCalculation | undefined>;

  // Zakat payments
  createZakatPayment(payment: InsertZakatPayment): Promise<ZakatPayment>;
  getZakatPaymentsByUser(userId: string): Promise<ZakatPayment[]>;
  updateZakatPayment(id: number, updates: Partial<ZakatPayment>): Promise<ZakatPayment | undefined>;
  getUpcomingPayments(userId: string): Promise<ZakatPayment[]>;
  getOverduePayments(userId: string): Promise<ZakatPayment[]>;

  // Infaq & Shadaqoh
  createInfaqShadaqoh(infaq: InsertInfaqShadaqoh): Promise<InfaqShadaqoh>;
  getInfaqShadaqohByUser(userId: string): Promise<InfaqShadaqoh[]>;
  getRecentInfaqShadaqoh(userId: string, limit?: number): Promise<InfaqShadaqoh[]>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;
  getUnreadNotificationCount(userId: string): Promise<number>;

  // Notification settings
  createOrUpdateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
  getNotificationSettings(userId: string): Promise<NotificationSettings | undefined>;

  // Statistics
  getYearlyZakatTotal(userId: string, year: number): Promise<number>;
  getYearlyInfaqTotal(userId: string, year: number): Promise<number>;
  getTransactionsByUser(userId: string, year?: number): Promise<Array<ZakatPayment | InfaqShadaqoh>>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Zakat calculations
  async createZakatCalculation(calculation: InsertZakatCalculation): Promise<ZakatCalculation> {
    const [result] = await db.insert(zakatCalculations).values(calculation).returning();
    return result;
  }

  async getZakatCalculationsByUser(userId: string): Promise<ZakatCalculation[]> {
    return await db
      .select()
      .from(zakatCalculations)
      .where(eq(zakatCalculations.userId, userId))
      .orderBy(desc(zakatCalculations.createdAt));
  }

  async getZakatCalculation(id: number): Promise<ZakatCalculation | undefined> {
    const [result] = await db
      .select()
      .from(zakatCalculations)
      .where(eq(zakatCalculations.id, id));
    return result || undefined;
  }

  // Zakat payments
  async createZakatPayment(payment: InsertZakatPayment): Promise<ZakatPayment> {
    const [result] = await db.insert(zakatPayments).values(payment).returning();
    return result;
  }

  async getZakatPaymentsByUser(userId: string): Promise<ZakatPayment[]> {
    return await db
      .select()
      .from(zakatPayments)
      .where(eq(zakatPayments.userId, userId))
      .orderBy(desc(zakatPayments.createdAt));
  }

  async updateZakatPayment(id: number, updates: Partial<ZakatPayment>): Promise<ZakatPayment | undefined> {
    const [result] = await db
      .update(zakatPayments)
      .set(updates)
      .where(eq(zakatPayments.id, id))
      .returning();
    return result || undefined;
  }

  async getUpcomingPayments(userId: string): Promise<ZakatPayment[]> {
    const now = new Date();
    return await db
      .select()
      .from(zakatPayments)
      .where(
        and(
          eq(zakatPayments.userId, userId),
          eq(zakatPayments.status, "scheduled"),
          gte(zakatPayments.dueDate, now)
        )
      )
      .orderBy(zakatPayments.dueDate);
  }

  async getOverduePayments(userId: string): Promise<ZakatPayment[]> {
    const now = new Date();
    return await db
      .select()
      .from(zakatPayments)
      .where(
        and(
          eq(zakatPayments.userId, userId),
          eq(zakatPayments.status, "scheduled"),
          lte(zakatPayments.dueDate, now)
        )
      )
      .orderBy(zakatPayments.dueDate);
  }

  // Infaq & Shadaqoh
  async createInfaqShadaqoh(infaq: InsertInfaqShadaqoh): Promise<InfaqShadaqoh> {
    const [result] = await db.insert(infaqShadaqoh).values(infaq).returning();
    return result;
  }

  async getInfaqShadaqohByUser(userId: string): Promise<InfaqShadaqoh[]> {
    return await db
      .select()
      .from(infaqShadaqoh)
      .where(eq(infaqShadaqoh.userId, userId))
      .orderBy(desc(infaqShadaqoh.date));
  }

  async getRecentInfaqShadaqoh(userId: string, limit: number = 10): Promise<InfaqShadaqoh[]> {
    return await db
      .select()
      .from(infaqShadaqoh)
      .where(eq(infaqShadaqoh.userId, userId))
      .orderBy(desc(infaqShadaqoh.date))
      .limit(limit);
  }

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [result] = await db.insert(notifications).values(notification).returning();
    return result;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      );
    return result?.count || 0;
  }

  // Notification settings
  async createOrUpdateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    const [result] = await db
      .insert(notificationSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: notificationSettings.userId,
        set: settings,
      })
      .returning();
    return result;
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings | undefined> {
    const [result] = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId));
    return result || undefined;
  }

  // Statistics
  async getYearlyZakatTotal(userId: string, year: number): Promise<number> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const [result] = await db
      .select({ total: sum(zakatPayments.amount) })
      .from(zakatPayments)
      .where(
        and(
          eq(zakatPayments.userId, userId),
          eq(zakatPayments.status, "paid"),
          gte(zakatPayments.paidDate, startDate),
          lte(zakatPayments.paidDate, endDate)
        )
      );
    
    return Number(result?.total || 0);
  }

  async getYearlyInfaqTotal(userId: string, year: number): Promise<number> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const [result] = await db
      .select({ total: sum(infaqShadaqoh.amount) })
      .from(infaqShadaqoh)
      .where(
        and(
          eq(infaqShadaqoh.userId, userId),
          gte(infaqShadaqoh.date, startDate),
          lte(infaqShadaqoh.date, endDate)
        )
      );
    
    return Number(result?.total || 0);
  }

  async getTransactionsByUser(userId: string, year?: number): Promise<Array<ZakatPayment | InfaqShadaqoh>> {
    const transactions: Array<ZakatPayment | InfaqShadaqoh> = [];

    let zakatQuery = db
      .select()
      .from(zakatPayments)
      .where(eq(zakatPayments.userId, userId));

    let infaqQuery = db
      .select()
      .from(infaqShadaqoh)
      .where(eq(infaqShadaqoh.userId, userId));

    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      
      zakatQuery = zakatQuery.where(
        and(
          eq(zakatPayments.userId, userId),
          gte(zakatPayments.createdAt, startDate),
          lte(zakatPayments.createdAt, endDate)
        )
      );

      infaqQuery = infaqQuery.where(
        and(
          eq(infaqShadaqoh.userId, userId),
          gte(infaqShadaqoh.date, startDate),
          lte(infaqShadaqoh.date, endDate)
        )
      );
    }

    const [zakatResults, infaqResults] = await Promise.all([
      zakatQuery,
      infaqQuery
    ]);

    transactions.push(...zakatResults, ...infaqResults);
    return transactions.sort((a, b) => {
      const dateA = 'paidDate' in a ? a.paidDate || a.createdAt : a.date;
      const dateB = 'paidDate' in b ? b.paidDate || b.createdAt : b.date;
      return new Date(dateB!).getTime() - new Date(dateA!).getTime();
    });
  }
}

export const storage = new DatabaseStorage();