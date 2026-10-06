const { PlayerModel } = require('../models/Player');

// GET /api/players/:id/card
exports.getPlayerCard = (req, res) => {
  try {
    const player = PlayerModel.getById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    const card = {
      id: player._id,
      name: player.name,
      overall: player.overall,
      primaryPosition: player.primaryPosition,
      primaryFullName: player.primaryFullName,
      secondaryPosition: player.secondaryPosition,
      currentPosition: player.currentPosition,
      jerseyNumber: player.jerseyNumber,
      teamName: player.teamName || 'Dynamo FC',
      preferredFoot: player.preferredFoot,
      weakFootStars: player.weakFootStars,
      cardTier: player.cardTier,
      tierLabel: player.tierLabel,
      playstyle: player.playstyle,
      attributes: {
        PAC: player.attributes.pace,
        SHO: player.attributes.shooting,
        PAS: player.attributes.passing,
        DRI: player.attributes.dribbling,
        DEF: player.attributes.defending,
        PHY: player.attributes.physical
      },
      topStrengths: player.strengths ? player.strengths.slice(0, 3) : [],
      createdAt: player.createdAt
    };

    res.json({
      success: true,
      data: card
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
