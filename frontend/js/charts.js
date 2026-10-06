// Interactive Canvas Charts for Attributes & Position Fits

const Charts = {
  /**
   * Draws a 6-stat Radar (Hexagon) Chart for PAC, SHO, PAS, DRI, DEF, PHY
   */
  drawRadarChart(canvasId, attributes, secondAttributes = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !attributes) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI displays with solid fallbacks
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = (rect.width > 50 ? rect.width : 340);
    const height = (rect.height > 50 ? rect.height : 340);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38;

    const stats = [
      { key: 'PAC', label: 'PAC' },
      { key: 'SHO', label: 'SHO' },
      { key: 'PAS', label: 'PAS' },
      { key: 'DRI', label: 'DRI' },
      { key: 'DEF', label: 'DEF' },
      { key: 'PHY', label: 'PHY' }
    ];

    const numPoints = stats.length;
    const angleStep = (Math.PI * 2) / numPoints;

    ctx.clearRect(0, 0, width, height);

    // Draw background concentric hexagons (20, 40, 60, 80, 100)
    const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
    levels.forEach((lvl, idx) => {
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * lvl);
        const y = centerY + Math.sin(angle) * (radius * lvl);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = idx === levels.length - 1 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw radial spoke lines
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // Label
      const labelDist = radius + 22;
      const lx = centerX + Math.cos(angle) * labelDist;
      const ly = centerY + Math.sin(angle) * labelDist;
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const val = attributes[stats[i].key] || attributes[stats[i].key.toLowerCase()] || 50;
      ctx.fillText(`${stats[i].label} (${val})`, lx, ly);
    }

    // Function to draw player polygon
    const drawPolygon = (attrMap, fillColor, strokeColor) => {
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const val = attrMap[stats[i].key] || attrMap[stats[i].key.toLowerCase()] || 50;
        const normalized = Math.min(100, Math.max(0, val)) / 100;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * normalized);
        const y = centerY + Math.sin(angle) * (radius * normalized);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw point dots
      for (let i = 0; i < numPoints; i++) {
        const val = attrMap[stats[i].key] || attrMap[stats[i].key.toLowerCase()] || 50;
        const normalized = Math.min(100, Math.max(0, val)) / 100;
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * normalized);
        const y = centerY + Math.sin(angle) * (radius * normalized);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();
        ctx.strokeStyle = '#0a0e17';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    // Draw secondary player if comparing
    if (secondAttributes) {
      drawPolygon(secondAttributes, 'rgba(255, 75, 110, 0.25)', '#ff4b6e');
    }

    // Draw main player
    drawPolygon(attributes, 'rgba(0, 230, 118, 0.35)', '#00e676');
  },

  /**
   * Renders position scores breakdown bars in container
   */
  renderPositionBars(containerId, positionsMap, primaryPos, secondaryPos, currentPos) {
    const container = document.getElementById(containerId);
    if (!container || !positionsMap) return;

    const sorted = Object.entries(positionsMap).sort((a, b) => b[1] - a[1]);

    const html = sorted.map(([pos, score]) => {
      const isPrimary = pos === primaryPos;
      const isSecondary = pos === secondaryPos;
      const isCurrent = pos === currentPos;

      let badge = '';
      let barClass = 'bar-default';

      if (isPrimary) {
        badge = '<span class="pos-badge badge-primary">🥇 Best Fit</span>';
        barClass = 'bar-primary';
      } else if (isSecondary) {
        badge = '<span class="pos-badge badge-secondary">🥈 Secondary</span>';
        barClass = 'bar-secondary';
      }

      let currentBadge = isCurrent ? '<span class="pos-badge badge-current">📍 Current</span>' : '';

      return `
        <div class="pos-bar-row ${isPrimary ? 'highlight-row' : ''}">
          <div class="pos-info">
            <span class="pos-code">${pos}</span>
            <div class="pos-badges">${badge} ${currentBadge}</div>
          </div>
          <div class="pos-track">
            <div class="pos-fill ${barClass}" style="width: ${score}%;"></div>
          </div>
          <span class="pos-score-val">${score}<small>/100</small></span>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }
};
