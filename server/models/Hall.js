const mongoose = require('mongoose');

const HallSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Hall', HallSchema);
