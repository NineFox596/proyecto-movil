import { api } from "../api";
import { Event, EventsResponse, EventQuery } from "../types";

// GET /events → lista eventos con filtros y paginación
export async function getEvents(query?: EventQuery): Promise<EventsResponse> {
  const params = query || {};
  const res = await api.get<EventsResponse>("/events", { params });
  return res.data;
}

// GET /events/{event_id} → obtener un evento por ID
export async function getEvent(event_id: string): Promise<Event> {
  const res = await api.get<Event>(`/events/${event_id}`);
  return res.data;
}

// POST /events → crear un evento
export async function createEvent(event: Partial<Event>): Promise<Event> {
  const res = await api.post<Event>("/events", event);
  return res.data;
}

// PATCH /events/{event_id} → actualizar evento
export async function updateEvent(event_id: string, data: Partial<Event>): Promise<{ updated: boolean }> {
  const res = await api.patch(`/events/${event_id}`, data);
  return res.data;
}

// DELETE /events/{event_id} → eliminar evento
export async function deleteEvent(event_id: string): Promise<void> {
  await api.delete(`/events/${event_id}`);
}
