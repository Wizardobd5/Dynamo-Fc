const { PlayerModel } = require('../models/Player');
const { QUESTIONS } = require('../config/weights');

// GET /api/players
exports.getAllPlayers = (req, res) => {
  try {
    let players = PlayerModel.getAll();

    // Filtering
    const { position, minOverall, search, sort } = req.query;

    if (position) {
      players = players.filter(p => p.primaryPosition === position.toUpperCase() || p.currentPosition === position.toUpperCase());
    }

    if (minOverall) {
      players = players.filter(p => p.overall >= Number(minOverall));
    }

    if (search) {
      const q = search.toLowerCase();
      players = players.filter(p => p.name.toLowerCase().includes(q));
    }

    // Sorting
    if (sort === 'overall_desc') {
      players.sort((a, b) => b.overall - a.overall);
    } else if (sort === 'overall_asc') {
      players.sort((a, b) => a.overall - b.overall);
    } else if (sort === 'name') {
      players.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'newest') {
      players.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default: sort by overall descending
      players.sort((a, b) => b.overall - a.overall);
    }

    res.json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/players/:id
exports.getPlayerById = (req, res) => {
  try {
    const player = PlayerModel.getById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    res.json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/players
exports.createPlayer = (req, res) => {
  try {
    const { name, preferredFoot, currentPosition, ratings, jerseyNumber, teamName } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Player name is required' });
    }

    const player = PlayerModel.create({
      name,
      preferredFoot: preferredFoot || 'right',
      currentPosition: currentPosition || 'CM',
      jerseyNumber: jerseyNumber || 10,
      teamName: teamName || 'Dynamo FC',
      ratings: ratings || {}
    });

    res.status(201).json({
      success: true,
      message: 'Player created and evaluated successfully',
      data: player
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/players/:id
exports.updatePlayer = (req, res) => {
  try {
    const updated = PlayerModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    res.json({ success: true, message: 'Player updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/players/:id
exports.deletePlayer = (req, res) => {
  try {
    const success = PlayerModel.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    res.json({ success: true, message: 'Player removed from squad' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/players/:id/assessment
exports.submitAssessment = (req, res) => {
  try {
    const { ratings } = req.body;
    if (!ratings) {
      return res.status(400).json({ success: false, message: 'Assessment ratings are required' });
    }

    const updated = PlayerModel.update(req.params.id, { ratings });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    res.json({
      success: true,
      message: 'Assessment calculated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/config/questions
exports.getQuestions = (req, res) => {
  res.json({
    success: true,
    data: QUESTIONS
  });
};

// GET /api/team
exports.getTeamOverview = (req, res) => {
  try {
    const players = PlayerModel.getAll();
    const count = players.length;

    if (count === 0) {
      return res.json({
        success: true,
        data: {
          totalPlayers: 0,
          averageOverall: 0,
          averagePace: 0,
          averageShooting: 0,
          averagePassing: 0,
          averageDribbling: 0,
          averageDefending: 0,
          averagePhysical: 0,
          positionCounts: {},
          players: []
        }
      });
    }

    const sum = (fn) => players.reduce((acc, p) => acc + (fn(p) || 0), 0);
    const avg = (fn) => Math.round(sum(fn) / count);

    const positionCounts = {};
    players.forEach(p => {
      const pos = p.primaryPosition || 'CM';
      positionCounts[pos] = (positionCounts[pos] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalPlayers: count,
        averageOverall: avg(p => p.overall),
        averagePace: avg(p => p.attributes?.pace),
        averageShooting: avg(p => p.attributes?.shooting),
        averagePassing: avg(p => p.attributes?.passing),
        averageDribbling: avg(p => p.attributes?.dribbling),
        averageDefending: avg(p => p.attributes?.defending),
        averagePhysical: avg(p => p.attributes?.physical),
        positionCounts,
        players
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/team/positions
exports.getPlayersByPosition = (req, res) => {
  try {
    const players = PlayerModel.getAll();
    const positions = ['ST', 'CF', 'LW', 'RW', 'CAM', 'CM', 'CDM', 'LB', 'RB', 'CB'];
    const grouped = {};

    positions.forEach(pos => {
      grouped[pos] = [];
    });

    players.forEach(p => {
      const pos = p.primaryPosition || 'CM';
      if (!grouped[pos]) grouped[pos] = [];
      grouped[pos].push(p);
    });

    // Sort each position list by overall descending
    Object.keys(grouped).forEach(k => {
      grouped[k].sort((a, b) => b.overall - a.overall);
    });

    res.json({
      success: true,
      data: grouped
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/compare?p1=id1&p2=id2
exports.comparePlayers = (req, res) => {
  try {
    const { p1, p2 } = req.query;
    if (!p1 || !p2) {
      return res.status(400).json({ success: false, message: 'Please provide both p1 and p2 IDs' });
    }

    const player1 = PlayerModel.getById(p1);
    const player2 = PlayerModel.getById(p2);

    if (!player1 || !player2) {
      return res.status(404).json({ success: false, message: 'One or both players not found' });
    }

    const diff = {
      overall: player1.overall - player2.overall,
      pace: (player1.attributes?.pace || 0) - (player2.attributes?.pace || 0),
      shooting: (player1.attributes?.shooting || 0) - (player2.attributes?.shooting || 0),
      passing: (player1.attributes?.passing || 0) - (player2.attributes?.passing || 0),
      dribbling: (player1.attributes?.dribbling || 0) - (player2.attributes?.dribbling || 0),
      defending: (player1.attributes?.defending || 0) - (player2.attributes?.defending || 0),
      physical: (player1.attributes?.physical || 0) - (player2.attributes?.physical || 0)
    };

    res.json({
      success: true,
      data: {
        player1,
        player2,
        diff
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
