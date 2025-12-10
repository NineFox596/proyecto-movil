import api from "./client";

export async function getTickets() {
  const res = await api.get("/tickets");
  return res.data;
}
