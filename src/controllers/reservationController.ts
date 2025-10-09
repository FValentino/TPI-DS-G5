import { Request, Response } from "express";
import { ReservationService } from "../services/reservationService.js";

export class ReservationController {
  private reservationService: ReservationService;

  constructor(reservationService: ReservationService) {
    this.reservationService = reservationService;
  }

  // POST /stock/reservar
  createReservation = (req: Request, res: Response): void => {
    try {
      const reservation = this.reservationService.createReservation(req.body);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error al crear reserva' 
      });
    }
  };

  // POST /stock/liberar
  releaseReservation = (req: Request, res: Response): void => {
    try {
      this.reservationService.releaseReservation(req.body);
      res.status(200).json({ message: 'Stock liberado correctamente' });
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error al liberar stock' 
      });
    }
  };

  // GET /reservas?userId=X&status=Y
  getUserReservations = (req: Request, res: Response): void => {
    try {
      const userId = parseInt(req.query.userId as string);
      const status = req.query.status as string | undefined;

      if (!userId) {
        res.status(400).json({ error: 'userId es requerido' });
        return;
      }

      const reservations = this.reservationService.getUserReservations(userId, status);
      res.status(200).json(reservations);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error al obtener reservas' 
      });
    }
  };

  // GET /reservas/:idReserva?userId=X
  getReservationById = (req: Request, res: Response): void => {
    try {
      const reservationId = parseInt(req.params.idReserva);
      const userId = parseInt(req.query.userId as string);

      if (!userId) {
        res.status(400).json({ error: 'userId es requerido' });
        return;
      }

      const reservation = this.reservationService.getReservationById(reservationId, userId);

      if (!reservation) {
        res.status(404).json({ error: 'Reserva no encontrada' });
        return;
      }

      res.status(200).json(reservation);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error al obtener reserva' 
      });
    }
  };

  // PATCH /reservas/:idReserva
  updateReservationStatus = (req: Request, res: Response): void => {
    try {
      const reservationId = parseInt(req.params.idReserva);
      const { userId, status } = req.body;

      if (!userId || !status) {
        res.status(400).json({ error: 'userId y status son requeridos' });
        return;
      }

      const reservation = this.reservationService.updateReservationStatus(
        reservationId, 
        userId, 
        status
      );

      res.status(200).json(reservation);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error al actualizar reserva' 
      });
    }
  };
}