export interface ReservationItem {
  productId: number;
  quantity: number;
}

export interface Reservation {
  id: number;
  userId: number;
  items: ReservationItem[];
  status: 'pendiente' | 'confirmado' | 'cancelado';
  createdAt: Date;
  expiresAt: Date;
}

export interface ReservationInput {
  userId: number;
  items: ReservationItem[];
}

export interface ReservationOutput {
  id: number;
  userId: number;
  items: ReservationItem[];
  status: 'pendiente' | 'confirmado' | 'cancelado';
  createdAt: string;
  expiresAt: string;
}

export interface LiberacionInput {
  reservationId: number;
  userId: number;
}