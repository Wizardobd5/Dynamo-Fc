// 20 Questions definition for Football Assessment
const ASSESSMENT_QUESTIONS = [
  // SECTION 1: BALL MASTERY
  {
    id: "firstTouch",
    category: "Ball Mastery",
    icon: "⚽",
    number: 1,
    title: "First Touch & Receiving",
    text: "How would you rate your ability to receive and control the ball, including difficult, fast or pressured passes?",
    measures: ["First touch", "Receiving", "Cushioning", "Control while receiving"]
  },
  {
    id: "ballControl",
    category: "Ball Mastery",
    icon: "🔄",
    number: 2,
    title: "Ball Control",
    text: "How would you rate your close ball control while moving, turning, protecting the ball and playing in tight spaces?",
    measures: ["Close control", "Turning", "Ball protection", "Tight-space control"]
  },
  {
    id: "dribbling",
    category: "Ball Mastery",
    icon: "⚡",
    number: 3,
    title: "Dribbling & 1v1",
    text: "How would you rate your ability to dribble and beat an opponent in a 1v1 situation?",
    measures: ["Dribbling", "Skill", "1v1 ability", "Change of direction"]
  },
  {
    id: "pressureDribbling",
    category: "Ball Mastery",
    icon: "🛡️",
    number: 4,
    title: "Dribbling Under Pressure",
    text: "How would you rate your ability to keep possession and progress with the ball when opponents are pressing or surrounding you?",
    measures: ["Press resistance", "Ball retention", "Escaping traps", "Composure"]
  },

  // SECTION 2: PASSING
  {
    id: "shortPassing",
    category: "Passing",
    icon: "🤝",
    number: 5,
    title: "Short Passing & Combination Play",
    text: "How would you rate your ability to play accurate short passes, one-touch passes and quick combinations with teammates?",
    measures: ["Short pass accuracy", "One-touch play", "Give-and-go", "Passing weight"]
  },
  {
    id: "longPassing",
    category: "Passing",
    icon: "🎯",
    number: 6,
    title: "Long Passing & Switching",
    text: "How would you rate your ability to play accurate long passes, diagonal balls and switch play from one side to another?",
    measures: ["Long ball accuracy", "Diagonal switches", "Aerial trajectory", "Vision"]
  },
  {
    id: "lineBreaking",
    category: "Passing",
    icon: "🚀",
    number: 7,
    title: "Progressive & Line-Breaking Passing",
    text: "How would you rate your ability to play forward passes that break defensive lines and move your team towards goal?",
    measures: ["Line-breaking vision", "Forward penetration", "Timing", "Weight of pass"]
  },
  {
    id: "throughBalls",
    category: "Passing",
    icon: "🪄",
    number: 8,
    title: "Through Balls & Chance Creation",
    text: "How would you rate your ability to play through balls and create goal-scoring opportunities for teammates?",
    measures: ["Through ball timing", "Key passes", "Assist potential", "Curve & precision"]
  },

  // SECTION 3: ATTACKING
  {
    id: "finishing",
    category: "Attacking",
    icon: "🥅",
    number: 9,
    title: "Finishing",
    text: "How would you rate your ability to finish chances inside the box, including 1v1 situations?",
    measures: ["Inside-the-box accuracy", "1v1 vs keeper", "First-time finishing", "Composure"]
  },
  {
    id: "longShots",
    category: "Attacking",
    icon: "☄️",
    number: 10,
    title: "Long-Range Shooting",
    text: "How would you rate your ability to create dangerous and accurate shots from outside the box?",
    measures: ["Shot power", "Distance accuracy", "Dip & curve", "Threat from range"]
  },
  {
    id: "attackingMovement",
    category: "Attacking",
    icon: "🏃‍♂️",
    number: 11,
    title: "Attacking Movement",
    text: "How would you rate your ability to find space and make well-timed runs behind defenders, between lines, into channels and into the box?",
    measures: ["Channel runs", "Blindside movement", "Box timing", "Space exploitation"]
  },
  {
    id: "crossing",
    category: "Attacking",
    icon: "📐",
    number: 12,
    title: "Crossing & Final Delivery",
    text: "How would you rate your ability to deliver accurate crosses, cutbacks and dangerous balls into the box?",
    measures: ["Whip & curve", "Cutbacks", "Far-post delivery", "Corner delivery"]
  },

  // SECTION 4: DEFENDING
  {
    id: "defending1v1",
    category: "Defending",
    icon: "🛑",
    number: 13,
    title: "1v1 Defending",
    text: "How would you rate your ability to defend an opponent 1v1, stop dribblers and make well-timed tackles?",
    measures: ["Standing tackles", "Slide tackles", "Jockeying", "Stopping dribblers"]
  },
  {
    id: "defensiveReading",
    category: "Defending",
    icon: "👁️",
    number: 14,
    title: "Defensive Positioning & Reading",
    text: "How would you rate your ability to position yourself defensively, track runners, read passing lanes and anticipate opponents' actions?",
    measures: ["Interceptions", "Tracking runners", "Defensive shape", "Lane blocking"]
  },
  {
    id: "pressing",
    category: "Defending",
    icon: "🔥",
    number: 15,
    title: "Pressing & Defensive Work",
    text: "How would you rate your ability to press opponents, know when to press, recover after losing possession and contribute defensively?",
    measures: ["Press triggers", "Counter-pressing", "Recovery runs", "Work rate"]
  },

  // SECTION 5: PHYSICAL
  {
    id: "speed",
    category: "Physical",
    icon: "💨",
    number: 16,
    title: "Speed & Acceleration",
    text: "How would you rate your acceleration and top speed when competing for space or chasing an opponent?",
    measures: ["Burst acceleration", "Top sprint speed", "Recovery pace", "Sprint stamina"]
  },
  {
    id: "physicality",
    category: "Physical",
    icon: "💪",
    number: 17,
    title: "Stamina & Physicality",
    text: "How would you rate your stamina, strength and ability to maintain performance during physical challenges and throughout a match?",
    measures: ["Strength in duels", "90-minute stamina", "Shielding balance", "Aerial power"]
  },

  // SECTION 6: FOOTBALL IQ
  {
    id: "gameReading",
    category: "Football IQ",
    icon: "🧠",
    number: 18,
    title: "Game Reading & Awareness",
    text: "How would you rate your ability to read the game, understand space, anticipate situations and stay aware of teammates and opponents?",
    measures: ["Scanning field", "Spatial awareness", "Game tempo", "Anticipation"]
  },
  {
    id: "decisionMaking",
    category: "Football IQ",
    icon: "💡",
    number: 19,
    title: "Decision Making",
    text: "How would you rate your ability to choose the right action—pass, dribble, shoot, hold, press or run—depending on the situation?",
    measures: ["Risk vs reward", "Speed of thought", "Execution timing", "Composure"]
  },

  // SECTION 7: FOOT PROFILE
  {
    id: "footProfile",
    category: "Foot Profile",
    icon: "🦶",
    number: 20,
    title: "Foot Ability (Weak Foot Profile)",
    text: "Rate your passing and shooting technique across both feet to calculate your weak-foot mastery and technical balance.",
    isMultiPart: true,
    subQuestions: [
      { id: "rightPassing", label: "Right-Foot Passing", hint: "Short, long and through pass accuracy with right foot" },
      { id: "leftPassing", label: "Left-Foot Passing", hint: "Short, long and through pass accuracy with left foot" },
      { id: "rightShooting", label: "Right-Foot Shooting", hint: "Finishing and shot power with right foot" },
      { id: "leftShooting", label: "Left-Foot Shooting", hint: "Finishing and shot power with left foot" }
    ]
  }
];

const RATING_LEVELS = [
  { value: 1, label: "Poor", score: 0, color: "#ef4444", description: "Clear area of weakness" },
  { value: 2, label: "Below Avg", score: 20, color: "#f97316", description: "Inconsistent execution" },
  { value: 3, label: "Average", score: 40, color: "#eab308", description: "Reliable basic competency" },
  { value: 4, label: "Good", score: 60, color: "#84cc16", description: "Consistently above average" },
  { value: 5, label: "Very Good", score: 80, color: "#10b981", description: "Distinct team strength" },
  { value: 6, label: "Excellent", score: 100, color: "#06b6d4", description: "Elite local standout level" }
];

const POSITIONS_LIST = [
  { code: 'CB', name: 'Centre Back', line: 'DEF' },
  { code: 'LB', name: 'Left Back', line: 'DEF' },
  { code: 'RB', name: 'Right Back', line: 'DEF' },
  { code: 'CDM', name: 'Defensive Midfielder', line: 'MID' },
  { code: 'CM', name: 'Central Midfielder', line: 'MID' },
  { code: 'CAM', name: 'Attacking Midfielder', line: 'MID' },
  { code: 'LW', name: 'Left Winger', line: 'ATT' },
  { code: 'RW', name: 'Right Winger', line: 'ATT' },
  { code: 'CF', name: 'Centre Forward', line: 'ATT' },
  { code: 'ST', name: 'Striker', line: 'ATT' }
];
