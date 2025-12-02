import { ENDPOINTS } from "../config/api";
import { apiRequest } from "./client";

export function confirmCheckout(reservationId) {
  return apiRequest(ENDPOINTS.CHECKOUT, {
    method: "POST",
    body: JSON.stringify({ reservationId })
  });
}
