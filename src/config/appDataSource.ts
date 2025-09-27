import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import dns from "dns";
import { Product } from "../models/products.js";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, 
  },
  synchronize: true, 
  logging: true,
  entities: [Product],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});