const Hall = require('../models/Hall');

const createHall = async (req, res, next) => {
    const newHall = new Hall(req.body);
    try {
        const savedHall = await newHall.save();
        res.status(200).json(savedHall);
    } catch (err) {
        next(err);
    }
};

const updateHall = async (req, res, next) => {
    try {
        const updatedHall = await Hall.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedHall);
    } catch (err) {
        next(err);
    }
};

const deleteHall = async (req, res, next) => {
    try {
        await Hall.findByIdAndDelete(req.params.id);
        res.status(200).json("Hall has been deleted.");
    } catch (err) {
        next(err);
    }
};

const getHall = async (req, res, next) => {
    try {
        const hall = await Hall.findById(req.params.id);
        res.status(200).json(hall);
    } catch (err) {
        next(err);
    }
};

const getHalls = async (req, res, next) => {
    try {
        const halls = await Hall.find();
        res.status(200).json(halls);
    } catch (err) {
        next(err);
    }
};

module.exports = { createHall, updateHall, deleteHall, getHall, getHalls };
