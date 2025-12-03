import { api } from "./api";

export const ReservationsAPI = {
  create: (data: any) => api.post("/reservations", data),

  getByUser: (userId: number) => api.get(`/reservations/user/${userId}`),

  cancel: (id: number) => api.delete(`/reservations/${id}`),
};
