// src/lib/WhatsAppService.ts

export type BookingWhatsAppData = {
  phone: string;

  eventTitle: string;
  dateTimeLabel?: string;
  bookingId?: number | string;

  ticketLabel: string;
  tickets: number;

  fullName: string;
  email?: string;
  customerPhone?: string;
};

export class WhatsAppService {
  static openBookingMessage(data: BookingWhatsAppData) {
    const {
      phone,
      eventTitle,
      dateTimeLabel,
      bookingId,
      ticketLabel,
      tickets,
      fullName,
      email,
      customerPhone,
    } = data;

    const lines: string[] = [];

    lines.push("New Auric booking request");
    lines.push("========================");
    lines.push(`Event: ${eventTitle}`);
    if (dateTimeLabel) {
      lines.push(`Date: ${dateTimeLabel}`);
    }
    if (bookingId) {
      lines.push(`Booking ref: #${bookingId}`);
    }
    lines.push("");
    lines.push(`Ticket: ${ticketLabel}`);
    lines.push(`Quantity: ${tickets}`);
    lines.push("");
    lines.push(`Name: ${fullName}`);
    lines.push(`Email: ${email || "-"}`);
    lines.push(`Phone: ${customerPhone || "-"}`);

    const message = lines.join("\n");

    const url =
      "https://wa.me/" +
      phone +
      "?text=" +
      encodeURIComponent(message);

    window.open(url, "_blank");
  }
}
