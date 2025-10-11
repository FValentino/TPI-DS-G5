import "reflect-metadata";

import express from 'express';
import { AppDataSource } from './config/appDataSource.js';
import mainRouter from './api/routes/index.js';

const app = express();

// Middleware para que Express entienda JSON en el body de las peticiones
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/v1', mainRouter);

// Función principal para iniciar el servidor
const main = async () => {
  try {
    // Inicia la conexión con la base de datos
    await AppDataSource.initialize();
    console.log("Base de datos conectada correctamente.");

    // Una vez conectada la DB, inicia el servidor de Express
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
  }
};

main();