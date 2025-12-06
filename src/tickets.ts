import api from "./client";
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL as string;
export async function getTickets() {
  const res = await api.get("/tickets");
  return res.data;
}
