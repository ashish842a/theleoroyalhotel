const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/theleoroyalhotel');
        console.log("Connected to MongoDB...");

        const email = "admin@gmail.com";
        const password = "admin@123";
        const name = "Admin User";
        const phone = "0000000000";

        // Check if user exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("User already exists. Updating role to admin...");
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            existingUser.role = "admin";
            existingUser.password = hash; // Update password to ensure it matches request
            await existingUser.save();
            console.log("Admin user updated successfully!");
        } else {
            console.log("Creating new admin user...");
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const newUser = new User({
                name,
                email,
                password: hash,
                phone,
                role: "admin"
            });

            await newUser.save();
            console.log("Admin user created successfully!");
        }

        process.exit();
    } catch (err) {
        console.error("Error creating admin:", err);
        process.exit(1);
    }
};

createAdmin();
