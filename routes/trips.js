const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/fetcher");
const Trip = require("../models/trip");
const { validationResult } = require("express-validator");

//TODO Add Middleware
// Route 1: get all the trips using : Get "/api/trips/getAllTrips"
router.get("/getAllTrips", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
});

// Route 2: add trip using : Post "/api/trips/uploadTrip"
router.post("/uploadTrip", authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      aboutTour,
      price,
      startsAt,
      duration,
      category,
      inclusions,
      exclusions,
      roadmap,
      destination,
      images,
      itinerary,
    } = req.body;
    // If there are errors, return a bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const trip = new Trip({
      title,
      aboutTour,
      price,
      startsAt,
      duration,
      category,
      inclusions,
      exclusions,
      roadmap,
      images,
      destination,
      itinerary,
    });

    const savedTrip = await trip.save();
    res.json(savedTrip);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
});

// Route 3: update trip using : Put "/api/updateTrip" Login required
router.put("/updateTrip/:id", authenticateAdmin, async (req, res) => {
  try {
    const {
      title,
      aboutTour,
      price,
      startsAt,
      duration,
      category,
      inclusions,
      exclusions,
      roadmap,
      destination,
      images,
      itinerary,
    } = req.body;
    // create a newTrip object;
    const newTrip = {};

    // Find the trip to be updated
    let trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(401).send("Trip not found");
    }
    title && (newTrip.title = title);
    aboutTour && (newTrip.aboutTour = aboutTour);
    price && (newTrip.price = price);
    startsAt && (newTrip.startsAt = startsAt);
    duration && (newTrip.duration = duration);
    category && (newTrip.category = category);
    inclusions && (newTrip.inclusions = inclusions);
    exclusions && (newTrip.exclusions = exclusions);
    roadmap && (newTrip.roadmap = roadmap);
    destination && (newTrip.destination = destination);
    images && (newTrip.images = images);
    itinerary && (newTrip.itinerary = itinerary);

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: newTrip },
      { new: true }
    );
    res.json(trip);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occurred");
  }
});

// Route 4: Delete Trip using : Delete "/api/trips/deleteTrip" Login required
router.delete("/deleteTrip/:id", authenticateAdmin, async (req, res) => {
  try {
    // Find the trip to be deleted
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: "Trip deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error occurred" });
  }
});

router.get("/getTrip/:id", async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await Trip.findById(tripId);
    if (trip) {
      res.send(trip);
    } else {
      res.status(404).send("trip not found");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
