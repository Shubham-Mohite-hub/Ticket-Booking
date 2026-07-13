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

const waitlistOfferTemplate = ({
  customerName,
  eventTitle,
  category,
  expiresAt,
  acceptUrl,
}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body style="font-family: Arial, sans-serif; color: #222; padding: 20px;">
        <h2>A Seat Is Available For You! 🎟️</h2>
        <p>Hi ${escapeHtml(customerName)},</p>
        <p>
          Good news — a seat has opened up for <strong>${escapeHtml(eventTitle)}</strong>
          in the <strong>${escapeHtml(category)}</strong> category, and you're next in line!
        </p>

        <h3>Offer Details</h3>
        <p><strong>Event:</strong> ${escapeHtml(eventTitle)}</p>
        <p><strong>Seat Category:</strong> ${escapeHtml(category)}</p>
        <p>
          <strong style="color:#dc2626;">Offer Expires At:</strong>
          <span style="color: #dc2626; font-weight: bold;">${expiresAt}</span>
        </p>

       <p style="margin: 24px 0;">
  <a
    href="${escapeHtml(acceptUrl)}"
    style="
      background-color: #2563eb;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      display: inline-block;
    "
  >
    Accept This Offer
  </a>
</p>

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />

        <p style="margin-top: 20px; font-size: 13px; color: #555;">
          This offer is time-limited. If you do not accept it before the expiry time
          above, it will automatically be passed to the next customer on the waitlist.
        </p>
        <p style="font-size: 13px; color: #555;">
          If you have any questions, please contact our support team.
        </p>
      </body>
    </html>
  `;
};

module.exports = waitlistOfferTemplate;