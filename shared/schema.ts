import { pgTable, text, serial, integer, decimal, timestamp, boolean, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const zakatCalculations = pgTable("zakat_calculations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'penghasilan', 'emas', 'perdagangan', 'pertanian'
  monthlyIncome: decimal("monthly_income", { precision: 15, scale: 2 }),
  yearlyIncome: decimal("yearly_income", { precision: 15, scale: 2 }),
  debt: decimal("debt", { precision: 15, scale: 2 }),
  goldWeight: decimal("gold_weight", { precision: 10, scale: 3 }),
  goldPrice: decimal("gold_price", { precision: 15, scale: 2 }),
  silverWeight: decimal("silver_weight", { precision: 10, scale: 3 }),
  silverPrice: decimal("silver_price", { precision: 15, scale: 2 }),
  businessAssets: decimal("business_assets", { precision: 15, scale: 2 }),
  farmOutput: decimal("farm_output", { precision: 15, scale: 2 }),
  irrigationType: text("irrigation_type"), // 'natural', 'artificial'
  zakatAmount: decimal("zakat_amount", { precision: 15, scale: 2 }).notNull(),
  isWajib: boolean("is_wajib").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const zakatPayments = pgTable("zakat_payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  calculationId: integer("calculation_id"),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  recipient: text("recipient"),
  status: text("status").notNull().default("scheduled"), // 'scheduled', 'paid', 'overdue'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const infaqShadaqoh = pgTable("infaq_shadaqoh", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'infaq', 'shadaqoh', 'wakaf', 'fidyah', 'other'
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  recipient: text("recipient").notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'zakat_reminder', 'infaq_reminder', 'payment_overdue'
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  yearlyReminderEnabled: boolean("yearly_reminder_enabled").notNull().default(true),
  yearlyReminderDays: integer("yearly_reminder_days").notNull().default(30),
  yearlyReminderMonth: text("yearly_reminder_month").notNull().default("ramadhan"),
  monthlyReminderEnabled: boolean("monthly_reminder_enabled").notNull().default(false),
  monthlyReminderDate: integer("monthly_reminder_date").notNull().default(1),
  monthlyReminderAmount: decimal("monthly_reminder_amount", { precision: 15, scale: 2 }),
  emailNotificationEnabled: boolean("email_notification_enabled").notNull().default(true),
  email: text("email"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertZakatCalculationSchema = createInsertSchema(zakatCalculations).omit({
  id: true,
  createdAt: true,
});

export const insertZakatPaymentSchema = createInsertSchema(zakatPayments).omit({
  id: true,
  createdAt: true,
});

export const insertInfaqShadaqohSchema = createInsertSchema(infaqShadaqoh).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).omit({
  id: true,
});

// Types for Replit Auth
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ZakatCalculation = typeof zakatCalculations.$inferSelect;
export type InsertZakatCalculation = z.infer<typeof insertZakatCalculationSchema>;
export type ZakatPayment = typeof zakatPayments.$inferSelect;
export type InsertZakatPayment = z.infer<typeof insertZakatPaymentSchema>;
export type InfaqShadaqoh = typeof infaqShadaqoh.$inferSelect;
export type InsertInfaqShadaqoh = z.infer<typeof insertInfaqShadaqohSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;
