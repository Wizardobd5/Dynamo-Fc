// Calibration & Weight configuration for Local Football Player Card System

const RATING_SCALE = {
  1: 0,
  2: 20,
  3: 40,
  4: 60,
  5: 80,
  6: 100
};

// Attribute engine weights calibrated to EA FC / Blueprint benchmark
const ATTRIBUTE_WEIGHTS = {
  // PAC target for Obaid: 82
  PAC: {
    speed: 0.35,
    attackingMovement: 0.25,
    dribbling: 0.20,
    pressureDribbling: 0.15,
    physicality: 0.05,
    boost: 10
  },
  // SHO target for Obaid: 76
  SHO: {
    finishing: 0.35,
    longShots: 0.25,
    shootingFoot: 0.20,
    attackingMovement: 0.10,
    decisionMaking: 0.05,
    firstTouch: 0.05
  },
  // PAS target for Obaid: 91
  PAS: {
    shortPassing: 0.18,
    throughBalls: 0.18,
    lineBreaking: 0.16,
    passingFoot: 0.16,
    longPassing: 0.20,
    firstTouch: 0.04,
    gameReading: 0.04,
    decisionMaking: 0.04
  },
  // DRI target for Obaid: 89
  DRI: {
    ballControl: 0.23,
    firstTouch: 0.23,
    dribbling: 0.24,
    pressureDribbling: 0.18,
    speed: 0.06,
    decisionMaking: 0.06
  },
  // DEF target for Obaid: 51
  DEF: {
    defending1v1: 0.28,
    defensiveReading: 0.24,
    pressing: 0.18,
    physicality: 0.12,
    gameReading: 0.09,
    decisionMaking: 0.09
  },
  // PHY target for Obaid: 68
  PHY: {
    physicality: 0.28,
    pressureDribbling: 0.22,
    attackingMovement: 0.20,
    pressing: 0.15,
    speed: 0.10,
    defensiveReading: 0.05
  }
};

// Position Weight Matrix for 10 Outfield Positions
// Calibrated to produce exact blueprint position scores:
// CAM: 91, CM: 88, CF: 74, RW: 67, LW: 62, CDM: 58, LB: 61, RB: 63, CB: 52, ST: 51
const POSITION_WEIGHTS = {
  CAM: {
    lineBreaking: 0.14,
    throughBalls: 0.14,
    ballControl: 0.12,
    firstTouch: 0.10,
    shortPassing: 0.10,
    gameReading: 0.08,
    decisionMaking: 0.08,
    dribbling: 0.08,
    longShots: 0.06,
    finishing: 0.05,
    defending1v1: 0.03,
    defensiveReading: 0.02
  },
  CM: {
    shortPassing: 0.14,
    gameReading: 0.11,
    decisionMaking: 0.11,
    lineBreaking: 0.10,
    ballControl: 0.09,
    firstTouch: 0.09,
    throughBalls: 0.08,
    longPassing: 0.08,
    pressing: 0.07,
    physicality: 0.07,
    defending1v1: 0.03,
    defensiveReading: 0.03
  },
  CF: {
    finishing: 0.18,
    attackingMovement: 0.16,
    firstTouch: 0.12,
    ballControl: 0.12,
    longShots: 0.10,
    throughBalls: 0.08,
    dribbling: 0.08,
    shortPassing: 0.08,
    defending1v1: 0.04,
    physicality: 0.04
  },
  RW: {
    speed: 0.22,
    dribbling: 0.18,
    crossing: 0.18,
    attackingMovement: 0.12,
    pressureDribbling: 0.10,
    ballControl: 0.08,
    finishing: 0.06,
    defending1v1: 0.06
  },
  LW: {
    speed: 0.22,
    dribbling: 0.18,
    crossing: 0.20,
    attackingMovement: 0.12,
    pressureDribbling: 0.10,
    ballControl: 0.06,
    finishing: 0.06,
    defending1v1: 0.06
  },
  CDM: {
    defending1v1: 0.22,
    defensiveReading: 0.20,
    pressing: 0.16,
    physicality: 0.16,
    gameReading: 0.09,
    shortPassing: 0.07,
    lineBreaking: 0.05,
    decisionMaking: 0.05
  },
  RB: {
    defending1v1: 0.22,
    defensiveReading: 0.18,
    speed: 0.16,
    crossing: 0.16,
    physicality: 0.10,
    pressing: 0.08,
    shortPassing: 0.05,
    ballControl: 0.05
  },
  LB: {
    defending1v1: 0.22,
    defensiveReading: 0.18,
    speed: 0.16,
    crossing: 0.18,
    physicality: 0.10,
    pressing: 0.08,
    shortPassing: 0.04,
    ballControl: 0.04
  },
  CB: {
    defending1v1: 0.32,
    defensiveReading: 0.30,
    physicality: 0.20,
    pressing: 0.08,
    gameReading: 0.04,
    decisionMaking: 0.03,
    longPassing: 0.03
  },
  ST: {
    finishing: 0.28,
    attackingMovement: 0.18,
    speed: 0.14,
    physicality: 0.12,
    longShots: 0.10,
    defending1v1: 0.08,
    firstTouch: 0.06,
    ballControl: 0.04
  }
};

// Overall rating attribute weights per primary position
const OVERALL_WEIGHTS = {
  CAM: { PAS: 0.30, DRI: 0.25, SHO: 0.20, PAC: 0.12, PHY: 0.08, DEF: 0.05 },
  CM:  { PAS: 0.28, DRI: 0.20, PHY: 0.18, DEF: 0.14, SHO: 0.10, PAC: 0.10 },
  CDM: { DEF: 0.32, PHY: 0.28, PAS: 0.22, DRI: 0.08, PAC: 0.06, SHO: 0.04 },
  CB:  { DEF: 0.40, PHY: 0.32, PAC: 0.12, PAS: 0.10, DRI: 0.04, SHO: 0.02 },
  LB:  { DEF: 0.25, PAC: 0.25, PHY: 0.18, PAS: 0.16, DRI: 0.12, SHO: 0.04 },
  RB:  { DEF: 0.25, PAC: 0.25, PHY: 0.18, PAS: 0.16, DRI: 0.12, SHO: 0.04 },
  LW:  { PAC: 0.30, DRI: 0.26, SHO: 0.18, PAS: 0.16, PHY: 0.06, DEF: 0.04 },
  RW:  { PAC: 0.30, DRI: 0.26, SHO: 0.18, PAS: 0.16, PHY: 0.06, DEF: 0.04 },
  CF:  { SHO: 0.28, DRI: 0.24, PAS: 0.20, PAC: 0.16, PHY: 0.08, DEF: 0.04 },
  ST:  { SHO: 0.35, PAC: 0.25, DRI: 0.16, PHY: 0.14, PAS: 0.07, DEF: 0.03 }
};

// Question metadata with human friendly descriptions and measured traits
const QUESTIONS = [
  // BALL MASTERY
  {
    id: "firstTouch",
    category: "Ball Mastery",
    number: 1,
    title: "First Touch & Receiving",
    text: "How would you rate your ability to receive and control the ball, including difficult, fast or pressured passes?",
    measures: ["First touch", "Receiving", "Cushioning", "Control while receiving"]
  },
  {
    id: "ballControl",
    category: "Ball Mastery",
    number: 2,
    title: "Ball Control",
    text: "How would you rate your close ball control while moving, turning, protecting the ball and playing in tight spaces?",
    measures: ["Close control", "Turning", "Ball protection", "Tight-space control"]
  },
  {
    id: "dribbling",
    category: "Ball Mastery",
    number: 3,
    title: "Dribbling & 1v1",
    text: "How would you rate your ability to dribble and beat an opponent in a 1v1 situation?",
    measures: ["Dribbling", "Skill", "1v1 ability", "Change of direction"]
  },
  {
    id: "pressureDribbling",
    category: "Ball Mastery",
    number: 4,
    title: "Dribbling Under Pressure",
    text: "How would you rate your ability to keep possession and progress with the ball when opponents are pressing or surrounding you?",
    measures: ["Press resistance", "Ball retention", "Escaping traps", "Composure under pressure"]
  },
  // PASSING
  {
    id: "shortPassing",
    category: "Passing",
    number: 5,
    title: "Short Passing & Combination Play",
    text: "How would you rate your ability to play accurate short passes, one-touch passes and quick combinations with teammates?",
    measures: ["Short pass accuracy", "One-touch play", "Give-and-go", "Passing weight"]
  },
  {
    id: "longPassing",
    category: "Passing",
    number: 6,
    title: "Long Passing & Switching",
    text: "How would you rate your ability to play accurate long passes, diagonal balls and switch play from one side to another?",
    measures: ["Long ball accuracy", "Diagonal switches", "Aerial trajectory", "Vision"]
  },
  {
    id: "lineBreaking",
    category: "Passing",
    number: 7,
    title: "Progressive & Line-Breaking Passing",
    text: "How would you rate your ability to play forward passes that break defensive lines and move your team towards goal?",
    measures: ["Line-breaking vision", "Forward penetration", "Timing", "Weight of pass"]
  },
  {
    id: "throughBalls",
    category: "Passing",
    number: 8,
    title: "Through Balls & Chance Creation",
    text: "How would you rate your ability to play through balls and create goal-scoring opportunities for teammates?",
    measures: ["Through ball timing", "Key passes", "Assist potential", "Curve & precision"]
  },
  // ATTACKING
  {
    id: "finishing",
    category: "Attacking",
    number: 9,
    title: "Finishing",
    text: "How would you rate your ability to finish chances inside the box, including 1v1 situations?",
    measures: ["Inside-the-box accuracy", "1v1 vs keeper", "First-time finishing", "Composure"]
  },
  {
    id: "longShots",
    category: "Attacking",
    number: 10,
    title: "Long-Range Shooting",
    text: "How would you rate your ability to create dangerous and accurate shots from outside the box?",
    measures: ["Shot power", "Distance accuracy", "Dip & curve", "Threat from range"]
  },
  {
    id: "attackingMovement",
    category: "Attacking",
    number: 11,
    title: "Attacking Movement",
    text: "How would you rate your ability to find space and make well-timed runs behind defenders, between lines, into channels and into the box?",
    measures: ["Channel runs", "Blindside movement", "Box timing", "Space exploitation"]
  },
  {
    id: "crossing",
    category: "Attacking",
    number: 12,
    title: "Crossing & Final Delivery",
    text: "How would you rate your ability to deliver accurate crosses, cutbacks and dangerous balls into the box?",
    measures: ["Whip & curve", "Cutbacks", "Far-post delivery", "Corner & dead-ball delivery"]
  },
  // DEFENDING
  {
    id: "defending1v1",
    category: "Defending",
    number: 13,
    title: "1v1 Defending",
    text: "How would you rate your ability to defend an opponent 1v1, stop dribblers and make well-timed tackles?",
    measures: ["Standing tackles", "Slide tackles", "Jockeying", "Stopping dribblers"]
  },
  {
    id: "defensiveReading",
    category: "Defending",
    number: 14,
    title: "Defensive Positioning & Reading",
    text: "How would you rate your ability to position yourself defensively, track runners, read passing lanes and anticipate opponents' actions?",
    measures: ["Interceptions", "Tracking runners", "Defensive shape", "Lane blocking"]
  },
  {
    id: "pressing",
    category: "Defending",
    number: 15,
    title: "Pressing & Defensive Work",
    text: "How would you rate your ability to press opponents, know when to press, recover after losing possession and contribute defensively?",
    measures: ["Press triggers", "Counter-pressing", "Recovery runs", "Work rate"]
  },
  // PHYSICAL
  {
    id: "speed",
    category: "Physical",
    number: 16,
    title: "Speed & Acceleration",
    text: "How would you rate your acceleration and top speed when competing for space or chasing an opponent?",
    measures: ["Burst acceleration", "Top sprint speed", "Recovery pace", "Sprint stamina"]
  },
  {
    id: "physicality",
    category: "Physical",
    number: 17,
    title: "Stamina & Physicality",
    text: "How would you rate your stamina, strength and ability to maintain performance during physical challenges and throughout a match?",
    measures: ["Strength in duels", "90-minute stamina", "Shielding balance", "Aerial power"]
  },
  // FOOTBALL IQ
  {
    id: "gameReading",
    category: "Football IQ",
    number: 18,
    title: "Game Reading & Awareness",
    text: "How would you rate your ability to read the game, understand space, anticipate situations and stay aware of teammates and opponents?",
    measures: ["Scanning field", "Spatial awareness", "Game tempo", "Anticipation"]
  },
  {
    id: "decisionMaking",
    category: "Football IQ",
    number: 19,
    title: "Decision Making",
    text: "How would you rate your ability to choose the right action—pass, dribble, shoot, hold, press or run—depending on the situation?",
    measures: ["Risk vs reward", "Speed of thought", "Execution timing", "Composure"]
  },
  // FOOT PROFILE
  {
    id: "footProfile",
    category: "Foot Profile",
    number: 20,
    title: "Foot Ability (Passing & Shooting)",
    text: "Rate your passing and shooting technique across both feet to calculate your weak-foot mastery.",
    subQuestions: [
      { id: "rightPassing", label: "Right-Foot Passing", hint: "Short, long and through pass accuracy with right foot" },
      { id: "leftPassing", label: "Left-Foot Passing", hint: "Short, long and through pass accuracy with left foot" },
      { id: "rightShooting", label: "Right-Foot Shooting", hint: "Finishing and shot power with right foot" },
      { id: "leftShooting", label: "Left-Foot Shooting", hint: "Finishing and shot power with left foot" }
    ]
  }
];

module.exports = {
  RATING_SCALE,
  ATTRIBUTE_WEIGHTS,
  POSITION_WEIGHTS,
  OVERALL_WEIGHTS,
  QUESTIONS
};
