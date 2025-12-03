import { api } from "./api";

export const PurchasesAPI = {
  getByUser: (userId: number) => api.get(`/purchases/${userId}`),
};
