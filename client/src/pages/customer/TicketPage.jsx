import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { getBookingById } from "../../api/bookingApi";

const TicketPage = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const ticketRef = useRef(null);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (err) {
      toast.error("Unable to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 190;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

    pdf.save(`Ticket-${booking._id}.pdf`);
  };

  const printTicket = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-6">
        <Skeleton className="h-[720px] rounded-3xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-24 text-2xl font-semibold">
        Ticket not found.
      </div>
    );
  }

  const qrValue = `http://10.25.19.67:5173/ticket/${booking._id}`;

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-indigo-100 min-h-screen py-12 px-6">

      <div
        ref={ticketRef}
        className="max-w-6xl mx-auto bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-200"
      > 

                {/* ================= HERO SECTION ================= */}

        {/* ================= HERO SECTION ================= */}

<div className="relative h-80 overflow-hidden">

  {booking.event.bannerImage ? (

    <img
      src={booking.event.bannerImage}
      alt={booking.event.title}
      className="w-full h-full object-cover"
    />

  ) : (

    <div className="w-full h-full bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600" />

  )}

  <div className="absolute inset-0 bg-black/55"></div>

  {/* Category Badge */}

  <div className="absolute top-8 right-8">

    <span className="bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2 rounded-full text-white font-semibold">

      {booking.event.category || "LIVE EVENT"}

    </span>

  </div>

  {/* Ticket Text */}

  <div className="absolute bottom-10 left-10">

    
    <h1 className="text-5xl md:text-6xl font-black text-white mt-3">

      {booking.event.title}

    </h1>

    <p className="text-white/90 mt-4 text-xl">

      Premium Event Pass

    </p>

  </div>

</div>

        {/* ================= MAIN BODY ================= */}

        <div className="grid lg:grid-cols-[2fr_auto_1fr]">

          {/* LEFT SIDE */}

          <div className="p-8 md:p-10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm uppercase tracking-widest text-gray-400">
                  Ticket Number
                </p>

                <h2 className="text-3xl font-black tracking-wider text-indigo-700 mt-2">
                  TB-{booking._id.slice(-8).toUpperCase()}
                </h2>

              </div>

              <div className="flex justify-end">

    <div className="rotate-[-10deg] border-4 border-green-500 px-8 py-3 rounded-xl">

        <span className="text-2xl font-black text-green-600">

            CONFIRMED

        </span>

    </div>

</div>

            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-10">

              <div className="flex gap-4">

                <Calendar className="text-indigo-600 mt-1" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Event Date
                  </p>

                  <p className="font-semibold text-lg">
                    {new Date(
                      booking.event.eventDate
                    ).toLocaleDateString()}
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <Clock className="text-indigo-600 mt-1" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Start Time
                  </p>

                  <p className="font-semibold text-lg">
                    {booking.event.startTime}
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <MapPin className="text-indigo-600 mt-1" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Venue
                  </p>

                  <p className="font-semibold text-lg">
                    {booking.event.venue?.name}
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <User className="text-indigo-600 mt-1" />

                <div>

                  <p className="text-gray-500 text-sm">
                    Customer
                  </p>

                  <p className="font-semibold text-lg">
                    {booking.user?.name || "Customer"}
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-10">

              <p className="text-gray-500 font-medium mb-4">
                Reserved Seats
              </p>

              <div className="flex flex-wrap gap-3">

                {booking.seats.map((seat, index) => (

                  <div
                    key={index}
                    className="bg-indigo-100 text-indigo-700 rounded-xl px-5 py-3 font-semibold shadow-sm"
                  >
                    Row {seat.row} • Seat {seat.column}
                  </div>

                ))}

              </div>

            </div>

            <div className="mt-10 flex items-center gap-4">

              <CreditCard className="text-green-600" size={28} />

              <div>

                

               <div>

    <p className="text-gray-400 uppercase text-sm tracking-widest">

        Ticket Number

    </p>

    <h2 className="text-4xl font-black text-indigo-700 mt-2">

        TB-{booking._id.slice(-8).toUpperCase()}

    </h2>

</div>

              </div>

            </div>

          </div>

          <div className="hidden lg:flex relative justify-center">

    <div className="border-l-2 border-dashed border-gray-300 h-full"></div>

    <div className="absolute -left-4 top-10 w-8 h-8 rounded-full bg-slate-100"></div>

    <div className="absolute -left-4 bottom-10 w-8 h-8 rounded-full bg-slate-100"></div>

</div>

                        {/* Right QR Section */}
          <div className="relative bg-gradient-to-b from-slate-50 via-indigo-50 to-purple-50 flex flex-col justify-center items-center p-10 overflow-hidden">

            <div className="bg-white rounded-3xl shadow-xl p-5">

              <QRCodeCanvas
                value={qrValue}
                size={200}
              />

            </div>

            <div className="mt-6 text-center">

              <p className="text-xs uppercase tracking-wider text-gray-500">
                Booking Reference
              </p>

              <p className="text-lg font-bold mt-1">
                TB-{booking._id.slice(-8).toUpperCase()}
              </p>

              <p className="text-xs text-gray-500 mt-3 break-all">
                {booking._id}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center mt-8">

        <p className="text-gray-600 font-medium">
          Please carry a valid Government ID during entry.
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Scan the QR code at the venue entrance for instant verification.
        </p>

        <p className="mt-4 text-indigo-600 font-bold">
          Powered by TicketBooking
        </p>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-5 mt-10">

        <Button onClick={downloadPDF}>
          ⬇ Download Ticket
        </Button>

        <Button
          variant="secondary"
          onClick={printTicket}
        >
          🖨 Print Ticket
        </Button>

      </div>

    </div>
  );
};

export default TicketPage;