const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");
const Device = require("../models/Device");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path accordingly

// Apply the authMiddleware to all routes in this file
router.use(authMiddleware);

// Helper function to validate the time (between 8 AM and 6 PM)
const isValidTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours >= 8 && hours < 18; // Time should be between 08:00 and 18:00 (6 PM)
};

// Helper function to validate the location is in Sri Lanka
const isInSriLanka = (lat, lng) => {
  // Sri Lanka's approximate bounding box
  const latMin = 5.916;
  const latMax = 9.842;
  const lngMin = 79.695;
  const lngMax = 81.893;
  return lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;
};

// Get all collections for the logged-in user
router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user.id });
    res.json(collections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

// Get a single collection by ID
router.get("/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    // Check if the collection exists and belongs to the logged-in user
    if (!collection || collection.userId.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Collection not found or unauthorized" });
    }

    res.json(collection);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch collection details" });
  }
});

// Create a new collection for the logged-in user
router.post("/", async (req, res) => {
  const { location, wasteType, details, date, time } = req.body;

  // Validate date
  const today = new Date();
  const scheduleDate = new Date(date);
  if (scheduleDate <= today) {
    return res
      .status(400)
      .json({ error: "Scheduling date must be at least the next day." });
  }

  // Validate time
  if (!isValidTime(time)) {
    return res
      .status(400)
      .json({ error: "Time must be between 8:00 AM and 6:00 PM." });
  }

  // Validate location (should be in Sri Lanka)
  if (!isInSriLanka(location.lat, location.lng)) {
    return res
      .status(400)
      .json({ error: "Location must be within Sri Lanka." });
  }

  try {
    const newCollection = new Collection({
      userId: req.user.id, // Assign logged-in user's ID
      location,
      wasteType,
      details,
      date,
      time,
    });

    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to schedule collection" });
  }
});

// Update a collection
router.put("/:id", async (req, res) => {
  const { location, wasteType, details, date, time } = req.body;

  // Validate date
  const today = new Date();
  const scheduleDate = new Date(date);
  if (scheduleDate <= today) {
    return res
      .status(400)
      .json({ error: "Scheduling date must be at least the next day." });
  }

  // Validate time
  if (!isValidTime(time)) {
    return res
      .status(400)
      .json({ error: "Time must be between 8:00 AM and 6:00 PM." });
  }

  // Validate location (should be in Sri Lanka)
  if (!isInSriLanka(location.lat, location.lng)) {
    return res
      .status(400)
      .json({ error: "Location must be within Sri Lanka." });
  }

  try {
    const collection = await Collection.findById(req.params.id);

    // Check if the collection exists and belongs to the logged-in user
    if (!collection || collection.userId.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Collection not found or unauthorized" });
    }

    // Perform the update
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      { location, wasteType, details, date, time },
      { new: true }
    );

    res.json(updatedCollection);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to update collection" });
  }
});

// Delete a collection
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    // Check if the collection exists and belongs to the logged-in user
    if (!collection || collection.userId.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Collection not found or unauthorized" });
    }

    await Collection.findByIdAndDelete(req.params.id); // Use findByIdAndDelete instead of collection.remove()

    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error("Error deleting collection:", err); // Log the error for debugging
    res.status(500).json({ error: "Failed to delete collection" });
  }
});

module.exports = router;
