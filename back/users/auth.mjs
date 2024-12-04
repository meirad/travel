import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.mjs';
import { UserLogin, UserSignup } from './users.joi.mjs';
import { User } from './users.model.mjs';

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const validate = UserLogin.validate({ email, password });
        if (validate.error) {
            console.error("Validation Error:", validate.error.details[0]?.message);
            return res.status(403).json({ error: "Validation failed", details: validate.error.details[0]?.message });
        }

        const user = await User.findOne({ email, isDeleted: { $ne: true } });
        if (!user) {
            console.error("User not found:", email);
            return res.status(403).json({ error: "Invalid email or password" });
        }

        if (!user.password || !await bcrypt.compare(password, user.password)) {
            console.error("Password mismatch for user:", email);
            return res.status(403).json({ error: "Invalid email or password" });
        }

        const payload = {
            _id: user._id,
            lastName: user.lastName,
            firstName: user.firstName,
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        console.log("Login successful for user:", email);

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                isBusiness: user.isBusiness,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/signup", async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, password, isAdmin } = req.body;

        // Validate the signup input
        const validate = UserSignup.validate(req.body, { allowUnknown: true });

        if (validate.error) {
            return res.status(403).send(validate.error.details[0].message);
        }

        // Check if user already exists with the same email
        if (await User.findOne({ email })) {
            return res.status(403).send("User with this email already exists.");
        }

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            isAdmin: isAdmin || false,  // Default to false if not provided
            password: await bcrypt.hash(password, 10),
        });

        const newUser = await user.save();

        res.json({
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
            },
        });
    } catch (error) {
        next(error);
    }
});


export default router;