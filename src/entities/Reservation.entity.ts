// src/entities/Reservation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { ReservationItem } from "./ReservationItem.entity";

// Importar todas las interfaces necesarias
import { IReservationItem, ICreateReservationItem } from "./ReservationItem.entity";

export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED'
}

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'user_id', type: 'int' })
    userId!: number;

    @Column({ 
        type: 'enum', 
        enum: ReservationStatus, 
        default: ReservationStatus.PENDING 
    })
    status!: ReservationStatus;

    @CreateDateColumn({ name: 'reservation_date' })
    reservationDate!: Date;

    @Column({ name: 'total_quantity', type: 'int' })
    totalQuantity!: number;

    @OneToMany(() => ReservationItem, (reservationItem:ReservationItem) => reservationItem.reservation)
    items!: ReservationItem[];
}

// TypeScript Interfaces
export interface IReservation {
    id: number;
    userId: number;
    status: ReservationStatus;
    reservationDate: Date;
    totalQuantity: number;
    items: IReservationItem[];
}

export interface ICreateReservation {
    userId: number;
    items: ICreateReservationItem[];
}

export interface IUpdateReservation {
    status?: ReservationStatus;
}