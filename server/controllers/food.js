const Food = require('../models/Food');

const createFood = async (req, res, next) => {
    const newFood = new Food(req.body);
    try {
        const savedFood = await newFood.save();
        res.status(200).json(savedFood);
    } catch (err) {
        next(err);
    }
};

const updateFood = async (req, res, next) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedFood);
    } catch (err) {
        next(err);
    }
};

const deleteFood = async (req, res, next) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.status(200).json("Food item has been deleted.");
    } catch (err) {
        next(err);
    }
};

const getFood = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id);
        res.status(200).json(food);
    } catch (err) {
        next(err);
    }
};

const getFoods = async (req, res, next) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (err) {
        next(err);
    }
};

module.exports = { createFood, updateFood, deleteFood, getFood, getFoods };
