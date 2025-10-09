import type { Reservation, ReservationInput, ReservationOutput, LiberacionInput } from "../types/reservation.js";
import { ProductService } from "./productServices.js";

export class ReservationService {
  private reservations: Reservation[] = [];
  private nextId = 1;
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  createReservation(input: ReservationInput): ReservationOutput {
    // Verificar disponibilidad de stock
    for (const item of input.items) {
      const product = this.productService.findProductById(item.productId);
      if (!product) {
        throw new Error(`Producto ${item.productId} no encontrado`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para producto ${product.name}`);
      }
    }

    // Crear la reserva
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas

    const reservation: Reservation = {
      id: this.nextId++,
      userId: input.userId,
      items: input.items,
      status: 'pendiente',
      createdAt: now,
      expiresAt: expiresAt
    };

    // Reducir stock (reservar)
    for (const item of input.items) {
      const product = this.productService.findProductById(item.productId);
      if (product) {
        product.stock -= item.quantity;
      }
    }

    this.reservations.push(reservation);

    return {
      id: reservation.id,
      userId: reservation.userId,
      items: reservation.items,
      status: reservation.status,
      createdAt: reservation.createdAt.toISOString(),
      expiresAt: reservation.expiresAt.toISOString()
    };
  }

  releaseReservation(input: LiberacionInput): void {
    const reservation = this.reservations.find(
      r => r.id === input.reservationId && r.userId === input.userId
    );

    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    if (reservation.status !== 'pendiente') {
      throw new Error('La reserva ya fue procesada');
    }

    // Devolver stock
    for (const item of reservation.items) {
      const product = this.productService.findProductById(item.productId);
      if (product) {
        product.stock += item.quantity;
      }
    }

    reservation.status = 'cancelado';
  }

  getUserReservations(userId: number, status?: string): Reservation[] {
    let userReservations = this.reservations.filter(r => r.userId === userId);

    if (status) {
      userReservations = userReservations.filter(r => r.status === status);
    }

    return userReservations;
  }

  getReservationById(reservationId: number, userId: number): Reservation | null {
    const reservation = this.reservations.find(
      r => r.id === reservationId && r.userId === userId
    );

    return reservation || null;
  }

  updateReservationStatus(reservationId: number, userId: number, status: 'confirmado' | 'cancelado'): Reservation {
    const reservation = this.reservations.find(
      r => r.id === reservationId && r.userId === userId
    );

    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }

    if (reservation.status !== 'pendiente') {
      throw new Error('La reserva ya fue procesada');
    }

    if (status === 'cancelado') {
      // Devolver stock
      for (const item of reservation.items) {
        const product = this.productService.findProductById(item.productId);
        if (product) {
          product.stock += item.quantity;
        }
      }
    }

    reservation.status = status;
    return reservation;
  }
}