const express = require("express");
const router = express.Router();
const Collection = require("../models/Collection");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust the path accordingly

// Apply the authMiddleware to all routes in this file
router.use(authMiddleware);

// Get all collections for the logged-in user
router.get("/", async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user.id }); // Fetch collections for the logged-in user
    res.json(collections);
  } catch (err) {
    console.error(err); // Log the error for debugging
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
router.delete("/:id", async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    // Check if the collection exists and belongs to the logged-in user
    if (!collection || collection.userId.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ error: "Collection not found or unauthorized" });
    }

    await collection.remove();
    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to delete collection" });
  }
});

module.exports = router;
