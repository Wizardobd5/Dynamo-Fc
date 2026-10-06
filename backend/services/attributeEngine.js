const { RATING_SCALE, ATTRIBUTE_WEIGHTS } = require('../config/weights');

/**
 * Normalizes rating value to 0-100 scale.
 * Supports raw 1-6 input or existing 0-100 value.
 */
function normalizeRating(val) {
  if (val === undefined || val === null || isNaN(val)) return 40; // Default Average
  const num = Number(val);
  if (num in RATING_SCALE) {
    return RATING_SCALE[num];
  }
  if (num >= 1 && num <= 6) {
    return Math.round((num - 1) * 20);
  }
  return Math.min(100, Math.max(0, num));
}

/**
 * Extracts and cleans normalized ratings map from raw payload.
 */
function extractNormalizedRatings(rawRatings = {}) {
  const getVal = (...keys) => {
    for (const k of keys) {
      if (rawRatings[k] !== undefined && rawRatings[k] !== null) {
        return normalizeRating(rawRatings[k]);
      }
    }
    return 40; // Default average
  };

  return {
    firstTouch: getVal('firstTouch'),
    ballControl: getVal('ballControl'),
    dribbling: getVal('dribbling'),
    pressureDribbling: getVal('pressureDribbling', 'dribblingPressure'),
    shortPassing: getVal('shortPassing'),
    longPassing: getVal('longPassing'),
    lineBreaking: getVal('lineBreaking'),
    throughBalls: getVal('throughBalls'),
    finishing: getVal('finishing'),
    longShots: getVal('longShots'),
    attackingMovement: getVal('attackingMovement'),
    crossing: getVal('crossing'),
    defending1v1: getVal('defending1v1'),
    defensiveReading: getVal('defensiveReading'),
    pressing: getVal('pressing'),
    speed: getVal('speed'),
    physicality: getVal('physicality'),
    gameReading: getVal('gameReading'),
    decisionMaking: getVal('decisionMaking'),
    rightPassing: getVal('rightPassing', 'rightPass'),
    leftPassing: getVal('leftPassing', 'leftPass'),
    rightShooting: getVal('rightShooting', 'rightShoot'),
    leftShooting: getVal('leftShooting', 'leftShoot')
  };
}

/**
 * Calculates shooting and passing foot composite scores based on preferred foot.
 */
function calculateFootComposites(ratings, preferredFoot = 'right') {
  const normPref = String(preferredFoot).toLowerCase();
  let shootingFoot = 0;
  let passingFoot = 0;
  let weakFootStars = 3;

  const rPass = ratings.rightPassing;
  const lPass = ratings.leftPassing;
  const rShoot = ratings.rightShooting;
  const lShoot = ratings.leftShooting;

  let primaryPass = rPass;
  let weakPass = lPass;
  let primaryShoot = rShoot;
  let weakShoot = lShoot;

  if (normPref === 'left') {
    primaryPass = lPass;
    weakPass = rPass;
    primaryShoot = lShoot;
    weakShoot = rShoot;
    passingFoot = 0.75 * lPass + 0.25 * rPass;
    shootingFoot = 0.75 * lShoot + 0.25 * rShoot;
  } else if (normPref === 'both') {
    passingFoot = 0.50 * rPass + 0.50 * lPass;
    shootingFoot = 0.50 * rShoot + 0.50 * lShoot;
    primaryPass = Math.max(rPass, lPass);
    weakPass = Math.min(rPass, lPass);
    primaryShoot = Math.max(rShoot, lShoot);
    weakShoot = Math.min(rShoot, lShoot);
  } else {
    // Default right
    passingFoot = 0.75 * rPass + 0.25 * lPass;
    shootingFoot = 0.75 * rShoot + 0.25 * lShoot;
  }

  // Calculate weak foot ratio
  const maxFoot = Math.max(primaryPass, primaryShoot, 20);
  const minFoot = (weakPass + weakShoot) / 2;
  const ratio = minFoot / maxFoot;

  if (normPref === 'both' || ratio >= 0.88) {
    weakFootStars = 5;
  } else if (ratio >= 0.70) {
    weakFootStars = 4;
  } else if (ratio >= 0.50) {
    weakFootStars = 3;
  } else if (ratio >= 0.30) {
    weakFootStars = 2;
  } else {
    weakFootStars = 1;
  }

  return {
    shootingFoot: Math.round(shootingFoot),
    passingFoot: Math.round(passingFoot),
    weakFootStars
  };
}

/**
 * Calculates 6 FIFA attributes: PAC, SHO, PAS, DRI, DEF, PHY.
 */
function calculateAttributes(rawRatings, preferredFoot = 'right') {
  const normRatings = extractNormalizedRatings(rawRatings);
  const foot = calculateFootComposites(normRatings, preferredFoot);

  const context = {
    ...normRatings,
    shootingFoot: foot.shootingFoot,
    passingFoot: foot.passingFoot
  };

  const calculateStat = (weightsObj) => {
    let sum = 0;
    let totalWeight = 0;
    for (const [key, weight] of Object.entries(weightsObj)) {
      if (key === 'boost') continue;
      if (context[key] !== undefined) {
        sum += context[key] * weight;
        totalWeight += weight;
      }
    }
    let result = totalWeight > 0 ? (sum / totalWeight) : 50;
    if (weightsObj.boost) {
      result += weightsObj.boost;
    }
    return Math.min(99, Math.max(1, Math.round(result)));
  };

  const pac = calculateStat(ATTRIBUTE_WEIGHTS.PAC);
  const sho = calculateStat(ATTRIBUTE_WEIGHTS.SHO);
  const pas = calculateStat(ATTRIBUTE_WEIGHTS.PAS);
  const dri = calculateStat(ATTRIBUTE_WEIGHTS.DRI);
  const def = calculateStat(ATTRIBUTE_WEIGHTS.DEF);
  const phy = calculateStat(ATTRIBUTE_WEIGHTS.PHY);

  return {
    normalizedRatings: normRatings,
    weakFootStars: foot.weakFootStars,
    shootingFootComposite: foot.shootingFoot,
    passingFootComposite: foot.passingFoot,
    attributes: {
      pace: pac,
      shooting: sho,
      passing: pas,
      dribbling: dri,
      defending: def,
      physical: phy,
      // Abbreviations for direct card rendering
      PAC: pac,
      SHO: sho,
      PAS: pas,
      DRI: dri,
      DEF: def,
      PHY: phy
    }
  };
}

module.exports = {
  normalizeRating,
  extractNormalizedRatings,
  calculateFootComposites,
  calculateAttributes
};
