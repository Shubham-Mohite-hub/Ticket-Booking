const { generateQRCode } = require("../utils/qrGenerator");
const { sendEmail } = require("../utils/emailSender");
const bookingConfirmationTemplate = require("../templates/bookingConfirmationTemplate");
const waitlistOfferTemplate = require("../templates/waitlistOfferTemplate");

const sendBookingConfirmation = async ({
  to,
  bookingId,
  eventTitle,
  eventDate,
  eventTime,
  venueName,
  customerName,
  seats,
  totalAmount,
}) => {
  try {
    const qrPayload = {
      bookingId,
      event: eventTitle,
      customer: customerName,
      seats: seats.map((seat) => ({
        row: seat.row,
        column: seat.column,
        category: seat.category,
      })),
      totalAmount,
    };

    const qrCodeBase64 = await generateQRCode(qrPayload);

    const html = bookingConfirmationTemplate({
      bookingId,
      eventTitle,
      eventDate,
      eventTime,
      venueName,
      customerName,
      seats,
      totalAmount,
      qrCodeBase64,
    });

    await sendEmail({
      to,
      subject: `Booking Confirmed — ${eventTitle}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
  }
};

const sendWaitlistOffer = async ({
  to,
  customerName,
  eventTitle,
  category,
  expiresAt,
  acceptUrl,
}) => {
  try {
    const html = waitlistOfferTemplate({
      customerName,
      eventTitle,
      category,
      expiresAt,
      acceptUrl,
    });

    await sendEmail({
      to,
      subject: `Seat Available — ${eventTitle}`,
      html,
    });
  } catch (error) {
    console.error("Failed to send waitlist offer email:", error);
  }
};

module.exports = { sendBookingConfirmation, sendWaitlistOffer };