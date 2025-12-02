import { ENDPOINTS } from "../config/api";
import { apiRequest } from "./client";

export function getEvents() {
  return apiRequest(ENDPOINTS.EVENTS);
}

export function getEventById(id) {
  return apiRequest(`${ENDPOINTS.EVENTS}/${id}`);
}
