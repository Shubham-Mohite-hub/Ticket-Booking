const QRCode = require("qrcode");
const ApiError = require("./ApiError");

const generateQRCode = async (payload) => {
  if (payload === undefined || payload === null) {
    throw new ApiError(400, "QR payload is required");
  }

  try {
    const dataString = typeof payload === "string" ? payload : JSON.stringify(payload);

    const qrCodeBase64 = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
    });

    return qrCodeBase64;
  } catch (error) {
    throw new ApiError(500, "Failed to generate QR code");
  }
};

module.exports = { generateQRCode };