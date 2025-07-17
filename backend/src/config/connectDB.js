import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
let db;
export const connectDB = async () => {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('MySQL connected successfully');
        await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isVerified BOOLEAN DEFAULT false,
        role VARCHAR(20) DEFAULT 'user',
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('`users` table checked/created');
        return db;
    } catch (error) {
        console.error(' MySQL connection failed:', error.message);
        process.exit(1);
    }
};

export const getDB = () => db;
