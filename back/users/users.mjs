import express from "express";
import jwt from "jsonwebtoken";
import { User } from "./users.model.mjs";
import { getUser } from "../guard.mjs"; 
import { guard } from "../guard.mjs";

const router = express.Router();

// get user only admin can do this
router.get("/", guard, async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false });

        res.send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Failed to fetch users." });
    }
});



// Get user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.isDeleted) {
            return res.status(404).send({ message: "User not found." });
        }

        // Temporarily remove this line for testing
        // const requestingUser = getUser(req);

        res.send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ message: "Failed to fetch user." });
    }
});



// Edit user
router.put("/:id", async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).send({ message: "Missing required fields" });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user || user.isDeleted) {
            return res.status(404).send({ message: "User not found" });
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phone = phone;

        await user.save();
        res.send(user);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send({ message: "Email is already in use" });
        } else {
            console.error("Error updating user:", error);
            res.status(500).send({ message: "Failed to update user" });
        }
    }
});



// Delete user
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.isDeleted) {
            return res.status(404).send({ message: "User not found." });
        }

        await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.send({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: "Failed to delete user." });
    }
});

// Add this route to your users or bookings router






export default router;
