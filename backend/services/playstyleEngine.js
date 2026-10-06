/**
 * Determines player archetype / playstyle based on position, attributes, and raw ratings.
 */
function determinePlaystyle(primaryPosition, attributes, normalizedRatings) {
  const pac = attributes.pace || attributes.PAC || 50;
  const sho = attributes.shooting || attributes.SHO || 50;
  const pas = attributes.passing || attributes.PAS || 50;
  const dri = attributes.dribbling || attributes.DRI || 50;
  const def = attributes.defending || attributes.DEF || 50;
  const phy = attributes.physical || attributes.PHY || 50;

  const r = normalizedRatings || {};

  switch (primaryPosition) {
    case 'CAM':
      if (pas >= 85 && (r.throughBalls >= 80 || r.lineBreaking >= 80)) {
        return {
          name: 'Creative Playmaker',
          icon: '✨',
          tagline: 'Orchestrates the attack with visionary passing and spatial mastery',
          traits: ['Incisive Through Balls', 'Vision & Timing', 'Pocket Operator']
        };
      }
      if (dri >= 82 && (r.dribbling >= 80 || r.ballControl >= 80)) {
        return {
          name: 'Dribbling Creator',
          icon: '⚡',
          tagline: 'Glides past challenges in tight spaces to unlock backlines',
          traits: ['Tight Control', '1v1 Specialist', 'Press Escape']
        };
      }
      if (sho >= 75 && (r.longShots >= 75 || r.attackingMovement >= 75)) {
        return {
          name: 'Shadow Striker',
          icon: '🎯',
          tagline: 'Lurks between the lines with deadly box arrivals and long range threat',
          traits: ['Late Box Runs', 'Distance Shooting', 'Goal Threat']
        };
      }
      return {
        name: 'Attacking Midfielder',
        icon: '🎩',
        tagline: 'Balanced central connector linking midfield and frontline',
        traits: ['Box-to-Box Connection', 'Composure', 'Distribution']
      };

    case 'CM':
      if (phy >= 75 && def >= 60 && pas >= 70) {
        return {
          name: 'Box-to-Box Engine',
          icon: '🔋',
          tagline: 'Relentless work engine dominating both penalty boxes',
          traits: ['Endless Stamina', 'Transition Threat', 'Dual Phase Impact']
        };
      }
      if (pas >= 80 && (r.longPassing >= 75 || r.gameReading >= 75)) {
        return {
          name: 'Deep-Lying Playmaker',
          icon: '🎯',
          tagline: 'Dictates match tempo with exquisite long switches and progressive passing',
          traits: ['Metronomic Passing', 'Field Vision', 'Tempo Dictator']
        };
      }
      if (def >= 75 && phy >= 75) {
        return {
          name: 'Ball-Winning Midfielder',
          icon: '🛡️',
          tagline: 'Disrupts opposition rhythm with aggressive tackles and pressing',
          traits: ['Ball Recovery', 'Interceptions', 'Physical Dominance']
        };
      }
      return {
        name: 'Creative Midfielder',
        icon: '🪄',
        tagline: 'Fluid link player connecting defense to attack with intelligence',
        traits: ['Possession Retention', 'Combinations', 'Quick Circulation']
      };

    case 'CDM':
      if (def >= 75 && phy >= 75) {
        return {
          name: 'Defensive Anchor',
          icon: '⚓',
          tagline: 'Impenetrable shield guarding the defensive back four',
          traits: ['Positional Discipline', 'Passing Lane Denial', 'Tackle Success']
        };
      }
      if (r.pressing >= 75 && phy >= 70) {
        return {
          name: 'Midfield Destroyer',
          icon: '💥',
          tagline: 'Aggressive ball-hunter hunting turnovers in middle third',
          traits: ['Counter-press Trigger', 'Hard Duels', 'Enforcer']
        };
      }
      return {
        name: 'Deep Playmaker',
        icon: '🧠',
        tagline: 'First receiver who launches attacks under heavy pressure',
        traits: ['Press Resistant', 'Line-Breaking Feed', 'Calm Under Duress']
      };

    case 'CB':
      if (pas >= 65 || (r.longPassing >= 70 || r.firstTouch >= 70)) {
        return {
          name: 'Ball-Playing Defender',
          icon: '🎯',
          tagline: 'Modern centre-back initiating attacks with surgical distribution',
          traits: ['Progressive Passing', 'Calm on Ball', 'Aerial Dominance']
        };
      }
      if (phy >= 75 && def >= 70) {
        return {
          name: 'Stopper',
          icon: '🧱',
          tagline: 'Dominant physical presence crushing direct attacks and aerial crosses',
          traits: ['Physical Dominance', 'Dominant Header', 'Last-ditch Tackling']
        };
      }
      return {
        name: 'Defensive Anchor',
        icon: '🛡️',
        tagline: 'Disciplined reader of danger holding the offside line',
        traits: ['Defensive Awareness', 'Covering Depth', 'Commanding Presence']
      };

    case 'LB':
    case 'RB':
      if (pac >= 75 && (r.crossing >= 70 || r.attackingMovement >= 70)) {
        return {
          name: 'Attacking Fullback',
          icon: '🚀',
          tagline: 'Bombing down the flank providing width and pinpoint crosses',
          traits: ['Overlapping Runs', 'Whip Delivery', 'High Recovery Pace']
        };
      }
      if (pas >= 70 && (r.shortPassing >= 75 || r.ballControl >= 75)) {
        return {
          name: 'Inverted Wing-Back',
          icon: '🔄',
          tagline: 'Tucks into central midfield to overload possession and dictate play',
          traits: ['Interior Overload', 'Short Combination', 'Tactical Versatility']
        };
      }
      return {
        name: 'Defensive Fullback',
        icon: '🔒',
        tagline: 'Lockdown perimeter defender who neutralizes opposing wingers',
        traits: ['1v1 Lockdown', 'Tackle Efficiency', 'Defensive Shape']
      };

    case 'LW':
    case 'RW':
      if (sho >= 75 && (r.finishing >= 70 || r.longShots >= 70)) {
        return {
          name: 'Inside Forward',
          icon: '⚡',
          tagline: 'Cuts inside onto stronger foot to fire shots and attack the box',
          traits: ['Diagonal Burst', 'Shooting Threat', 'Goalscoring Instinct']
        };
      }
      if (r.crossing >= 75 && pac >= 75) {
        return {
          name: 'Traditional Winger',
          icon: '🏃',
          tagline: 'Stretches the pitch, beats fullbacks on the outside and whips deadly crosses',
          traits: ['Touchline Hugger', 'Whip Crossing', 'Sprint Speed']
        };
      }
      if (pas >= 75 && dri >= 75) {
        return {
          name: 'Creative Winger',
          icon: '🎨',
          tagline: 'Wing playmaker creating high-value chances with cutbacks and reverse passes',
          traits: ['Inverted Playmaking', 'Key Passes', 'Agility in Tight Areas']
        };
      }
      return {
        name: 'Speed Merchant',
        icon: '💨',
        tagline: 'Direct counter-attacking threat terrorizing defensive high lines',
        traits: ['Rapid Counter', 'Space Chaser', 'Pace in Behind']
      };

    case 'CF':
      if (pas >= 75 && dri >= 75) {
        return {
          name: 'False Nine',
          icon: '🎭',
          tagline: 'Drops deep into midfield to drag defenders out and release runners',
          traits: ['Link-up Play', 'Space Creation', 'Deceptive Movement']
        };
      }
      return {
        name: 'Mobile Striker',
        icon: '🏹',
        tagline: 'Dynamic forward roaming across the frontline with high technical skill',
        traits: ['Roam Across Front', 'Combination Finishing', 'Instinctive Runs']
      };

    case 'ST':
      if (r.finishing >= 80 && (r.attackingMovement >= 80 || r.longShots >= 75)) {
        return {
          name: 'Poacher',
          icon: '🎯',
          tagline: 'Lethal penalty box assassin with immaculate finishing instincts',
          traits: ['Clinical Finishing', 'Box Anticipation', 'One-touch Goals']
        };
      }
      if (pac >= 75 && sho >= 75 && phy >= 75) {
        return {
          name: 'Complete Forward',
          icon: '👑',
          tagline: 'Complete modern striker combining pace, finishing, and aerial power',
          traits: ['All-round Threat', 'Duel Winner', 'Decisive In All Phases']
        };
      }
      if (r.pressing >= 75 && phy >= 70) {
        return {
          name: 'Pressing Forward',
          icon: '⚡',
          tagline: 'First line of defence harassing defenders and forcing high turnovers',
          traits: ['Frontline Pressure', 'Relentless Engine', 'Harassing Centerbacks']
        };
      }
      if (phy >= 75 && r.firstTouch >= 70) {
        return {
          name: 'Target Forward',
          icon: '🗿',
          tagline: 'Aerial lighthouse holding up play and bringing teammates into the box',
          traits: ['Back to Goal Play', 'Aerial Dominance', 'Hold-up Strength']
        };
      }
      return {
        name: 'Advanced Striker',
        icon: '⚽',
        tagline: 'Direct spearhead penetrating the last line with sharp attacking runs',
        traits: ['Channel Running', 'Box Presence', 'Sharp Reactions']
      };

    default:
      return {
        name: 'All-Round Footballer',
        icon: '⚽',
        tagline: 'Versatile team player comfortable across multiple phases',
        traits: ['Work Rate', 'Adaptability', 'Team Chemistry']
      };
  }
}

module.exports = {
  determinePlaystyle
};
