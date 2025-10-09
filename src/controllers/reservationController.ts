import { Request, Response } from "express";
import { ReservationService } from "../services/reservationService.js";

export class ReservationController {
  private reservationService: ReservationService;

  constructor(reservationService: ReservationService) {
    this.reservationService = reservationService;
  }

  // POST /stock/reservar
  createReservation = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservation = await this.reservationService.createReservation(req.body);
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error al crear reserva' 
      });
    }
  };

  // POST /stock/liberar
  releaseReservation = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.reservationService.releaseReservation(req.body);
      res.status(200).json({ message: 'Stock liberado correctamente' });
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error al liberar stock' 
      });
    }
  };

  // GET /reservas?userId=X&status=Y
  getUserReservations = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.query.userId as string);
      const status = req.query.status as string | undefined;

      // Validar que userId sea un número válido
      if (!req.query.userId || isNaN(userId)) {
        res.status(400).json({ error: 'userId es requerido y debe ser un número válido' });
        return;
      }

      const reservations = await this.reservationService.getUserReservations(userId, status);
      res.status(200).json(reservations);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Error al obtener reservas' 
      });
    }
  };

  // GET /reservas/:idReserva?userId=X
  getReservationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservationId = parseInt(req.params.idReserva);
      const userId = parseInt(req.query.userId as string);

      // Validar que ambos IDs sean números válidos
      if (isNaN(reservationId)) {
        res.status(400).json({ error: 'idReserva debe ser un número válido' });
        return;
      }

      if (!req.query.userId || isNaN(userId)) {
        res.status(400).json({ error: 'userId es requerido y debe ser un número válido' });
        return;
      }

      const reservation = await this.reservationService.getReservationById(reservationId, userId);

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
  updateReservationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservationId = parseInt(req.params.idReserva);
      const { userId, status } = req.body;

      // Validar que reservationId sea válido
      if (isNaN(reservationId)) {
        res.status(400).json({ error: 'idReserva debe ser un número válido' });
        return;
      }

      // Validar que userId sea un número válido
      if (!userId || isNaN(parseInt(userId))) {
        res.status(400).json({ error: 'userId debe ser un número válido' });
        return;
      }

      if (!status) {
        res.status(400).json({ error: 'status es requerido' });
        return;
      }

      const reservation = await this.reservationService.updateReservationStatus(
        reservationId, 
        parseInt(userId), 
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