import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Customer",
  },
  avatar: {
    type: String, // URL for the image
    required: true,
  },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
