const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/players/:id/card', cardController.getPlayerCard);

module.exports = router;
