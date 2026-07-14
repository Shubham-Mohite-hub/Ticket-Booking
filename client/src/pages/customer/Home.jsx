import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Ticket,
  ShieldCheck,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllEvents } from "../../api/eventApi";
import { useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
const [events, setEvents] = useState([]);

useEffect(() => {
  fetchEvents();
}, []);

const fetchEvents = async () => {
  try {
    const data = await getAllEvents();

    // Only show published events
    const published = data.filter(
      (event) => event.status === "Published"
    );

    setEvents(published);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900">

        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative max-w-7xl mx-auto px-8 py-24">

          <div className="max-w-3xl">

            <p className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm">

              <Sparkles size={16} />

              Discover Amazing Live Experiences

            </p>

            <h1 className="mt-8 text-6xl font-black leading-tight text-white">

              Book Tickets

              <br />

              For Your

              <span className="text-indigo-300">

                {" "}Favourite Events

              </span>

            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-8">

              Concerts, Movies, Sports, Theatre, Comedy Shows and much more —
              all in one place.

            </p>

            {/* SEARCH */}

            <div className="mt-10 bg-white rounded-2xl shadow-2xl p-3 flex items-center">

              <Search className="text-gray-400 ml-3" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, movies, concerts..."
                className="flex-1 px-4 py-3 outline-none text-lg"
              />

              <button
                onClick={() => navigate("/events")}
                className="bg-indigo-600 hover:bg-indigo-700 transition px-8 py-3 rounded-xl text-white font-semibold"
              >
                Explore
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="max-w-7xl mx-auto px-8 -mt-12 relative z-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <Ticket className="text-indigo-600 mb-4" />

            <h2 className="text-4xl font-black">
              250+
            </h2>

            <p className="text-gray-500 mt-2">
              Events
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <ShieldCheck className="text-green-600 mb-4" />

            <h2 className="text-4xl font-black">
              20K+
            </h2>

            <p className="text-gray-500 mt-2">
              Successful Bookings
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <MapPin className="text-orange-500 mb-4" />

            <h2 className="text-4xl font-black">
              50+
            </h2>

            <p className="text-gray-500 mt-2">
              Cities
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <Sparkles className="text-pink-500 mb-4" />

            <h2 className="text-4xl font-black">
              99%
            </h2>

            <p className="text-gray-500 mt-2">
              Happy Customers
            </p>

          </div>

        </div>

      </section>

      {/* ================= FEATURED EVENTS ================= */}

      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-4xl font-bold">

              Featured Events

            </h2>

            <p className="text-gray-500 mt-2">

              Discover trending experiences happening near you.

            </p>

          </div>

          <button
            onClick={() => navigate("/events")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            View All →
          </button>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">

  {events.map((event) => (

    <div
      key={event._id}
      onClick={() => navigate(`/events/${event._id}`)}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >

      <div className="relative h-64 overflow-hidden">

        {event.bannerImage ? (

          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />

        ) : (

          <div className="w-full h-full bg-gradient-to-br from-indigo-700 to-purple-700" />

        )}

        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">

          LIVE

        </div>

      </div>

      <div className="p-5">

        <h3 className="font-bold text-xl line-clamp-1">

          {event.title}

        </h3>

        <p className="text-gray-500 mt-2">

          {new Date(event.eventDate).toLocaleDateString()}

        </p>

        <p className="text-gray-500">

          {event.venue?.name}

        </p>

        <div className="mt-5 flex justify-between items-center">

          <div>

            <p className="text-xs text-gray-400">

              Starting From

            </p>

            <p className="text-lg font-bold text-indigo-600">

              ₹{event.basePrice || 299}

            </p>

          </div>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">

            Book

          </button>

        </div>

      </div>

    </div>

  ))}

</div>

      </section>

      {/* ================= CATEGORIES ================= */}

<section className="max-w-7xl mx-auto px-8 pb-20">

  <h2 className="text-4xl font-bold mb-10">

    Browse Categories

  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

    {[
      "Movies",
      "Concerts",
      "Comedy",
      "Sports",
      "Theatre",
      "Festivals",
    ].map((item) => (

      <div
        key={item}
        className="bg-white rounded-2xl shadow hover:shadow-xl transition p-8 text-center cursor-pointer"
      >

        <div className="text-4xl mb-4">

          {item === "Movies" && "🎬"}
          {item === "Concerts" && "🎵"}
          {item === "Comedy" && "😂"}
          {item === "Sports" && "🏏"}
          {item === "Theatre" && "🎭"}
          {item === "Festivals" && "🎪"}

        </div>

        <h3 className="font-semibold">

          {item}

        </h3>

      </div>

    ))}

  </div>

</section>

<section className="max-w-7xl mx-auto px-8 pb-20">

  <div className="rounded-3xl overflow-hidden relative">

    <img
      src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600"
      className="w-full h-[320px] object-cover"
      alt=""
    />

    <div className="absolute inset-0 bg-black/55"></div>

    <div className="absolute inset-0 flex flex-col justify-center px-12">

      <h2 className="text-5xl font-black text-white">
        Experience Live Entertainment
      </h2>

      <p className="text-white/80 mt-5 max-w-2xl text-lg">
        Concerts, Stand-up Comedy, Theatre, Sports and Premium Live Shows.
      </p>

      <button
        onClick={() => navigate("/events")}
        className="mt-8 w-fit bg-white text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition"
      >
        Explore Events
      </button>

    </div>

  </div>

</section>

<section className="max-w-7xl mx-auto px-8 pb-20">

<div className="flex justify-between items-center mb-10">

<div>

<h2 className="text-4xl font-bold">

Trending This Week

</h2>

<p className="text-gray-500 mt-2">

People are booking these events the most.

</p>

</div>

</div>

<div className="grid md:grid-cols-3 gap-8">

{events.slice(0,3).map((event,index)=>(

<div
key={event._id}
onClick={()=>navigate(`/events/${event._id}`)}
className="relative rounded-3xl overflow-hidden group cursor-pointer h-[420px]"
>

<img
src={event.bannerImage}
className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
/>

<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/>

<div className="absolute top-5 left-5 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">

#{index+1} Trending

</div>

<div className="absolute bottom-6 left-6 right-6">

<h3 className="text-white text-3xl font-bold">

{event.title}

</h3>

<p className="text-white/80 mt-2">

{event.venue?.name}

</p>

</div>

</div>

))}

</div>

</section>

<section className="bg-white py-24">

<div className="max-w-7xl mx-auto px-8">

<h2 className="text-center text-4xl font-bold">

Why Choose TicketBooking

</h2>

<div className="grid md:grid-cols-3 gap-10 mt-16">

<div className="text-center">

<div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">

<Ticket className="text-indigo-600" size={34}/>

</div>

<h3 className="font-bold text-2xl mt-6">

Instant Booking

</h3>

<p className="text-gray-500 mt-3">

Book tickets within seconds without waiting in queues.

</p>

</div>

<div className="text-center">

<div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">

<ShieldCheck className="text-green-600" size={34}/>

</div>

<h3 className="font-bold text-2xl mt-6">

Secure Payments

</h3>

<p className="text-gray-500 mt-3">

End-to-end encrypted and secure ticket booking experience.

</p>

</div>

<div className="text-center">

<div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto">

<Sparkles className="text-pink-600" size={34}/>

</div>

<h3 className="font-bold text-2xl mt-6">

Premium Experience

</h3>

<p className="text-gray-500 mt-3">

Modern interface inspired by the world's best ticket booking platforms.

</p>

</div>

</div>

</div>

</section>

<section className="bg-slate-900 py-24">

<div className="max-w-5xl mx-auto text-center px-8">

<h2 className="text-5xl font-black text-white">

Ready For Your Next Experience?

</h2>

<p className="text-slate-300 text-lg mt-6">

Discover concerts, movies, theatre and sports happening near you.

</p>

<button
onClick={()=>navigate("/events")}
className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition"
>

Browse Events

</button>

</div>

</section>

<footer className="bg-black text-gray-400 py-16">

<div className="max-w-7xl mx-auto px-8">

<div className="flex flex-col md:flex-row justify-between gap-10">

<div>

<h2 className="text-3xl font-black text-white">

TicketBooking

</h2>

<p className="mt-4 max-w-sm">

Book tickets for concerts, movies, sports and theatre with a modern booking experience.

</p>

</div>

<div>

<h3 className="text-white font-semibold mb-4">

Quick Links

</h3>

<ul className="space-y-2">

<li className="hover:text-white cursor-pointer" onClick={()=>navigate("/")}>Home</li>

<li className="hover:text-white cursor-pointer" onClick={()=>navigate("/events")}>Events</li>

<li className="hover:text-white cursor-pointer" onClick={()=>navigate("/my-bookings")}>My Bookings</li>

</ul>

</div>

<div>

<h3 className="text-white font-semibold mb-4">

Support

</h3>

<p>Email: support@ticketbooking.com</p>

<p className="mt-2">Phone: +91 9876543210</p>

</div>

</div>

<hr className="border-gray-800 my-10"/>

<p className="text-center">

© 2026 TicketBooking. All Rights Reserved.

</p>

</div>

</footer>

    </div>
  );
};

export default Home;