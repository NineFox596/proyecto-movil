import { ENDPOINTS } from "../config/api";
import { apiRequest } from "./client";

export function getPurchases() {
  return apiRequest(ENDPOINTS.PURCHASES);
}
