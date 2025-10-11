//Cambio de MYSLQ --> SQLlite

import { DataSource } from "typeorm";
import { Product } from "../core/entities/Product.js";
import { Category } from "../core/entities/Category.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "tpi-ds-g5.sqlite",
  entities: [Product, Category],
  synchronize: true,
  logging: true,
});