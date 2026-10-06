const { readPlayers, writePlayers } = require('../config/db');
const { calculateAttributes } = require('../services/attributeEngine');
const { calculatePositions } = require('../services/positionEngine');
const { calculateOverall } = require('../services/overallEngine');
const { determinePlaystyle } = require('../services/playstyleEngine');

function generateId() {
  return 'ply_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

/**
 * Builds a complete player record from basic info and 20 ratings
 */
function buildFullPlayerRecord(playerInput) {
  const name = (playerInput.name || playerInput.playerName || 'Unnamed Player').trim();
  const preferredFoot = (playerInput.preferredFoot || 'right').toLowerCase();
  const currentPosition = (playerInput.currentPosition || 'CM').toUpperCase();
  const jerseyNumber = Number(playerInput.jerseyNumber) || 10;
  const teamName = (playerInput.teamName || 'Dynamo FC').trim();

  // Calculate stats via engines
  const attrResult = calculateAttributes(playerInput.ratings, preferredFoot);
  const posResult = calculatePositions(attrResult.normalizedRatings, currentPosition);
  const ovrResult = calculateOverall(attrResult.attributes, posResult.primaryPosition);
  const playstyle = determinePlaystyle(posResult.primaryPosition, attrResult.attributes, attrResult.normalizedRatings);

  return {
    _id: playerInput._id || playerInput.id || generateId(),
    name,
    preferredFoot,
    currentPosition,
    jerseyNumber,
    teamName,
    ratings: attrResult.normalizedRatings,
    rawRatings: playerInput.ratings || {},
    attributes: attrResult.attributes,
    positions: posResult.positions,
    rankedPositions: posResult.rankedList,
    primaryPosition: posResult.primaryPosition,
    primaryScore: posResult.primaryScore,
    primaryFullName: posResult.primaryFullName,
    secondaryPosition: posResult.secondaryPosition,
    secondaryScore: posResult.secondaryScore,
    secondaryFullName: posResult.secondaryFullName,
    currentPositionScore: posResult.currentPositionScore,
    alignmentNote: posResult.alignmentNote,
    overall: ovrResult.overall,
    cardTier: ovrResult.cardTier,
    tierLabel: ovrResult.tierLabel,
    playstyle,
    weakFootStars: attrResult.weakFootStars,
    strengths: posResult.strengths,
    developmentAreas: posResult.developmentAreas,
    explanations: posResult.explanations,
    createdAt: playerInput.createdAt || new Date().toISOString()
  };
}

class PlayerModel {
  static getAll() {
    return readPlayers();
  }

  static getById(id) {
    const players = readPlayers();
    return players.find(p => p._id === id || p.id === id) || null;
  }

  static create(playerData) {
    const fullRecord = buildFullPlayerRecord(playerData);
    const players = readPlayers();
    players.push(fullRecord);
    writePlayers(players);
    return fullRecord;
  }

  static update(id, updateData) {
    const players = readPlayers();
    const index = players.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;

    const merged = { ...players[index], ...updateData };
    if (updateData.ratings || updateData.preferredFoot || updateData.currentPosition) {
      const recomputed = buildFullPlayerRecord(merged);
      players[index] = { ...recomputed, _id: id };
    } else {
      players[index] = merged;
    }

    writePlayers(players);
    return players[index];
  }

  static delete(id) {
    const players = readPlayers();
    const filtered = players.filter(p => p._id !== id && p.id !== id);
    if (filtered.length === players.length) return false;
    writePlayers(filtered);
    return true;
  }

  static seedDefaultsIfEmpty() {
    return readPlayers();
  }
}

module.exports = {
  PlayerModel,
  buildFullPlayerRecord
};
