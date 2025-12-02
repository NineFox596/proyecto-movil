import { useEffect, useState } from "react";
import { getEvents } from "../api/events";

export function useEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
  }, []);

  return events;
}
