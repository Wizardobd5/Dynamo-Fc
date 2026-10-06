const { OVERALL_WEIGHTS } = require('../config/weights');

/**
 * Calculates position-specific overall rating (0-99).
 * Uses positional weighting matrix and positional mastery scaling.
 */
function calculateOverall(attributes, primaryPosition = 'CAM') {
  const weights = OVERALL_WEIGHTS[primaryPosition] || OVERALL_WEIGHTS.CAM;

  const attrMap = {
    PAC: attributes.pace || attributes.PAC || 50,
    SHO: attributes.shooting || attributes.SHO || 50,
    PAS: attributes.passing || attributes.PAS || 50,
    DRI: attributes.dribbling || attributes.DRI || 50,
    DEF: attributes.defending || attributes.DEF || 50,
    PHY: attributes.physical || attributes.PHY || 50
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [stat, weight] of Object.entries(weights)) {
    weightedSum += (attrMap[stat] || 50) * weight;
    totalWeight += weight;
  }

  const baseWeighted = totalWeight > 0 ? (weightedSum / totalWeight) : 50;

  // Calibrate overall curve to match FIFA card scaling standards
  // Highly specialized key stats elevate the overall tier
  const topStats = Object.values(attrMap).sort((a, b) => b - a);
  let specializationBonus = 0;
  if (topStats[0] >= 90) specializationBonus += 2.5;
  if (topStats[1] >= 88) specializationBonus += 1.5;

  const rawOverall = Math.round(baseWeighted * 1.01 + specializationBonus);
  const overall = Math.min(99, Math.max(45, rawOverall));

  // Determine card tier based on overall
  let cardTier = 'bronze';
  let tierLabel = 'Standard Bronze';
  if (overall >= 85) {
    cardTier = 'gold-rare';
    tierLabel = 'Elite Walkout (85+)';
  } else if (overall >= 75) {
    cardTier = 'gold';
    tierLabel = 'Gold Standard (75-84)';
  } else if (overall >= 65) {
    cardTier = 'silver';
    tierLabel = 'Silver Contender (65-74)';
  }

  return {
    overall,
    cardTier,
    tierLabel,
    primaryPosition
  };
}

module.exports = {
  calculateOverall
};
