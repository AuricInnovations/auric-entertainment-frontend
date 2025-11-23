// src/lib/api.ts

// A typed error we throw when the backend returns 4xx / 5xx
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// In dev we always go through the Vite proxy at /api
const BASE = "/api";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("auric_jwt");
  const headers = new Headers(init.headers || {});

  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Only set JSON for non-GET requests
  if (!headers.has("Content-Type") && init.method && init.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    credentials: "omit",
  });

  if (!res.ok) {
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // response body not JSON, ignore
    }

    const msg =
      (data && (data.message || data.error || data.details)) ||
      `Request failed with status ${res.status}`;

    throw new ApiError(res.status, msg, data);
  }

  return res;
}

/** ===== TICKET TYPE TYPES & HELPERS ===== */

export type TicketTypeResponse = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  capacity: number;
  unitSize?: number | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
};

export type UpsertTicketTypeRequest = {
  name: string;
  description?: string | null;
  price: number;
  capacity: number;
  unitSize?: number | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
};

// Admin: list ticket types
export async function adminGetTicketTypes(
  eventId: number
): Promise<TicketTypeResponse[]> {
  const res = await apiFetch(`/admin/events/${eventId}/ticket-types`);
  return res.json();
}

// Admin: create
export async function adminCreateTicketType(
  eventId: number,
  payload: UpsertTicketTypeRequest
): Promise<TicketTypeResponse> {
  const res = await apiFetch(`/admin/events/${eventId}/ticket-types`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
}

// Admin: update
export async function adminUpdateTicketType(
  eventId: number,
  id: number,
  payload: UpsertTicketTypeRequest
): Promise<TicketTypeResponse> {
  const res = await apiFetch(`/admin/events/${eventId}/ticket-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res.json();
}

// Admin: delete
export async function adminDeleteTicketType(
  eventId: number,
  id: number
): Promise<void> {
  await apiFetch(`/admin/events/${eventId}/ticket-types/${id}`, {
    method: "DELETE",
  });
}

// Public: list ticket types for booking
export async function publicGetTicketTypes(
  eventId: number
): Promise<TicketTypeResponse[]> {
  const res = await apiFetch(`/events/${eventId}/tickets`);
  return res.json();
}

/** ===== BOOKING TYPES & HELPERS ===== */

export type BookingResponse = {
  id: number;
  eventId: number;
  eventTitle: string;
  ticketTypeId: number | null;
  ticketTypeName: string | null;
  fullName: string;
  email: string;
  phone: string;
  tickets: number;
  status: string;
};

export type TicketAvailabilityResponse = {
  ticketTypeId: number;
  ticketTypeName: string;
  capacity: number;
  confirmed: number;
  held: number;
  available: number;
};

export type BookingPage = {
  content: BookingResponse[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index (0-based)
  size: number;   // page size
};

// Admin: list bookings (optional event filter)
export async function adminListBookings(params?: {
  eventId?: number;
  page?: number;
  size?: number;
}): Promise<BookingPage> {
  const searchParams = new URLSearchParams();
  if (params?.eventId != null) searchParams.set("eventId", String(params.eventId));
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.size != null) searchParams.set("size", String(params.size));

  const qs = searchParams.toString();
  const res = await apiFetch(`/admin/bookings${qs ? "?" + qs : ""}`);
  return res.json(); // Spring Data Page JSON includes size, totalElements, etc.
}

// Admin: confirm a booking
export async function adminConfirmBooking(
  bookingId: number
): Promise<BookingResponse> {
  const res = await apiFetch(`/admin/bookings/${bookingId}/confirm`, {
    method: "PATCH",
  });
  return res.json();
}

// Public: availability per ticket type for an event
export async function getEventAvailability(
  eventId: number
): Promise<TicketAvailabilityResponse[]> {
  const res = await apiFetch(`/events/${eventId}/availability`);
  return res.json();
}