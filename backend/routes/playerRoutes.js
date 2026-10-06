const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Team routes
router.get('/team', playerController.getTeamOverview);
router.get('/team/positions', playerController.getPlayersByPosition);
router.get('/compare', playerController.comparePlayers);
router.get('/config/questions', playerController.getQuestions);

// Player CRUD & Assessment
router.get('/players', playerController.getAllPlayers);
router.get('/players/:id', playerController.getPlayerById);
router.post('/players', playerController.createPlayer);
router.put('/players/:id', playerController.updatePlayer);
router.delete('/players/:id', playerController.deletePlayer);
router.post('/players/:id/assessment', playerController.submitAssessment);

module.exports = router;
