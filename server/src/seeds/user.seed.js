import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const users = [
    {
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        profilePic: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
    },
    {
        fullName: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        profilePic: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg",
    },
    {
        fullName: "Alice Johnson",
        email: "alice@example.com",
        password: "password123",
        profilePic: "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg",
    },
    {
        fullName: "Bob Wilson",
        email: "bob@example.com",
        password: "password123",
        profilePic: "https://img.freepik.com/free-psd/3d-illustration-person-with-punk-hair-style_23-2149436198.jpg",
    },
    {
        fullName: "Emma Davis",
        email: "emma@example.com",
        password: "password123",
        profilePic: "https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2149436197.jpg",
    },
];

const seedUsers = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(uri);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing users
        await User.deleteMany({});
        console.log("Cleared existing users");

        // Hash passwords and create users
        const usersWithHashedPasswords = await Promise.all(
            users.map(async (user) => {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                return { ...user, password: hashedPassword };
            })
        );

        await User.insertMany(usersWithHashedPasswords);
        console.log("Seed data inserted successfully");

        console.log("-----------------------------------");
        console.log("Some dummy accounts to log in with:");
        users.forEach((u) => {
            console.log(`Email: ${u.email} | Password: ${u.password}`);
        });
        console.log("-----------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedUsers();
