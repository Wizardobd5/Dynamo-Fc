// Main Application Controller for Local Football Player Card System

const App = {
  currentView: 'home-view',
  allPlayers: [],
  activePlayer: null,
  
  // Assessment wizard state
  wizard: {
    currentStep: 0, // 0 = Profile form, 1..20 = Questions
    playerData: {
      name: '',
      preferredFoot: 'right',
      currentPosition: 'CM',
      jerseyNumber: 10,
      teamName: 'Dynamo FC'
    },
    ratings: {
      firstTouch: null,
      ballControl: null,
      dribbling: null,
      pressureDribbling: null,
      shortPassing: null,
      longPassing: null,
      lineBreaking: null,
      throughBalls: null,
      finishing: null,
      longShots: null,
      attackingMovement: null,
      crossing: null,
      defending1v1: null,
      defensiveReading: null,
      pressing: null,
      speed: null,
      physicality: null,
      gameReading: null,
      decisionMaking: null,
      rightPassing: null,
      leftPassing: null,
      rightShooting: null,
      leftShooting: null
    }
  },

  init() {
    this.bindNavigation();
    this.bindHomeActions();
    this.bindAssessmentForm();
    this.bindSquadDashboard();
    this.loadInitialData();
  },

  // View Navigation
  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active-view');
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active-view');
      this.currentView = viewId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.targetView === viewId) {
        btn.classList.add('active');
      }
    });

    // Refresh view specific data
    if (viewId === 'squad-view') {
      this.refreshSquadView();
    }
  },

  bindNavigation() {
    document.querySelectorAll('[data-target-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.dataset.targetView;
        if (target) this.switchView(target);
      });
    });
  },

  async loadInitialData() {
    try {
      const res = await API.getPlayers();
      if (res.success && res.data) {
        this.allPlayers = res.data;
      }
    } catch (err) {
      console.warn('Could not load initial players:', err);
    }
  },

  // ----------------------------------------------------
  // HOME VIEW
  // ----------------------------------------------------
  bindHomeActions() {
    const startBtn = document.getElementById('heroStartAssessmentBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.resetAssessment();
        this.switchView('assessment-view');
      });
    }

    const exploreSquadBtn = document.getElementById('heroExploreSquadBtn');
    if (exploreSquadBtn) {
      exploreSquadBtn.addEventListener('click', () => {
        this.switchView('squad-view');
      });
    }

    const logoContainer = document.getElementById('dynamoLogoContainer');
    if (logoContainer) {
      logoContainer.addEventListener('click', () => {
        this.resetAssessment();
        this.switchView('assessment-view');
      });
    }
  },

  // ----------------------------------------------------
  // ASSESSMENT WIZARD
  // ----------------------------------------------------
  resetAssessment() {
    this.wizard.currentStep = 0;
    this.wizard.playerData = {
      name: '',
      preferredFoot: 'right',
      currentPosition: 'CM',
      jerseyNumber: 10,
      teamName: 'Dynamo FC'
    };
    Object.keys(this.wizard.ratings).forEach(k => {
      this.wizard.ratings[k] = null;
    });

    const nameInput = document.getElementById('inputPlayerName');
    if (nameInput) nameInput.value = '';

    const jerseyInput = document.getElementById('inputJerseyNumber');
    if (jerseyInput) jerseyInput.value = '10';

    const teamInput = document.getElementById('inputTeamName');
    if (teamInput) teamInput.value = 'Dynamo FC';

    this.selectFootOption('right');
    this.selectPositionOption('CM');
    this.renderWizardStep();
  },

  bindAssessmentForm() {
    // Foot selection buttons
    document.querySelectorAll('.foot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectFootOption(btn.dataset.foot);
      });
    });

    // Position selection buttons
    document.querySelectorAll('.pos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectPositionOption(btn.dataset.pos);
      });
    });

    // Wizard navigation buttons
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.wizard.currentStep > 0) {
          this.wizard.currentStep--;
          this.renderWizardStep();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.handleNextStep();
      });
    }
  },

  selectFootOption(foot) {
    this.wizard.playerData.preferredFoot = foot;
    document.querySelectorAll('.foot-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.foot === foot);
    });
  },

  selectPositionOption(pos) {
    this.wizard.playerData.currentPosition = pos;
    document.querySelectorAll('.pos-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.pos === pos);
    });
  },

  handleNextStep() {
    if (this.wizard.currentStep === 0) {
      // Validate Step 0: Profile
      const name = document.getElementById('inputPlayerName').value.trim();
      if (!name) {
        alert('Please enter your player name to continue.');
        document.getElementById('inputPlayerName').focus();
        return;
      }
      this.wizard.playerData.name = name;
      this.wizard.playerData.jerseyNumber = Number(document.getElementById('inputJerseyNumber').value) || 10;
      this.wizard.playerData.teamName = document.getElementById('inputTeamName').value.trim() || 'Dynamo FC';

      this.wizard.currentStep = 1;
      this.renderWizardStep();
    } else if (this.wizard.currentStep >= 1 && this.wizard.currentStep < 20) {
      // Validate single question
      const q = ASSESSMENT_QUESTIONS[this.wizard.currentStep - 1];
      if (this.wizard.ratings[q.id] === null) {
        alert('Please select a rating level for this question before proceeding.');
        return;
      }
      this.wizard.currentStep++;
      this.renderWizardStep();
    } else if (this.wizard.currentStep === 20) {
      // Validate Q20 (all 4 foot ratings)
      const q20 = ASSESSMENT_QUESTIONS[19];
      for (const sub of q20.subQuestions) {
        if (this.wizard.ratings[sub.id] === null) {
          alert(`Please rate your ${sub.label} before submitting.`);
          return;
        }
      }
      // Submit and Calculate
      this.submitAssessment();
    }
  },

  renderWizardStep() {
    const step = this.wizard.currentStep;
    const profileCard = document.getElementById('wizardProfileCard');
    const questionCard = document.getElementById('wizardQuestionCard');
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');
    const progressFill = document.getElementById('wizardProgressFill');
    const stepBadge = document.getElementById('wizardStepBadge');
    const progressNum = document.getElementById('wizardProgressNum');

    // Update Progress Bar
    const progressPct = step === 0 ? 5 : Math.round((step / 20) * 100);
    if (progressFill) progressFill.style.width = `${progressPct}%`;
    if (progressNum) progressNum.textContent = step === 0 ? 'Step 1 of 2: Basic Info' : `Question ${step} of 20 (${progressPct}%)`;

    // Category chips
    this.renderCategoryChips(step);

    if (step === 0) {
      if (profileCard) profileCard.style.display = 'block';
      if (questionCard) questionCard.style.display = 'none';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) {
        nextBtn.innerHTML = 'Continue to Assessment →';
        nextBtn.classList.remove('btn-nav-primary');
        nextBtn.classList.add('btn-nav-primary');
      }
      if (stepBadge) stepBadge.innerHTML = '👤 Step 1: Basic Football Profile';
    } else {
      if (profileCard) profileCard.style.display = 'none';
      if (questionCard) questionCard.style.display = 'block';
      if (prevBtn) prevBtn.disabled = false;

      const q = ASSESSMENT_QUESTIONS[step - 1];
      if (stepBadge) stepBadge.innerHTML = `${q.icon} Question ${q.number} of 20`;

      if (step === 20) {
        nextBtn.innerHTML = '⚡ Calculate Card & Analysis';
        nextBtn.classList.add('btn-nav-primary');
      } else {
        nextBtn.innerHTML = 'Next Question →';
      }

      this.renderQuestionContent(q);
    }
  },

  renderCategoryChips(currentStep) {
    const container = document.getElementById('sectionChipsScroller');
    if (!container) return;

    const categories = [
      { name: 'Profile', minStep: 0, maxStep: 0 },
      { name: 'Ball Mastery', minStep: 1, maxStep: 4 },
      { name: 'Passing', minStep: 5, maxStep: 8 },
      { name: 'Attacking', minStep: 9, maxStep: 12 },
      { name: 'Defending', minStep: 13, maxStep: 15 },
      { name: 'Physical', minStep: 16, maxStep: 17 },
      { name: 'Football IQ', minStep: 18, maxStep: 19 },
      { name: 'Foot Profile', minStep: 20, maxStep: 20 }
    ];

    container.innerHTML = categories.map(cat => {
      const isActive = currentStep >= cat.minStep && currentStep <= cat.maxStep;
      const isDone = currentStep > cat.maxStep;
      let cls = 'section-chip';
      if (isActive) cls += ' active';
      if (isDone) cls += ' completed';

      return `<div class="${cls}" data-goto-step="${cat.minStep}">${isDone ? '✓ ' : ''}${cat.name}</div>`;
    }).join('');

    // Allow clicking on chips already completed
    container.querySelectorAll('.section-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetStep = Number(chip.dataset.gotoStep);
        if (targetStep <= currentStep) {
          this.wizard.currentStep = targetStep;
          this.renderWizardStep();
        }
      });
    });
  },

  renderQuestionContent(q) {
    const card = document.getElementById('wizardQuestionCard');
    if (!card) return;

    if (!q.isMultiPart) {
      // Standard Question (Q1 to Q19)
      const currentRating = this.wizard.ratings[q.id];

      const ratingButtonsHtml = RATING_LEVELS.map(lvl => {
        const isSelected = currentRating === lvl.value;
        return `
          <button type="button" class="rating-choice-btn ${isSelected ? 'selected' : ''}" data-level="${lvl.value}" data-question-id="${q.id}">
            <span class="rating-score-num">${lvl.value}</span>
            <span class="rating-score-label">${lvl.label}</span>
            <span class="rating-pct">${lvl.score}%</span>
          </button>
        `;
      }).join('');

      card.innerHTML = `
        <div class="question-header-row">
          <div class="question-cat-tag">${q.icon} ${q.category}</div>
          <span class="question-counter">Question ${q.number}/20</span>
        </div>
        <h3 class="question-title">${q.title}</h3>
        <p class="question-text">${q.text}</p>
        
        <div class="measured-traits-box">
          <div class="measured-traits-label">Measures:</div>
          <div class="trait-pills-list">
            ${q.measures.map(m => `<span class="trait-pill">${m}</span>`).join('')}
          </div>
        </div>

        <div class="rating-selector-grid">
          ${ratingButtonsHtml}
        </div>
      `;

      // Bind selection clicks
      card.querySelectorAll('.rating-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const levelVal = Number(btn.dataset.level);
          this.wizard.ratings[q.id] = levelVal;

          card.querySelectorAll('.rating-choice-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          // Subtle auto advance after 250ms for smooth user flow
          setTimeout(() => {
            if (this.wizard.currentStep < 20) {
              this.wizard.currentStep++;
              this.renderWizardStep();
            }
          }, 250);
        });
      });

    } else {
      // Q20: Foot Ability (4 sub-questions)
      const subCardsHtml = q.subQuestions.map(sub => {
        const curVal = this.wizard.ratings[sub.id];

        const buttons = RATING_LEVELS.map(lvl => {
          const isSel = curVal === lvl.value;
          return `
            <button type="button" class="rating-choice-btn sub-rating-btn ${isSel ? 'selected' : ''}" data-sub-id="${sub.id}" data-level="${lvl.value}">
              <span class="rating-score-num">${lvl.value}</span>
              <span class="rating-score-label">${lvl.label}</span>
            </button>
          `;
        }).join('');

        return `
          <div class="subquestion-card">
            <h4>${sub.label}</h4>
            <p>${sub.hint}</p>
            <div class="rating-selector-grid">
              ${buttons}
            </div>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="question-header-row">
          <div class="question-cat-tag">${q.icon} ${q.category}</div>
          <span class="question-counter">Question 20/20</span>
        </div>
        <h3 class="question-title">${q.title}</h3>
        <p class="question-text">${q.text}</p>

        <div class="subquestions-wrapper">
          ${subCardsHtml}
        </div>
      `;

      // Bind sub question clicks
      card.querySelectorAll('.sub-rating-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const subId = btn.dataset.subId;
          const level = Number(btn.dataset.level);
          this.wizard.ratings[subId] = level;

          btn.closest('.subquestion-card').querySelectorAll('.sub-rating-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
      });
    }
  },

  async submitAssessment() {
    const revealOverlay = document.getElementById('revealOverlay');
    if (revealOverlay) revealOverlay.classList.add('active');

    // Simulate authentic pack suspense animation
    const stageText = document.getElementById('revealStageText');
    const subText = document.getElementById('revealSubtext');

    if (stageText) stageText.textContent = 'Analyzing Football DNA...';
    if (subText) subText.textContent = 'Calculating PAC, SHO, PAS, DRI, DEF, PHY attributes';

    try {
      // Prepare payload
      const payload = {
        name: this.wizard.playerData.name,
        preferredFoot: this.wizard.playerData.preferredFoot,
        currentPosition: this.wizard.playerData.currentPosition,
        jerseyNumber: this.wizard.playerData.jerseyNumber,
        teamName: this.wizard.playerData.teamName,
        ratings: this.wizard.ratings
      };

      const res = await API.createPlayer(payload);

      setTimeout(() => {
        if (stageText) stageText.textContent = 'Evaluating 10 Outfield Positions...';
        if (subText) subText.textContent = 'Running Position Fit Matrix and Archetype Engine';
      }, 700);

      setTimeout(() => {
        if (revealOverlay) revealOverlay.classList.remove('active');
        if (res.success && res.data) {
          this.activePlayer = res.data;
          this.showPlayerAnalysis(res.data);
          // Refresh all players cache
          this.loadInitialData();
        }
      }, 1500);

    } catch (err) {
      if (revealOverlay) revealOverlay.classList.remove('active');
      alert(`Error evaluating player: ${err.message}`);
    }
  },

  // ----------------------------------------------------
  // RESULT & PLAYER ANALYSIS VIEW
  // ----------------------------------------------------
  showPlayerAnalysis(player) {
    this.activePlayer = player;
    this.switchView('result-view');

    // Render FIFA Card
    const cardContainer = document.getElementById('resultCardContainer');
    if (cardContainer) {
      cardContainer.innerHTML = CardRenderer.renderCardHTML(player);
      const cardEl = cardContainer.querySelector('.fifa-card');
      CardRenderer.attachTiltEffect(cardEl);
    }

    // Bind Card Action Buttons
    const downloadBtn = document.getElementById('btnDownloadCardImage');
    if (downloadBtn) {
      downloadBtn.onclick = () => CardRenderer.downloadCardImage(player);
    }

    const retakeBtn = document.getElementById('btnRetakeAssessment');
    if (retakeBtn) {
      retakeBtn.onclick = () => {
        this.resetAssessment();
        this.switchView('assessment-view');
      };
    }

    // Render Position Verdict Hero
    const verdictPos = document.getElementById('verdictBestPos');
    const verdictName = document.getElementById('verdictPosFullName');
    const verdictScore = document.getElementById('verdictScoreText');
    const verdictSec = document.getElementById('verdictSecondaryText');
    const verdictCur = document.getElementById('verdictCurrentText');
    const verdictNotice = document.getElementById('verdictAlignmentNotice');

    if (verdictPos) verdictPos.textContent = player.primaryPosition;
    if (verdictName) verdictName.textContent = player.primaryFullName || 'Best Position';
    if (verdictScore) verdictScore.textContent = `${player.primaryScore}/100`;

    if (verdictSec) {
      verdictSec.innerHTML = player.secondaryPosition 
        ? `Secondary: <strong>${player.secondaryPosition} (${player.secondaryScore}/100)</strong>`
        : `Secondary: <em>None (Strong single-position specialist)</em>`;
    }

    if (verdictCur) {
      verdictCur.innerHTML = `Current Position: <strong>${player.currentPosition} (${player.currentPositionScore || '--'}/100)</strong>`;
    }

    if (verdictNotice) {
      verdictNotice.textContent = player.alignmentNote || 'Algorithmic position recommendation calculated.';
    }

    // Render Explanations
    const explanationsContainer = document.getElementById('resultExplanationsList');
    if (explanationsContainer) {
      const items = player.explanations || [];
      explanationsContainer.innerHTML = items.map(exp => `
        <div class="explanation-item">${exp}</div>
      `).join('');
    }

    // Render Strengths & Dev Areas
    const strengthsContainer = document.getElementById('resultStrengthsList');
    if (strengthsContainer && player.strengths) {
      strengthsContainer.innerHTML = player.strengths.map(s => `
        <div class="trait-item-row">
          <span>${s.name}</span>
          <span class="trait-val" style="color: var(--pitch-green);">${s.value}</span>
        </div>
      `).join('');
    }

    const devContainer = document.getElementById('resultDevAreasList');
    if (devContainer && player.developmentAreas) {
      devContainer.innerHTML = player.developmentAreas.map(d => `
        <div class="trait-item-row">
          <span>${d.name}</span>
          <span class="trait-val" style="color: #fb923c;">${d.value}</span>
        </div>
      `).join('');
    }

    // Render Radar Chart
    setTimeout(() => {
      Charts.drawRadarChart('radarChartCanvas', player.attributes);
    }, 50);

    // Render Attribute Bars
    const attrStack = document.getElementById('resultAttributesStack');
    if (attrStack) {
      const stats = [
        { code: 'PAC', val: player.attributes.pace },
        { code: 'SHO', val: player.attributes.shooting },
        { code: 'PAS', val: player.attributes.passing },
        { code: 'DRI', val: player.attributes.dribbling },
        { code: 'DEF', val: player.attributes.defending },
        { code: 'PHY', val: player.attributes.physical }
      ];

      attrStack.innerHTML = stats.map(s => `
        <div class="attr-bar-row">
          <span class="attr-code">${s.code}</span>
          <div class="attr-track">
            <div class="attr-fill" style="width: ${s.val}%;"></div>
          </div>
          <span class="attr-val">${s.val}</span>
        </div>
      `).join('');
    }

    // Render 10 Position Bars
    Charts.renderPositionBars(
      'resultPositionBarsContainer',
      player.positions,
      player.primaryPosition,
      player.secondaryPosition,
      player.currentPosition
    );
  },

  // ----------------------------------------------------
  // SQUAD / TEAM DASHBOARD
  // ----------------------------------------------------
  bindSquadDashboard() {
    const searchInput = document.getElementById('squadSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterAndRenderSquad());
    }

    const sortSelect = document.getElementById('squadSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => this.filterAndRenderSquad());
    }

    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterAndRenderSquad();
      });
    });
  },

  async refreshSquadView() {
    try {
      const teamRes = await API.getTeamOverview();
      if (teamRes.success && teamRes.data) {
        const team = teamRes.data;
        this.allPlayers = team.players || [];

        // Update squad stat tiles
        const totalEl = document.getElementById('squadTotalPlayers');
        const avgOvrEl = document.getElementById('squadAvgOverall');
        const avgPacEl = document.getElementById('squadAvgPace');
        const avgPasEl = document.getElementById('squadAvgPassing');

        if (totalEl) totalEl.textContent = team.totalPlayers;
        if (avgOvrEl) avgOvrEl.textContent = team.averageOverall;
        if (avgPacEl) avgPacEl.textContent = team.averagePace;
        if (avgPasEl) avgPasEl.textContent = team.averagePassing;

        this.filterAndRenderSquad();
      }
    } catch (err) {
      console.warn('Error refreshing squad:', err);
    }
  },

  filterAndRenderSquad() {
    const searchInput = document.getElementById('squadSearchInput');
    const sortSelect = document.getElementById('squadSortSelect');
    const activeFilterBtn = document.querySelector('.filter-pill-btn.active');
    const container = document.getElementById('squadPlayersGrid');

    if (!container) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const lineFilter = activeFilterBtn ? activeFilterBtn.dataset.line : 'ALL';
    const sortBy = sortSelect ? sortSelect.value : 'overall_desc';

    let filtered = [...this.allPlayers];

    // Filter by name
    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    }

    // Filter by line
    if (lineFilter !== 'ALL') {
      const attPositions = ['ST', 'CF', 'LW', 'RW'];
      const midPositions = ['CAM', 'CM', 'CDM'];
      const defPositions = ['CB', 'LB', 'RB'];

      if (lineFilter === 'ATT') filtered = filtered.filter(p => attPositions.includes(p.primaryPosition));
      else if (lineFilter === 'MID') filtered = filtered.filter(p => midPositions.includes(p.primaryPosition));
      else if (lineFilter === 'DEF') filtered = filtered.filter(p => defPositions.includes(p.primaryPosition));
    }

    // Sort
    if (sortBy === 'overall_desc') filtered.sort((a, b) => b.overall - a.overall);
    else if (sortBy === 'overall_asc') filtered.sort((a, b) => a.overall - b.overall);
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'pace') filtered.sort((a, b) => (b.attributes.pace || 0) - (a.attributes.pace || 0));

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
          <h3 style="color: #fff; font-size: 1.3rem; margin-bottom: 0.5rem;">No Players in Dynamo FC Squad Yet</h3>
          <p style="margin-bottom: 1.5rem; max-width: 450px; margin-left: auto; margin-right: auto;">
            Evaluate team members across the 20-question football test to generate player cards and populate the squad roster.
          </p>
          <button class="btn-primary-large" onclick="App.resetAssessment(); App.switchView('assessment-view');">
            + Evaluate First Player
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const attrs = p.attributes || {};
      return `
        <div class="squad-player-card" data-player-id="${p._id}">
          <div>
            <div class="sq-card-top">
              <div class="sq-ovr-box">
                <span class="sq-ovr">${p.overall}</span>
                <span class="sq-pos">${p.primaryPosition}</span>
              </div>
              <div class="sq-menu-actions">
                <button class="btn-icon-sq danger" title="Remove Player" onclick="App.deletePlayerConfirm('${p._id}')">🗑️</button>
              </div>
            </div>

            <div class="sq-player-info">
              <h3>${p.name}</h3>
              <div class="sq-player-meta">
                #${p.jerseyNumber || 10} • ${p.preferredFoot ? p.preferredFoot.toUpperCase() : 'RIGHT'} FOOT • ${p.playstyle ? p.playstyle.name : 'All-Rounder'}
              </div>
            </div>

            <div class="sq-stats-compact">
              <div class="sq-stat-cell"><div class="s-val">${attrs.pace || '--'}</div><div class="s-lbl">PAC</div></div>
              <div class="sq-stat-cell"><div class="s-val">${attrs.shooting || '--'}</div><div class="s-lbl">SHO</div></div>
              <div class="sq-stat-cell"><div class="s-val">${attrs.passing || '--'}</div><div class="s-lbl">PAS</div></div>
              <div class="sq-stat-cell"><div class="s-val">${attrs.dribbling || '--'}</div><div class="s-lbl">DRI</div></div>
              <div class="sq-stat-cell"><div class="s-val">${attrs.defending || '--'}</div><div class="s-lbl">DEF</div></div>
              <div class="sq-stat-cell"><div class="s-val">${attrs.physical || '--'}</div><div class="s-lbl">PHY</div></div>
            </div>
          </div>

          <div class="sq-card-actions">
            <button class="btn-sq-view" onclick="App.viewPlayerById('${p._id}')">View FIFA Card & Analysis</button>
          </div>
        </div>
      `;
    }).join('');
  },

  async viewPlayerById(id) {
    const p = this.allPlayers.find(x => x._id === id);
    if (p) {
      this.showPlayerAnalysis(p);
    } else {
      try {
        const res = await API.getPlayerById(id);
        if (res.success && res.data) this.showPlayerAnalysis(res.data);
      } catch (err) {
        alert('Could not open player details.');
      }
    }
  },

  async deletePlayerConfirm(id) {
    const p = this.allPlayers.find(x => x._id === id);
    const name = p ? p.name : 'this player';
    if (!confirm(`Are you sure you want to remove ${name} from the squad?`)) return;

    try {
      await API.deletePlayer(id);
      this.allPlayers = this.allPlayers.filter(x => x._id !== id);
      this.refreshSquadView();
    } catch (err) {
      alert(`Could not delete player: ${err.message}`);
    }
  }
};

// Initialize App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
