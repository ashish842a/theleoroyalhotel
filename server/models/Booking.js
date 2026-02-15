const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest
    guestDetails: {
        name: { type: String, required: function () { return !this.user; } },
        email: { type: String },
        phone: { type: String, required: function () { return !this.user; } },
    },
    guests: [{
        name: { type: String },
        age: { type: Number },
        gender: { type: String }
    }],
    bookingType: { type: String, enum: ['room', 'hall', 'restaurant'], required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    hall: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall' },
    checkInDate: { type: Date },
    checkOutDate: { type: Date },
    bookingDate: { type: Date, default: Date.now },
    purpose: { type: String },
    specialRequest: { type: String },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Rejected'], default: 'Pending' },
    totalAmount: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
