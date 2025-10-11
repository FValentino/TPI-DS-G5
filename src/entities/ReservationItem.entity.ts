// src/entities/ReservationItem.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Reservation } from "./Reservation.entity";
import { Product } from "./Product.entity";

// Importar las interfaces necesarias
import { IProduct } from "./Product.entity";
import { IReservation } from "./Reservation.entity";

@Entity('reservation_items')
export class ReservationItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'reservation_id', type: 'int' })
    reservationId!: number;

    @Column({ name: 'product_id', type: 'int' })
    productId!: number;

    @Column({ name: 'reserved_quantity', type: 'int' })
    reservedQuantity!: number;

    @ManyToOne(() => Reservation, (reservation:Reservation) => reservation.items)
    @JoinColumn({ name: 'reservation_id' })
    reservation!: Reservation;

    @ManyToOne(() => Product, (product:Product) => product.reservationItems)
    @JoinColumn({ name: 'product_id' })
    product!: Product;
}

// TypeScript Interfaces
export interface IReservationItem {
    id: number;
    reservationId: number;
    productId: number;
    reservedQuantity: number;
    reservation?: IReservation;
    product?: IProduct;
}

export interface ICreateReservationItem {
    productId: number;
    reservedQuantity: number;
}