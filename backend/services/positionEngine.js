const { POSITION_WEIGHTS } = require('../config/weights');

const TRAIT_LABELS = {
  firstTouch: 'First touch & receiving',
  ballControl: 'Tight ball control',
  dribbling: '1v1 dribbling & skill',
  pressureDribbling: 'Press resistance & composure',
  shortPassing: 'Short passing & combinations',
  longPassing: 'Long passing & switching',
  lineBreaking: 'Line-breaking forward passes',
  throughBalls: 'Through balls & chance creation',
  finishing: 'Finishing inside the box',
  longShots: 'Long-range shooting',
  attackingMovement: 'Attacking movement & runs',
  crossing: 'Crossing & final delivery',
  defending1v1: '1v1 defending & tackling',
  defensiveReading: 'Defensive reading & positioning',
  pressing: 'Pressing & work rate',
  speed: 'Pace & burst acceleration',
  physicality: 'Stamina & physical duels',
  gameReading: 'Game reading & tactical awareness',
  decisionMaking: 'Decision making & execution speed',
  rightPassing: 'Right-foot passing',
  leftPassing: 'Left-foot passing',
  rightShooting: 'Right-foot shooting',
  leftShooting: 'Left-foot shooting'
};

const POSITION_NAMES = {
  CB: 'Centre Back',
  LB: 'Left Back',
  RB: 'Right Back',
  CDM: 'Defensive Midfielder',
  CM: 'Central Midfielder',
  CAM: 'Attacking Midfielder',
  LW: 'Left Winger',
  RW: 'Right Winger',
  CF: 'Centre Forward',
  ST: 'Striker'
};

/**
 * Calculates scores for all 10 positions and determines best fit + secondary fit.
 */
function calculatePositions(normalizedRatings, currentPosition = 'CM') {
  const scores = {};

  for (const [pos, weightMap] of Object.entries(POSITION_WEIGHTS)) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [traitKey, weight] of Object.entries(weightMap)) {
      const val = normalizedRatings[traitKey] !== undefined ? normalizedRatings[traitKey] : 50;
      weightedSum += val * weight;
      totalWeight += weight;
    }

    const finalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
    scores[pos] = Math.min(99, Math.max(1, finalScore));
  }

  // Sort positions descending by score
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = {
    position: sorted[0][0],
    score: sorted[0][1],
    fullName: POSITION_NAMES[sorted[0][0]]
  };

  const secondCandidate = sorted[1];
  let secondary = null;

  // Confidence rule: Secondary >= 75 AND difference <= 15
  if (secondCandidate && secondCandidate[1] >= 75 && (primary.score - secondCandidate[1]) <= 15) {
    secondary = {
      position: secondCandidate[0],
      score: secondCandidate[1],
      fullName: POSITION_NAMES[secondCandidate[0]]
    };
  }

  // Identify strengths & development areas
  const ratingEntries = Object.entries(normalizedRatings)
    .filter(([key]) => TRAIT_LABELS[key] && !key.startsWith('left') && !key.startsWith('right'))
    .map(([key, val]) => ({ key, name: TRAIT_LABELS[key], value: val }));

  ratingEntries.sort((a, b) => b.value - a.value);

  const strengths = ratingEntries.filter(r => r.value >= 70).slice(0, 5);
  // If fewer than 3 strengths above 70, take top 3
  if (strengths.length < 3) {
    strengths.splice(0, strengths.length, ...ratingEntries.slice(0, 3));
  }

  const developmentAreas = [...ratingEntries].sort((a, b) => a.value - b.value).slice(0, 3);

  // Position specific reasons for primary fit
  const topWeightKeys = Object.entries(POSITION_WEIGHTS[primary.position] || {})
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  const explanations = [];
  for (const key of topWeightKeys) {
    const val = normalizedRatings[key] || 0;
    if (val >= 80) {
      const adjective = val >= 95 ? 'Elite' : val >= 85 ? 'Excellent' : 'Very good';
      explanations.push(`${adjective} ${TRAIT_LABELS[key] || key}`);
    }
  }

  if (explanations.length === 0) {
    explanations.push(`Balanced profile suited for ${primary.fullName}`);
    explanations.push(`Strong core football fundamentals`);
  }

  // Current position alignment
  const currentPosNorm = String(currentPosition).toUpperCase();
  const currentScore = scores[currentPosNorm] || 50;
  let alignmentNote = '';

  if (currentPosNorm === primary.position) {
    alignmentNote = `Your current position (${currentPosNorm}) perfectly matches our algorithmic recommendation.`;
  } else if (secondary && secondary.position === currentPosNorm) {
    alignmentNote = `Your current position (${currentPosNorm}) is an exceptional secondary fit (${currentScore}/100), with ${primary.position} offering even higher ceiling based on your play profile.`;
  } else {
    alignmentNote = `Currently playing ${currentPosNorm} (${currentScore}/100). The system identifies a stronger natural ceiling at ${primary.position} (${primary.score}/100).`;
  }

  return {
    positions: scores,
    rankedList: sorted.map(([pos, score]) => ({ position: pos, score, fullName: POSITION_NAMES[pos] })),
    primaryPosition: primary.position,
    primaryScore: primary.score,
    primaryFullName: primary.fullName,
    secondaryPosition: secondary ? secondary.position : null,
    secondaryScore: secondary ? secondary.score : null,
    secondaryFullName: secondary ? secondary.fullName : null,
    currentPosition: currentPosNorm,
    currentPositionScore: currentScore,
    alignmentNote,
    explanations: explanations.slice(0, 6),
    strengths: strengths.map(s => ({ name: s.name, value: s.value })),
    developmentAreas: developmentAreas.map(d => ({ name: d.name, value: d.value }))
  };
}

module.exports = {
  calculatePositions,
  TRAIT_LABELS,
  POSITION_NAMES
};
