const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/theleoroyalhotel')
    .then(async () => {
        console.log('MongoDB Connected');

        const userId = '6984d79b563d2022a3f9bab0'; // ID from logs
        console.log(`Checking User content for ID: ${userId}`);

        try {
            const user = await User.findById(userId);
            if (user) {
                console.log('User FOUND:', user.email);

                const allBookings = await Booking.find();
                console.log(`Total Bookings in DB: ${allBookings.length}`);
                allBookings.forEach(b => {
                    console.log(`ID: ${b._id}, User: ${b.user}, GuestEmail: ${b.guestDetails?.email}`);
                });

            } else {
                console.log('User NOT FOUND. This confirms why missing createError would crash.');
            }
        } catch (err) {
            console.error('Error querying DB:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.log(err));
