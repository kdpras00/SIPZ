import { 
  users, 
  zakatCalculations, 
  zakatPayments, 
  infaqShadaqoh, 
  notifications, 
  notificationSettings,
  type User, 
  type InsertUser,
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

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Zakat calculations
  createZakatCalculation(calculation: InsertZakatCalculation): Promise<ZakatCalculation>;
  getZakatCalculationsByUser(userId: number): Promise<ZakatCalculation[]>;
  getZakatCalculation(id: number): Promise<ZakatCalculation | undefined>;

  // Zakat payments
  createZakatPayment(payment: InsertZakatPayment): Promise<ZakatPayment>;
  getZakatPaymentsByUser(userId: number): Promise<ZakatPayment[]>;
  updateZakatPayment(id: number, updates: Partial<ZakatPayment>): Promise<ZakatPayment | undefined>;
  getUpcomingPayments(userId: number): Promise<ZakatPayment[]>;
  getOverduePayments(userId: number): Promise<ZakatPayment[]>;

  // Infaq & Shadaqoh
  createInfaqShadaqoh(infaq: InsertInfaqShadaqoh): Promise<InfaqShadaqoh>;
  getInfaqShadaqohByUser(userId: number): Promise<InfaqShadaqoh[]>;
  getRecentInfaqShadaqoh(userId: number, limit?: number): Promise<InfaqShadaqoh[]>;

  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;
  getUnreadNotificationCount(userId: number): Promise<number>;

  // Notification settings
  createOrUpdateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
  getNotificationSettings(userId: number): Promise<NotificationSettings | undefined>;

  // Statistics
  getYearlyZakatTotal(userId: number, year: number): Promise<number>;
  getYearlyInfaqTotal(userId: number, year: number): Promise<number>;
  getTransactionsByUser(userId: number, year?: number): Promise<Array<ZakatPayment | InfaqShadaqoh>>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private zakatCalculations: Map<number, ZakatCalculation>;
  private zakatPayments: Map<number, ZakatPayment>;
  private infaqShadaqoh: Map<number, InfaqShadaqoh>;
  private notifications: Map<number, Notification>;
  private notificationSettings: Map<number, NotificationSettings>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.zakatCalculations = new Map();
    this.zakatPayments = new Map();
    this.infaqShadaqoh = new Map();
    this.notifications = new Map();
    this.notificationSettings = new Map();
    this.currentId = 1;

    // Create default user
    this.createUser({
      username: "ahmad",
      password: "password",
      email: "ahmad.rahman@email.com",
      name: "Ahmad Rahman"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createZakatCalculation(calculation: InsertZakatCalculation): Promise<ZakatCalculation> {
    const id = this.currentId++;
    const zakatCalc: ZakatCalculation = { 
      ...calculation, 
      id, 
      createdAt: new Date() 
    };
    this.zakatCalculations.set(id, zakatCalc);
    return zakatCalc;
  }

  async getZakatCalculationsByUser(userId: number): Promise<ZakatCalculation[]> {
    return Array.from(this.zakatCalculations.values())
      .filter(calc => calc.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getZakatCalculation(id: number): Promise<ZakatCalculation | undefined> {
    return this.zakatCalculations.get(id);
  }

  async createZakatPayment(payment: InsertZakatPayment): Promise<ZakatPayment> {
    const id = this.currentId++;
    const zakatPayment: ZakatPayment = { 
      ...payment, 
      id, 
      createdAt: new Date() 
    };
    this.zakatPayments.set(id, zakatPayment);
    return zakatPayment;
  }

  async getZakatPaymentsByUser(userId: number): Promise<ZakatPayment[]> {
    return Array.from(this.zakatPayments.values())
      .filter(payment => payment.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateZakatPayment(id: number, updates: Partial<ZakatPayment>): Promise<ZakatPayment | undefined> {
    const payment = this.zakatPayments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...updates };
    this.zakatPayments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getUpcomingPayments(userId: number): Promise<ZakatPayment[]> {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return Array.from(this.zakatPayments.values())
      .filter(payment => 
        payment.userId === userId && 
        payment.status === 'scheduled' &&
        payment.dueDate &&
        new Date(payment.dueDate) <= oneWeekFromNow
      )
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  }

  async getOverduePayments(userId: number): Promise<ZakatPayment[]> {
    const now = new Date();
    
    return Array.from(this.zakatPayments.values())
      .filter(payment => 
        payment.userId === userId && 
        payment.status === 'scheduled' &&
        payment.dueDate &&
        new Date(payment.dueDate) < now
      );
  }

  async createInfaqShadaqoh(infaq: InsertInfaqShadaqoh): Promise<InfaqShadaqoh> {
    const id = this.currentId++;
    const infaqRecord: InfaqShadaqoh = { 
      ...infaq, 
      id, 
      createdAt: new Date() 
    };
    this.infaqShadaqoh.set(id, infaqRecord);
    return infaqRecord;
  }

  async getInfaqShadaqohByUser(userId: number): Promise<InfaqShadaqoh[]> {
    return Array.from(this.infaqShadaqoh.values())
      .filter(infaq => infaq.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getRecentInfaqShadaqoh(userId: number, limit: number = 5): Promise<InfaqShadaqoh[]> {
    const allInfaq = await this.getInfaqShadaqohByUser(userId);
    return allInfaq.slice(0, limit);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentId++;
    const notif: Notification = { 
      ...notification, 
      id, 
      createdAt: new Date() 
    };
    this.notifications.set(id, notif);
    return notif;
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      this.notifications.set(id, { ...notification, isRead: true });
    }
  }

  async getUnreadNotificationCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId && !notif.isRead).length;
  }

  async createOrUpdateNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    const existing = Array.from(this.notificationSettings.values())
      .find(s => s.userId === settings.userId);
    
    if (existing) {
      const id = existing.id;
      const updated: NotificationSettings = { ...existing, ...settings };
      this.notificationSettings.set(id, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const newSettings: NotificationSettings = { ...settings, id };
      this.notificationSettings.set(id, newSettings);
      return newSettings;
    }
  }

  async getNotificationSettings(userId: number): Promise<NotificationSettings | undefined> {
    return Array.from(this.notificationSettings.values())
      .find(settings => settings.userId === userId);
  }

  async getYearlyZakatTotal(userId: number, year: number): Promise<number> {
    const payments = Array.from(this.zakatPayments.values())
      .filter(payment => 
        payment.userId === userId && 
        payment.status === 'paid' &&
        payment.paidDate &&
        new Date(payment.paidDate).getFullYear() === year
      );
    
    return payments.reduce((total, payment) => total + Number(payment.amount), 0);
  }

  async getYearlyInfaqTotal(userId: number, year: number): Promise<number> {
    const infaqRecords = Array.from(this.infaqShadaqoh.values())
      .filter(infaq => 
        infaq.userId === userId && 
        new Date(infaq.date).getFullYear() === year
      );
    
    return infaqRecords.reduce((total, infaq) => total + Number(infaq.amount), 0);
  }

  async getTransactionsByUser(userId: number, year?: number): Promise<Array<ZakatPayment | InfaqShadaqoh>> {
    const payments = Array.from(this.zakatPayments.values())
      .filter(payment => payment.userId === userId)
      .filter(payment => !year || (payment.paidDate && new Date(payment.paidDate).getFullYear() === year));
    
    const infaqRecords = Array.from(this.infaqShadaqoh.values())
      .filter(infaq => infaq.userId === userId)
      .filter(infaq => !year || new Date(infaq.date).getFullYear() === year);
    
    const allTransactions = [...payments, ...infaqRecords];
    
    return allTransactions.sort((a, b) => {
      const dateA = 'paidDate' in a ? (a.paidDate || a.createdAt) : a.date;
      const dateB = 'paidDate' in b ? (b.paidDate || b.createdAt) : b.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }
}

export const storage = new MemStorage();
