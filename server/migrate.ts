import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Fix for ESM modules (no __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('🚀 Starting database migration...');

    try {
        // Create database if not exists
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: Number(process.env.DB_PORT) || 3306,
        });

        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'zakat_tracker'};`);
        await tempConnection.end();
        console.log(`✅ Database ${process.env.DB_NAME || 'zakat_tracker'} created or already exists`);

        // Connect to the database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'zakat_tracker',
            port: Number(process.env.DB_PORT) || 3306,
            multipleStatements: true,
        });

        const db = drizzle(connection);

        // Get migration directory
        const migrationsFolder = path.join(__dirname, '../drizzle');

        // Check if migrations folder exists
        if (!fs.existsSync(migrationsFolder)) {
            console.error('❌ Migration folder not found. Run "npm run db:generate" first.');
            process.exit(1);
        }

        // Run migrations
        console.log('⏳ Running migrations...');
        await migrate(db, { migrationsFolder });
        console.log('✅ Migrations completed successfully!');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

main(); 