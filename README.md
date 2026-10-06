# ⚽ Local Football Player Card & Position Assessment System (V1)

A complete football self-assessment platform built with **Vanilla HTML, CSS, JavaScript, and Node.js/Express**.

Players complete a targeted 20-question football assessment using a standardized 6-level scale (Poor → Below Average → Average → Good → Very Good → Excellent). The system converts their answers into 6 core FIFA attributes (PAC, SHO, PAS, DRI, DEF, PHY), runs a 10-outfield position fit matrix (CB, LB, RB, CDM, CM, CAM, LW, RW, CF, ST), selects their primary and secondary position fits, determines their playing archetype, and renders an interactive EA FC / FIFA-style card with 3D tilt and PNG download.

---

## 🌟 Key Features

1. **Guided 20-Question Assessment**:
   - Organized into 7 football categories:
     - **Ball Mastery**: First Touch (Q1), Ball Control (Q2), 1v1 Dribbling (Q3), Pressure Dribbling (Q4)
     - **Passing**: Short Passing (Q5), Long Passing (Q6), Line-Breaking Passes (Q7), Through Balls (Q8)
     - **Attacking**: Finishing (Q9), Long-Range Shooting (Q10), Attacking Movement (Q11), Crossing (Q12)
     - **Defending**: 1v1 Defending (Q13), Defensive Positioning (Q14), Pressing & Work Rate (Q15)
     - **Physical**: Speed & Acceleration (Q16), Stamina & Physicality (Q17)
     - **Football IQ**: Game Reading & Tactical Awareness (Q18), Decision Making (Q19)
     - **Foot Profile**: Right/Left Passing and Shooting (Q20) to compute weak-foot star ratings (1★–5★)
   - 6 Rating Levels: `1 (Poor - 0)`, `2 (Below Avg - 20)`, `3 (Average - 40)`, `4 (Good - 60)`, `5 (Very Good - 80)`, `6 (Excellent - 100)`.

2. **Attribute Engine (`backend/services/attributeEngine.js`)**:
   - Converts raw ratings into standard FIFA face stats (0–99 scale):
     - **PAC**: Speed, Attacking Movement, Dribbling, Pressure Dribbling, Physicality
     - **SHO**: Finishing, Long-Range Shots, Shooting-Foot Mastery, Attacking Movement, Decision Making, First Touch
     - **PAS**: Short Passing, Through Balls, Line-Breaking, Passing-Foot Mastery, Long Passing, First Touch, Football IQ
     - **DRI**: Ball Control, First Touch, Dribbling, Pressure Dribbling, Speed, Decision Making
     - **DEF**: 1v1 Defending, Defensive Positioning, Pressing, Physicality, Game Reading, Decision Making
     - **PHY**: Physicality, Pressure Dribbling, Attacking Movement, Pressing, Speed, Defensive Positioning

3. **Position Engine (`backend/services/positionEngine.js`)**:
   - Evaluates 10 outfield roles (CB, LB, RB, CDM, CM, CAM, LW, RW, CF, ST) with distinct tactical weights.
   - Computes 0–100 synergy scores for each position.
   - Identifies **Primary Position** (highest score).
   - Enforces **Confidence Rules** for **Secondary Position**: Only displayed if score ≥ 75 AND score difference from primary ≤ 15.
   - Compares **Current Position** vs **Calculated Best Fit**.
   - Generates AI reasoning ("Why did the system recommend this position?") and separates Key Strengths from Development Areas.

4. **Position-Dependent Overall Engine (`backend/services/overallEngine.js`)**:
   - Positions weight attributes differently (e.g. CAM prioritizes PAS/DRI/SHO, CB prioritizes DEF/PHY, ST prioritizes SHO/PAC).
   - Determines card tier: Elite Walkout (85+), Gold Standard (75-84), Silver Contender (65-74).

5. **Playstyle & Archetype Engine (`backend/services/playstyleEngine.js`)**:
   - Classifies player archetypes (e.g. *Creative Playmaker*, *Deep-Lying Playmaker*, *Box-to-Box Engine*, *Ball-Playing Defender*, *Poacher*, *Complete Forward*).

6. **Authentic EA FC / FIFA Card Presentation**:
   - Shield geometry with glowing metallic border and holographic sheen.
   - Interactive 3D tilt and specular lighting tracking cursor/touch.
   - Jersey number watermark, club badge, position and OVR.
   - Instant high-resolution PNG export (`Download Card (PNG)` via HTML5 Canvas).

7. **Squad Dashboard & 1v1 Head-to-Head Comparison**:
   - Full squad roster tracking, team average OVR, pace, and passing.
   - Filter by tactical line (Attackers, Midfielders, Defenders) and search by player name.
   - 1v1 comparison tool with dual cards, side-by-side face stats, (+/-) delta indicators, and dual radar chart overlay.

---

## 🔬 Benchmark Verification (Obaid Khan Test Case)

From the blueprint specifications:
```
Ratings:
First Touch: 6, Ball Control: 6, Dribbling: 5, Pressure Dribbling: 5
Short Passing: 6, Long Passing: 4, Line Breaking: 6, Through Balls: 6
Finishing: 4, Long Shots: 5, Attacking Movement: 5, Crossing: 3
1v1 Defending: 2, Defensive Reading: 3, Pressing: 4
Speed: 4, Physicality: 4, Game Reading: 6, Decision Making: 6
Right Pass: 6, Left Pass: 4, Right Shoot: 6, Left Shoot: 3
Preferred Foot: Right, Current Position: CM

Calculated Output:
- Attributes: PAC 82 | SHO 76 | PAS 90 | DRI 89 | DEF 51 | PHY 67
- Primary Position: CAM (92/100) — Creative Playmaker
- Secondary Position: CM (87/100)
- Overall Rating: 87 OVR (Elite Walkout 85+)
- Weak Foot: 3 Stars (★★★☆☆)
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+) and npm installed.

### Start the Application
```bash
# Install dependencies (if not already installed)
npm install

# Start the server
npm start
```

Open your browser to:
```
http://localhost:3000
```

### Run Engine Tests
```bash
npm run test:engine
```

---

## 📁 Project Structure

```
football/
├── backend/
│   ├── config/
│   │   ├── db.js             # Dual-mode JSON/MongoDB persistent storage
│   │   └── weights.js        # Matrix weights for 10 positions & attributes
│   ├── controllers/
│   │   ├── cardController.js   # Card presentation controller
│   │   └── playerController.js # CRUD, squad stats, comparisons, assessments
│   ├── models/
│   │   └── Player.js         # Player data model & automatic team seeding
│   ├── routes/
│   │   ├── cardRoutes.js
│   │   └── playerRoutes.js
│   ├── services/
│   │   ├── attributeEngine.js # PAC, SHO, PAS, DRI, DEF, PHY & weak foot
│   │   ├── positionEngine.js  # 10-position matrix & confidence rules
│   │   ├── overallEngine.js   # Position-dependent OVR & tier assignment
│   │   └── playstyleEngine.js # Archetype & trait classification
│   ├── tests/
│   │   └── engineTest.js      # Benchmark verification test
│   └── server.js             # Express app serving static frontend & REST API
├── frontend/
│   ├── css/
│   │   └── style.css          # Vanilla CSS design system (dark stadium theme)
│   ├── js/
│   │   ├── api.js             # REST API client
│   │   ├── app.js             # SPA controller, wizard flow & navigation
│   │   ├── cardRenderer.js    # FIFA card HTML, 3D tilt & PNG export
│   │   ├── charts.js          # Canvas radar charts & position bars
│   │   └── questions.js       # 20 questions metadata & 6-level rating scales
│   └── index.html             # Single-page application shell
└── package.json
```
