import express from 'express';
import { ProductController } from './controllers/productController.js';
import { ReservationController } from './controllers/reservationController.js';
import { ProductService } from './services/productServices.js';
import { ReservationService } from './services/reservationService.js';

const app = express();
app.use(express.json());

// Inicializar servicios
const productService = new ProductService();
const reservationService = new ReservationService(productService);

// Inicializar controladores
const productController = new ProductController(productService);
const reservationController = new ReservationController(reservationService);

// ===== RUTAS DE PRODUCTOS =====
app.get('/v1/productos', productController.getAllProducts);
app.get('/v1/productos/:productoId', productController.getProductById);
app.post('/v1/productos', productController.createProduct);
app.patch('/v1/productos/:productoId', productController.updateProduct);
app.delete('/v1/productos/:productoId', productController.deleteProduct);

// ===== RUTAS DE STOCK/RESERVAS =====
app.post('/v1/stock/reservar', reservationController.createReservation);
app.post('/v1/stock/liberar', reservationController.releaseReservation);

// ===== RUTAS DE RESERVAS DE USUARIO =====
app.get('/v1/reservas', reservationController.getUserReservations);
app.get('/v1/reservas/:idReserva', reservationController.getReservationById);
app.patch('/v1/reservas/:idReserva', reservationController.updateReservationStatus);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;