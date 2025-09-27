import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, 
  },
  synchronize: false, 
  logging: true,
  entities: [],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});