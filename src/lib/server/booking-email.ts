import type { BookingData } from "../validation";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function bookingEmail(booking: BookingData) {
  const rows = [
    ["Ad", booking.name],
    ["Telefon", booking.phone],
    ["Cihaz", booking.deviceType === "paltaryuyan" ? "Paltaryuyan" : "Qabyuyan"],
    ["Marka", booking.brand || "Qeyd edilməyib"],
    ["Problem", booking.problem || "Qeyd edilməyib"],
    ["Rayon / ünvan", booking.address || "Qeyd edilməyib"],
  ];
  return {
    subject: `DənizServis — yeni ${booking.deviceType} müraciəti`,
    text: ["Yeni DənizServis müraciəti", "", ...rows.map(([label, value]) => `${label}: ${value}`)].join("\n"),
    html: `<html lang="az"><body><h2>Yeni DənizServis müraciəti</h2><table cellpadding="8" cellspacing="0" style="border-collapse:collapse;text-align:left">${rows.map(([label, value]) => `<tr><th scope="row" style="vertical-align:top">${label}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join("")}</table></body></html>`,
  };
}
