import { ENDPOINTS } from "../config/api";
import { apiRequest } from "./client";

export function createReservation(payload) {
  return apiRequest(ENDPOINTS.RESERVATIONS, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
