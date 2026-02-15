const express = require('express');
const { createBooking, updateBookingStatus, getBooking, getAllBookings, getUserBookings } = require('../controllers/booking');
const { verifyAdmin, verifyUser, verifyToken, verifyTokenOptional } = require('../utils/verifyToken');

const router = express.Router();

// CREATE (Public/User)
router.post("/", verifyTokenOptional, createBooking);

// UPDATE STATUS (Admin)
router.put("/:id", verifyAdmin, updateBookingStatus);

// GET (User/Admin)
router.get("/:id", verifyToken, getBooking);

// GET ALL (Admin)
router.get("/", verifyAdmin, getAllBookings);

// GET USER BOOKINGS
router.get("/user/:userId", verifyUser, getUserBookings);

module.exports = router;
