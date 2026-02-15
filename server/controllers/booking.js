const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hall = require('../models/Hall');
const User = require('../models/User');
const { createError } = require('../utils/verifyToken');

const createBooking = async (req, res, next) => {
    try {
        // Basic validation logic
        // If not logged in, ensure guestDetails are present

        if (req.user) {
            req.body.user = req.user.id;
        }

        console.log("Creating booking with body:", JSON.stringify(req.body, null, 2)); // DEBUG LOG

        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        res.status(200).json(savedBooking);
    } catch (err) {
        console.error("Error creating booking:", err); // DEBUG LOG
        next(err);
    }
};

const updateBookingStatus = async (req, res, next) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json(updatedBooking);
    } catch (err) {
        next(err);
    }
};

const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        res.status(200).json(booking);
    } catch (err) {
        next(err);
    }
};

const getAllBookings = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, status, startDate, endDate, dateType = 'checkin' } = req.query;

        const query = {};

        // Status Filter
        if (status && status !== 'All') {
            query.status = status;
        }

        // Search Filter (Complex because of populated fields and multiple variants)
        // Note: Mongoose doesn't easily support searching populated fields in the main query without aggregations.
        // For simplicity in this implementation, we will first find the users/guests if search term is provided,
        // OR we can rely on a simpler text search on direct fields and maybe use aggregation if needed.
        // However, standard industry practice for simple admin panels often involves:
        // 1. Search by Booking ID (direct)
        // 2. Search by Guest Email/Name (direct on GuestDetails)
        // 3. For populated User fields, it's trickier.

        if (search) {
            const searchRegex = new RegExp(search, 'i');

            // We'll search primarily on direct fields for efficiency
            // To search users, we'd need to first find users matching the name, then find bookings for them.
            // Let's keep it simple and robust for now:

            const users = await User.find({
                $or: [{ name: searchRegex }, { email: searchRegex }]
            }).select('_id');
            const userIds = users.map(u => u._id);

            query.$or = [
                { _id: { $regex: searchRegex } }, // MongoDB ObjectId as string might not work directly with regex in some versions, but exact ID match is better usually.
                // If _id lookup fails with regex, we can try strict match if search looks like an ID
                { 'guestDetails.name': searchRegex },
                { 'guestDetails.email': searchRegex },
                { user: { $in: userIds } }
            ];
        }

        // Date Filter
        if (startDate || endDate) {
            const dateField = dateType === 'booking' ? 'createdAt' : 'checkInDate'; // Defaulting checkInDate for 'checkin'
            // usage: checkInDate for rooms, bookingDate for others. 
            // This is slightly complex because field names differ.
            // We might need to handle this conditionally or use $or logic if we want to be strict.

            let dateQuery = {};
            if (startDate) dateQuery.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateQuery.$lte = end;
            }

            if (dateType === 'booking') {
                query.createdAt = dateQuery;
            } else {
                // Hybrid Logic for 'checkin' / 'schedule'
                query.$or = [
                    { bookingType: 'room', checkInDate: dateQuery },
                    { bookingType: { $ne: 'room' }, bookingDate: dateQuery }
                ];
                // If we successfully added a search $or before, we need to merge with $and
                if (query.$or && query.$or.length > 2) { // crude check if search exists
                    // This simple merger is getting risky. 
                    // Let's reconstruct to be safe: use $and top level
                    const searchOr = [...query.$or];
                    delete query.$or;
                    query.$and = [
                        { $or: searchOr },
                        {
                            $or: [
                                { bookingType: 'room', checkInDate: dateQuery },
                                { bookingType: { $ne: 'room' }, bookingDate: dateQuery }
                            ]
                        }
                    ];
                } else {
                    // No search $or, so just use date $or
                    // But wait, if we used query.$or for search, we need to be careful not to overwrite.
                }
            }
        }

        // Re-implementing clearer query construction for safety
        const finalQuery = {};
        const andConditions = [];

        if (status && status !== 'All') {
            andConditions.push({ status: status });
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            const users = await User.find({
                $or: [{ name: searchRegex }, { email: searchRegex }]
            }).select('_id');
            const userIds = users.map(u => u._id);

            // Handle ID specially?
            let orSearch = [
                { 'guestDetails.name': searchRegex },
                { 'guestDetails.email': searchRegex },
                { user: { $in: userIds } }
            ];
            // Try to see if search is a valid ObjectId, if so add exact match
            const isValidObjectId = (id) => id.match(/^[0-9a-fA-F]{24}$/);
            if (isValidObjectId(search)) {
                orSearch.push({ _id: search });
            }

            andConditions.push({ $or: orSearch });
        }

        if (startDate || endDate) {
            let dateQuery = {};
            if (startDate) dateQuery.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateQuery.$lte = end;
            }

            if (dateType === 'booking') {
                andConditions.push({ createdAt: dateQuery });
            } else {
                andConditions.push({
                    $or: [
                        { bookingType: 'room', checkInDate: dateQuery },
                        { bookingType: { $ne: 'room' }, bookingDate: dateQuery }
                    ]
                });
            }
        }

        if (andConditions.length > 0) {
            finalQuery.$and = andConditions;
        }

        const count = await Booking.countDocuments(finalQuery);

        const bookings = await Booking.find(finalQuery)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user room hall');

        res.status(200).json({
            bookings,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalBookings: count
        });
    } catch (err) {
        console.error("Error in getAllBookings:", err);
        next(err);
    }
};

const getUserBookings = async (req, res, next) => {
    try {
        console.log("Fetching bookings for user:", req.params.userId); // DEBUG LOG

        // Find the user to get their email
        const user = await User.findById(req.params.userId);
        if (!user) return next(createError(404, "User not found!"));

        // Find bookings where user ID matches OR guest email matches
        const bookings = await Booking.find({
            $or: [
                { user: req.params.userId },
                { "guestDetails.email": user.email }
            ]
        }).sort({ createdAt: -1 }).populate('room hall');

        console.log("Found bookings:", bookings.length); // DEBUG LOG
        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
};

module.exports = { createBooking, updateBookingStatus, getBooking, getAllBookings, getUserBookings };
