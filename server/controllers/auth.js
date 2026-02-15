const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { createError } = require('../utils/verifyToken');

const register = async (req, res, next) => {
    try {
        console.log("Register Request Received:", req.body); // DEBUG LOG
        if (!req.body.name || !req.body.email || !req.body.password) {
            return next(createError(400, "All fields are required!"));
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) return next(createError(409, "User with this email already exists!"));

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash,
        });

        await newUser.save();
        res.status(201).send("User has been created."); // Changed to 201 Created
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return next(createError(400, "All fields are required!"));
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found!"));

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(400, "Wrong password or username!"));

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        const { password, ...otherDetails } = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json({ details: { ...otherDetails }, role: user.role });
    } catch (err) {
        next(err);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found"));

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and save to DB
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
        // Note: Ideally react app url: http://localhost:3000/reset-password/${resetToken}
        // But for testing we can send the token.
        // Let's send the client-side URL

        // Get client URL from the request origin (e.g., http://localhost:3000 or http://10.109.203.212:3000)
        let clientUrl = req.headers.origin;

        // Fallback if origin is missing (e.g. postman) or if we want to enforce env
        if (!clientUrl) {
            clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        }

        const resetLink = `${clientUrl}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetLink}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ success: true, data: "Email sent" });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(createError(500, "Email could not be sent"));
        }
    } catch (err) {
        next(err);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return next(createError(400, "Invalid Token"));

        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(req.body.password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, data: "Password Updated Success" });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, forgotPassword, resetPassword };
