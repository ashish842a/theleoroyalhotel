const express = require('express');
const { createFood, updateFood, deleteFood, getFood, getFoods } = require('../controllers/food');
const { verifyAdmin } = require('../utils/verifyToken');

const router = express.Router();

router.post("/", verifyAdmin, createFood);
router.put("/:id", verifyAdmin, updateFood);
router.delete("/:id", verifyAdmin, deleteFood);
router.get("/:id", getFood);
router.get("/", getFoods);

module.exports = router;
