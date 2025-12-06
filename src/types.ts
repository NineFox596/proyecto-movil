// ==============================
// Event & Ticket Types
// ==============================
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL as string;

export interface TicketType {
  type: string;
  price: number;
  available: number;
}

export interface Event {
  _id: string;
  name: string;
  category: string;
  date: string; // ISO date string
  location: string;
  image: string;
  tickets: TicketType[];
}

// Respuesta de GET /events
export interface EventsResponse {
  data: Event[];
  page: number;
  limit: number;
  total: number;
}

// Query params opcionales para /events
export interface EventQuery {
  q?: string;
  category?: string;
  sort?: string; // "date", "-date", "category", "-category"
  limit?: number;
  page?: number;
}

// ==============================
// Reservation Types
// ==============================

export interface ReservationItem {
  type: string;
  quantity: number;
}

export interface Reservation {
  _id: string;
  event_id: string;
  items: ReservationItem[];
  total_price: number;
  status: "PENDING" | "EXPIRED" | "CONFIRMED";
  created_at: string;
  expires_at: string;
}

// Create Reservation (POST /reservations)
export interface CreateReservationRequest {
  event_id: string;
  items: ReservationItem[];
}

export interface CreateReservationResponse {
  reservation_id: string;
  expires_at: string;
  total_price: number;
  status: string;
}

// ==============================
// Purchase Types (Checkout)
// ==============================

export interface Buyer {
  name: string;
  email: string;
}

export interface PurchaseTicket {
  code: string;
  type: string;
}

export interface Purchase {
  _id: string;
  reservation_id?: string;
  event_id: string;
  tickets: PurchaseTicket[];
  buyer: Buyer;
  total_price: number;
  confirmed_at: string;
}

// Checkout (POST /checkout)
export interface CheckoutRequest {
  reservation_id: string;
  buyer: Buyer;
}

export interface CheckoutResponse extends Purchase {}
