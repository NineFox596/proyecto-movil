import { api } from "../api";
import { CheckoutRequest, CheckoutResponse } from "../types";

// POST /checkout → confirmar reserva y generar compra
export async function checkout(body: CheckoutRequest): Promise<CheckoutResponse> {
  const res = await api.post<CheckoutResponse>("/checkout", body);
  return res.data;
}

// GET /purchases/{purchase_id} → obtener información de la compra
export async function getPurchase(purchase_id: string): Promise<CheckoutResponse> {
  const res = await api.get<CheckoutResponse>(`/purchases/${purchase_id}`);
  return res.data;
}
