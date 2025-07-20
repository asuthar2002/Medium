import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: 'mysql',
        // logging: false, 
        logging: console.log,
    }
);
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Sequelize connected to MySQL');
    } catch (err) {
        console.error('DB connection failed:', err.message);
        process.exit(1);
    }
};
