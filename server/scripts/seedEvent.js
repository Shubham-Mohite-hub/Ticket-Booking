require("dotenv").config();
const Event = require("../src/models/Event");
const Venue = require("../src/models/Venue");
const Seat = require("../src/models/Seat");
const mongoose = require("mongoose");


const ADMIN_ID = "6a50e998ee432cb74fca48fd";

const VENUES = [
  "6a51e499de160d51c7442e59", // PVR Cinemas
  "6a52264e45f4ed419353e320", // Mumbai Stadium
  "6a5348cf36b4263a2dfaefd9", // VIIT Auditorium
];

const events = [
  {
    title: "Avengers: Secret Wars",
    description: "Marvel's biggest crossover movie.",
    venue: VENUES[0],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-01"),
    startTime: "18:00",
    endTime: "21:00",
    basePrice: 350,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200",
  },
  {
    title: "Coldplay World Tour",
    description: "Live concert experience.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-03"),
    startTime: "19:00",
    endTime: "23:00",
    basePrice: 1800,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200",
  },
  {
    title: "Stand-Up Night",
    description: "Comedy special.",
    venue: VENUES[2],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-04"),
    startTime: "20:00",
    endTime: "22:00",
    basePrice: 499,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200",
  },
  {
    title: "Arijit Singh Live",
    description: "Musical night.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-05"),
    startTime: "19:30",
    endTime: "22:30",
    basePrice: 2200,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=1200",
  },
  {
    title: "IPL Fan Fest",
    description: "Cricket celebration.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-07"),
    startTime: "17:00",
    endTime: "22:00",
    basePrice: 699,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200",
  },
  {
    title: "Interstellar IMAX",
    description: "Christopher Nolan masterpiece.",
    venue: VENUES[0],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-08"),
    startTime: "18:30",
    endTime: "21:30",
    basePrice: 450,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200",
  },
  {
    title: "Taylor Swift Tribute",
    description: "Live tribute concert.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-09"),
    startTime: "19:00",
    endTime: "22:00",
    basePrice: 1200,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
  },
  {
    title: "Anime Expo Pune",
    description: "Cosplay and anime convention.",
    venue: VENUES[2],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-10"),
    startTime: "10:00",
    endTime: "18:00",
    basePrice: 650,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200",
  },
  {
    title: "Rock Music Festival",
    description: "All-day music festival.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-12"),
    startTime: "16:00",
    endTime: "23:00",
    basePrice: 1500,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200",
  },
  {
    title: "Marvel Fan Meet",
    description: "Meet fellow Marvel fans.",
    venue: VENUES[2],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-14"),
    startTime: "11:00",
    endTime: "17:00",
    basePrice: 399,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=1200",
  },
  {
    title: "Sunburn Goa 2026",
    description: "Asia's biggest EDM festival.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-12-28"),
    startTime: "18:00",
    endTime: "23:30",
    basePrice: 3500,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
  },
  {
    title: "IPL Final 2026",
    description: "Experience the biggest cricket finale.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-05-29"),
    startTime: "19:30",
    endTime: "23:00",
    basePrice: 2200,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200",
  },
  {
    title: "Stand-Up Night with Zakir Khan",
    description: "Comedy special.",
    venue: VENUES[2],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-10-08"),
    startTime: "20:00",
    endTime: "22:00",
    basePrice: 999,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1200",
  },
  {
    title: "Marvel Movie Marathon",
    description: "Watch the biggest Marvel hits.",
    venue: VENUES[0],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-09-12"),
    startTime: "10:00",
    endTime: "22:00",
    basePrice: 799,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200",
  },
  {
    title: "Coldplay Tribute Night",
    description: "A tribute to Coldplay classics.",
    venue: VENUES[2],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-09-25"),
    startTime: "19:00",
    endTime: "22:00",
    basePrice: 1499,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200",
  },
  {
    title: "Football Championship",
    description: "Top clubs battle for glory.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-21"),
    startTime: "18:30",
    endTime: "21:30",
    basePrice: 1200,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1508098682722-e99c643e7485?w=1200",
  },
  {
    title: "Taylor Swift Fan Fest",
    description: "Celebrate the Eras together.",
    venue: VENUES[2],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-10-30"),
    startTime: "18:00",
    endTime: "22:00",
    basePrice: 1600,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200",
  },
  {
    title: "The Weeknd Live",
    description: "After Hours world tour experience.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-12-02"),
    startTime: "19:30",
    endTime: "22:30",
    basePrice: 2600,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200",
  },
  {
    title: "Harry Potter in Concert",
    description: "Live orchestra performs Harry Potter.",
    venue: VENUES[0],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-09-05"),
    startTime: "18:00",
    endTime: "21:00",
    basePrice: 1700,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200",
  },
  {
    title: "Imagine Dragons Live",
    description: "Believer, Thunder and more.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-12-12"),
    startTime: "19:00",
    endTime: "22:30",
    basePrice: 2400,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
  },
  {
    title: "Interstellar IMAX Screening",
    description: "Christopher Nolan masterpiece.",
    venue: VENUES[0],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-15"),
    startTime: "17:00",
    endTime: "20:30",
    basePrice: 699,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200",
  },
  {
    title: "Chess Masters Tournament",
    description: "Grandmaster invitational.",
    venue: VENUES[2],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-09-20"),
    startTime: "10:00",
    endTime: "18:00",
    basePrice: 499,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200",
  },
  {
    title: "Anime Expo India",
    description: "Cosplay, gaming and anime merch.",
    venue: VENUES[2],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-11-01"),
    startTime: "09:00",
    endTime: "19:00",
    basePrice: 899,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200",
  },

  {
    title: "Waitlist Test",
    description: "Cricket celebration.",
    venue: VENUES[1],
    organizer: ADMIN_ID,
    eventDate: new Date("2026-08-07"),
    startTime: "17:00",
    endTime: "22:00",
    basePrice: 699,
    status: "Published",
    bannerImage:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200",
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Connected to MongoDB");

    await Seat.deleteMany({});
    await Event.deleteMany({});

    for (const eventData of events) {

      const event = await Event.create(eventData);

      const venue = await Venue.findById(event.venue);

      const seats = [];

      for (let row = 1; row <= venue.rows; row++) {

        for (let column = 1; column <= venue.columns; column++) {

          let category = "Regular";

          if (venue.seatCategories && venue.seatCategories.length > 0) {

            if (row <= 2) {
              category = venue.seatCategories[0].name;
            } else if (row <= 5 && venue.seatCategories[1]) {
              category = venue.seatCategories[1].name;
            } else if (venue.seatCategories[2]) {
              category = venue.seatCategories[2].name;
            }

          }

          seats.push({
            event: event._id,
            row,
            column,
            category,
            price: event.basePrice,
            status: "Available",
          });

        }

      }

      await Seat.insertMany(seats);

      console.log(
        `✔ ${event.title} -> ${seats.length} seats created`
      );

    }

    console.log("🎉 All events seeded successfully.");

  } catch (err) {

    console.error(err);

  } finally {

    await mongoose.connection.close();

    process.exit();

  }
}

seed();