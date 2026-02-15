const express = require('express');
const { createHall, updateHall, deleteHall, getHall, getHalls } = require('../controllers/hall');
const { verifyAdmin } = require('../utils/verifyToken');

const router = express.Router();

router.post("/", verifyAdmin, createHall);
router.put("/:id", verifyAdmin, updateHall);
router.delete("/:id", verifyAdmin, deleteHall);
router.get("/:id", getHall);
router.get("/", getHalls);

module.exports = router;
