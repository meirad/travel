import express from "express";
import Testimonial from "../models/testimonialSchema.mjs"; // Assuming you have this model set up

const router = express.Router();

// POST route to add a testimonial
router.post("/", async (req, res) => {
  const { name, feedback, role, avatar } = req.body;

  // Validate the data (ensure required fields are present)
  if (!name || !feedback || !avatar) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newTestimonial = new Testimonial({
    name,
    feedback,
    role,
    avatar,
  });

  try {
    await newTestimonial.save();
    res.status(201).json({ message: "Testimonial saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving testimonial", error: err });
  }
});

// GET route to fetch all testimonials
router.get("/", async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (err) {
        res.status(500).json({ message: "Error fetching testimonials", error: err });
    }
});

export default router;
