const escapeHtml = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const bookingConfirmationTemplate = ({
  bookingId,
  eventTitle,
  eventDate,
  eventTime,
  venueName,
  customerName,
  seats,
  totalAmount,
  qrCodeBase64,
}) => {
  const seatsListHtml = seats
    .map(
      (seat) =>
        `<li>Row ${seat.row}, Column ${seat.column} — ${escapeHtml(seat.category)} (₹${seat.price})</li>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body style="font-family: Arial, sans-serif; color: #222; padding: 20px;">
        <h2>Booking Confirmed 🎉</h2>
        <p>Hi ${escapeHtml(customerName)},</p>
        <p>Your booking for <strong>${escapeHtml(eventTitle)}</strong> has been confirmed.</p>

        <h3>Event Details</h3>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
        <p><strong>Venue:</strong> ${escapeHtml(venueName)}</p>

        <h3>Booking Details</h3>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>

        <h3>Seats</h3>
        <ul>
          ${seatsListHtml}
        </ul>

        <h3>Your Ticket QR Code</h3>
        <img src="${qrCodeBase64}" alt="Booking QR Code" width="250" height="250" />

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />

        <p style="margin-top: 20px; font-size: 13px; color: #555;">
          Please present this QR code at the venue entrance for verification. Keep this
          email safe — it serves as your official ticket for entry.
        </p>
        <p style="font-size: 13px; color: #555;">
          If you have any questions about your booking, please contact our support team.
        </p>
        <p style="margin-top: 16px; font-size: 13px; color: #555;">
          Thank you for booking with us, and we look forward to seeing you at the event!
        </p>
      </body>
    </html>
  `;
};

module.exports = bookingConfirmationTemplate;