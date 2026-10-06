// Card Renderer & Exporter for FIFA-inspired Player Cards

const CardRenderer = {
  renderCardHTML(player, options = {}) {
    if (!player) return '';

    const ovr = player.overall || 75;
    const pos = player.primaryPosition || 'CM';
    const name = (player.name || 'Player').toUpperCase();
    const team = (player.teamName || 'DYNAMO FC').toUpperCase();
    const jersey = player.jerseyNumber || 10;
    const foot = player.preferredFoot ? (player.preferredFoot.charAt(0).toUpperCase() + player.preferredFoot.slice(1)) : 'Right';
    const weakFootStars = player.weakFootStars || 3;
    const playstyle = player.playstyle || { name: 'Creative Playmaker', icon: '✨' };

    const attrs = player.attributes || {
      pace: 75, shooting: 75, passing: 75, dribbling: 75, defending: 75, physical: 75,
      PAC: 75, SHO: 75, PAS: 75, DRI: 75, DEF: 75, PHY: 75
    };

    const pac = attrs.PAC || attrs.pace || 75;
    const sho = attrs.SHO || attrs.shooting || 75;
    const pas = attrs.PAS || attrs.passing || 75;
    const dri = attrs.DRI || attrs.dribbling || 75;
    const def = attrs.DEF || attrs.defending || 75;
    const phy = attrs.PHY || attrs.physical || 75;

    // Card tier styles
    let tierClass = 'card-tier-gold';
    if (ovr >= 85) tierClass = 'card-tier-walkout';
    else if (ovr >= 75) tierClass = 'card-tier-gold';
    else tierClass = 'card-tier-silver';

    const starIcons = '★'.repeat(weakFootStars) + '☆'.repeat(5 - weakFootStars);

    return `
      <div class="fifa-card ${tierClass}" id="fifa-card-${player._id || 'main'}" data-player-id="${player._id || ''}">
        <div class="card-glare"></div>
        <div class="card-texture"></div>
        <div class="card-inner">
          
          <!-- Top Section: OVR, Position, Club -->
          <div class="card-top">
            <div class="card-badge-col">
              <span class="card-ovr">${ovr}</span>
              <span class="card-pos">${pos}</span>
              <div class="card-divider-mini"></div>
              <span class="card-flag" title="Local Squad">⚽</span>
              <span class="card-club-badge" title="${team}">🛡️</span>
            </div>
            
            <div class="card-player-visual">
              <div class="card-jersey-watermark">#${jersey}</div>
              <div class="card-avatar-silhouette">
                <svg viewBox="0 0 100 100" class="player-svg-icon">
                  <circle cx="50" cy="30" r="18" fill="currentColor" opacity="0.9" />
                  <path d="M 22 82 C 22 55, 36 50, 50 50 C 64 50, 78 55, 78 82 Z" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
              <div class="card-aura"></div>
            </div>
          </div>

          <!-- Player Name -->
          <div class="card-name-section">
            <h2 class="card-player-name">${name}</h2>
            <div class="card-archetype-tag">
              <span class="archetype-icon">${playstyle.icon || '✨'}</span>
              <span class="archetype-text">${playstyle.name}</span>
            </div>
          </div>

          <!-- Metallic Divider -->
          <div class="card-separator"></div>

          <!-- 6 Attributes Grid (FIFA standard order) -->
          <div class="card-attributes-grid">
            <div class="card-stat-col">
              <div class="card-stat-item">
                <span class="stat-num">${pac}</span>
                <span class="stat-lbl">PAC</span>
              </div>
              <div class="card-stat-item">
                <span class="stat-num">${sho}</span>
                <span class="stat-lbl">SHO</span>
              </div>
              <div class="card-stat-item">
                <span class="stat-num">${pas}</span>
                <span class="stat-lbl">PAS</span>
              </div>
            </div>

            <div class="card-stat-divider"></div>

            <div class="card-stat-col">
              <div class="card-stat-item">
                <span class="stat-num">${dri}</span>
                <span class="stat-lbl">DRI</span>
              </div>
              <div class="card-stat-item">
                <span class="stat-num">${def}</span>
                <span class="stat-lbl">DEF</span>
              </div>
              <div class="card-stat-item">
                <span class="stat-num">${phy}</span>
                <span class="stat-lbl">PHY</span>
              </div>
            </div>
          </div>

          <!-- Metallic Divider -->
          <div class="card-separator"></div>

          <!-- Bottom Footer -->
          <div class="card-footer">
            <div class="card-foot-meta">
              <span class="meta-label">FOOT:</span>
              <span class="meta-val">${foot}</span>
              <span class="meta-wf" title="Weak Foot Rating">${starIcons}</span>
            </div>
            <div class="card-team-title">${team}</div>
          </div>

        </div>
      </div>
    `;
  },

  attachTiltEffect(cardElement) {
    if (!cardElement) return;

    const handleMove = (e) => {
      const rect = cardElement.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (!clientX || !clientY) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      cardElement.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      const glare = cardElement.querySelector('.card-glare');
      if (glare) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)`;
      }
    };

    const handleLeave = () => {
      cardElement.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      const glare = cardElement.querySelector('.card-glare');
      if (glare) {
        glare.style.background = 'transparent';
      }
    };

    cardElement.addEventListener('mousemove', handleMove);
    cardElement.addEventListener('mouseleave', handleLeave);
    cardElement.addEventListener('touchmove', handleMove, { passive: true });
    cardElement.addEventListener('touchend', handleLeave);
  },

  /**
   * Generates high-resolution PNG on a 600x900 canvas and downloads it
   */
  downloadCardImage(player) {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');

    const ovr = player.overall || 75;
    const pos = player.primaryPosition || 'CAM';
    const name = (player.name || 'PLAYER').toUpperCase();
    const team = (player.teamName || 'DYNAMO FC').toUpperCase();
    const jersey = player.jerseyNumber || 10;
    const foot = player.preferredFoot ? (player.preferredFoot.toUpperCase()) : 'RIGHT';
    const playstyle = player.playstyle ? player.playstyle.name : 'Creative Playmaker';

    const attrs = player.attributes || {};
    const pac = attrs.PAC || attrs.pace || 75;
    const sho = attrs.SHO || attrs.shooting || 75;
    const pas = attrs.PAS || attrs.passing || 75;
    const dri = attrs.DRI || attrs.dribbling || 75;
    const def = attrs.DEF || attrs.defending || 75;
    const phy = attrs.PHY || attrs.physical || 75;

    // Card Shield Path
    function drawShield(x, y, w, h, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h * 0.75);
      ctx.quadraticCurveTo(x + w, y + h, x + w / 2, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h * 0.75);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    // Background Gradient (Walkout Gold / Onyx)
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 900);
    if (ovr >= 85) {
      bgGrad.addColorStop(0, '#ffd700');
      bgGrad.addColorStop(0.15, '#b8860b');
      bgGrad.addColorStop(0.5, '#1e1605');
      bgGrad.addColorStop(0.85, '#2b1d05');
      bgGrad.addColorStop(1, '#ffd700');
    } else {
      bgGrad.addColorStop(0, '#d4af37');
      bgGrad.addColorStop(0.3, '#1a1f2c');
      bgGrad.addColorStop(0.7, '#0f141f');
      bgGrad.addColorStop(1, '#d4af37');
    }

    // Outer border
    drawShield(20, 20, 560, 860, 40);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Inner shield
    drawShield(28, 28, 544, 844, 34);
    const innerGrad = ctx.createLinearGradient(0, 40, 0, 860);
    if (ovr >= 85) {
      innerGrad.addColorStop(0, '#1c1503');
      innerGrad.addColorStop(0.5, '#0b0802');
      innerGrad.addColorStop(1, '#1a1202');
    } else {
      innerGrad.addColorStop(0, '#161b26');
      innerGrad.addColorStop(0.5, '#0a0d14');
      innerGrad.addColorStop(1, '#121620');
    }
    ctx.fillStyle = innerGrad;
    ctx.fill();

    // Metallic trim stroke
    ctx.lineWidth = 4;
    ctx.strokeStyle = ovr >= 85 ? '#ffd700' : '#d4af37';
    ctx.stroke();

    // Jersey number watermark
    ctx.font = '900 220px sans-serif';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.05)';
    ctx.textAlign = 'right';
    ctx.fillText(`${jersey}`, 530, 430);

    // OVR & Position
    ctx.textAlign = 'left';
    ctx.fillStyle = ovr >= 85 ? '#ffd700' : '#f5deb3';
    ctx.font = '900 92px sans-serif';
    ctx.fillText(`${ovr}`, 70, 160);

    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${pos}`, 72, 220);

    // Small divider
    ctx.fillStyle = 'rgba(255,215,0,0.5)';
    ctx.fillRect(72, 240, 70, 4);

    // Club badge & ball
    ctx.font = '32px sans-serif';
    ctx.fillText('⚽  🛡️', 72, 290);

    // Player Silhouette / Icon
    ctx.save();
    ctx.fillStyle = 'rgba(255, 215, 0, 0.85)';
    ctx.beginPath();
    ctx.arc(380, 200, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(380, 360, 95, 110, 0, Math.PI, 0);
    ctx.fill();
    ctx.restore();

    // Player Name
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.fillText(name, 300, 510);

    // Playstyle Pill
    ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
    ctx.roundRect(140, 530, 320, 44, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`✨ ${playstyle}`, 300, 560);

    // Divider Line
    ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.fillRect(80, 600, 440, 3);

    // Stats Grid
    const drawStat = (statVal, statLbl, x, y) => {
      ctx.textAlign = 'right';
      ctx.font = '900 42px sans-serif';
      ctx.fillStyle = ovr >= 85 ? '#ffd700' : '#ffffff';
      ctx.fillText(`${statVal}`, x, y);

      ctx.textAlign = 'left';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(statLbl, x + 16, y - 4);
    };

    // Left Column
    drawStat(pac, 'PAC', 180, 660);
    drawStat(sho, 'SHO', 180, 715);
    drawStat(pas, 'PAS', 180, 770);

    // Center divider
    ctx.fillRect(298, 625, 4, 155);

    // Right Column
    drawStat(dri, 'DRI', 420, 660);
    drawStat(def, 'DEF', 420, 715);
    drawStat(phy, 'PHY', 420, 770);

    // Divider Line
    ctx.fillRect(80, 800, 440, 3);

    // Footer info
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`${team}  •  ${foot} FOOT`, 300, 835);

    // Trigger download
    const link = document.createElement('a');
    link.download = `${name.replace(/\s+/g, '_')}_Card.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
};
