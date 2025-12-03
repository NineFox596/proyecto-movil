import { api } from "./api";

export const EventsAPI = {
  getAll: () => api.get("/events"),

  getById: (id: number) => api.get(`/events/${id}`),

  getByCategory: (category: string) =>
    api.get(`/events?category=${category}`),
};
