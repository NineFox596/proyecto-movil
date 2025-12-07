import { api } from "../api";
import {
  Reservation,
  CreateReservationRequest,
  CreateReservationResponse,
} from "../types";

// POST /reservations → crear reserva
export async function createReservation(
  body: CreateReservationRequest
): Promise<CreateReservationResponse> {
  const res = await api.post<CreateReservationResponse>("/reservations", body);
  return res.data;
}

// GET /reservations/{res_id} → consultar reserva
export async function getReservation(res_id: string): Promise<Reservation> {
  const res = await api.get<Reservation>(`/reservations/${res_id}`);
  return res.data;
}

// DELETE /reservations/{res_id} → cancelar reserva
export async function cancelReservation(res_id: string): Promise<void> {
  await api.delete(`/reservations/${res_id}`);
}
