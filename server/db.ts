import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export pool untuk penggunaan raw query
export default pool;

// Export db untuk penggunaan dengan drizzle ORM
export const db = drizzle(pool);

// Fungsi untuk mengecek koneksi database
export async function testConnection() {
  try {
    const [result] = await pool.query('SELECT 1 as test');
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}

// Fungsi untuk menjalankan query raw SQL
export async function executeRawQuery(query: string, params: any[] = []) {
  try {
    const [result] = await pool.query(query, params);
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}
