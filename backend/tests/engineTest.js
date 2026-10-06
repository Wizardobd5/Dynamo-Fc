const { calculateAttributes } = require('../services/attributeEngine');
const { calculatePositions } = require('../services/positionEngine');
const { calculateOverall } = require('../services/overallEngine');
const { determinePlaystyle } = require('../services/playstyleEngine');

const samplePlayer = {
  playerName: "Obaid Khan",
  preferredFoot: "right",
  currentPosition: "CM",
  ratings: {
    firstTouch: 6,
    ballControl: 6,
    dribbling: 5,
    pressureDribbling: 5,
    shortPassing: 6,
    longPassing: 4,
    lineBreaking: 6,
    throughBalls: 6,
    finishing: 4,
    longShots: 5,
    attackingMovement: 5,
    crossing: 3,
    defending1v1: 2,
    defensiveReading: 3,
    pressing: 4,
    speed: 4,
    physicality: 4,
    gameReading: 6,
    decisionMaking: 6,
    rightPassing: 6,
    leftPassing: 4,
    rightShooting: 6,
    leftShooting: 3
  }
};

console.log("=== RUNNING ENGINE VERIFICATION ===");
const attrResult = calculateAttributes(samplePlayer.ratings, samplePlayer.preferredFoot);
console.log("Attributes:", attrResult.attributes);
console.log("Weak Foot Stars:", attrResult.weakFootStars);

const posResult = calculatePositions(attrResult.normalizedRatings, samplePlayer.currentPosition);
console.log("Position Fit Scores:", posResult.positions);
console.log("Primary:", posResult.primaryPosition, posResult.primaryScore);
console.log("Secondary:", posResult.secondaryPosition, posResult.secondaryScore);

const ovrResult = calculateOverall(attrResult.attributes, posResult.primaryPosition);
console.log("Overall:", ovrResult.overall, ovrResult.tierLabel);

const playstyle = determinePlaystyle(posResult.primaryPosition, attrResult.attributes, attrResult.normalizedRatings);
console.log("Playstyle:", playstyle.name, playstyle.icon);
