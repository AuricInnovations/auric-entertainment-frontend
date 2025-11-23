// src/lib/whatsapp.ts
export function buildBookingWhatsAppUrl(args: {
  eventTitle: string;
  eventId: number;
  fullName: string;
  email?: string;
  phone?: string;
  tickets: number;
  ticketTypeName?: string;
}) {
  // 🔧 Put your Auric WhatsApp number here (no +, no spaces)
  const auricPhone = "60189545304";

  const {
    eventTitle,
    eventId,
    fullName,
    email,
    phone,
    tickets,
    ticketTypeName,
  } = args;

  const lines = [
    "New booking received 🎟️",
    "",
    `Event: ${eventTitle} (ID: ${eventId})`,
    ticketTypeName ? `Category: ${ticketTypeName}` : "",
    `Tickets: ${tickets}`,
    "",
    `Name: ${fullName}`,
    email ? `Email: ${email}` : "",
    phone ? `Phone: ${phone}` : "",
  ].filter(Boolean); // remove empty lines

  const text = encodeURIComponent(lines.join("\n"));

  return `https://wa.me/${auricPhone}?text=${text}`;
}
