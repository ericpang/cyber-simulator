/**
 * Master Central Orchestrator & State Machine
 * Coordinates timeline loop, phase transitions, multiple scenarios, and HUD controls
 */

class AppOrchestrator {
  constructor() {
    this.seconds = 0;
    this.maxSeconds = 300; // 5 minutes per loop
    this.cycleCount = 1;
    this.isPlaying = false;
    this.speedMultiplier = 1;
    this.timerId = null;
    
    this.currentPhase = -1;
    this.currentScenario = 0; // 0: Power Grid, 1: Transit, 2: Hospital
    this.scenarioChanged = true; // flag to trigger intro speech prepends

    // Scenarios Configurations
    this.scenarios = [
      {
        id: 0,
        name: "Scenario 1: Power Grid Substation Compromise",
        desc: "Attacker targets Substation Alpha Modbus relays, blacking out municipal grids."
      },
      {
        id: 1,
        name: "Scenario 2: Metro Transit Platform Signal Hijack",
        desc: "Attacker targets Transit Hub API signal override controls, freezing track signals."
      },
      {
        id: 2,
        name: "Scenario 3: Hospital ER Ransomware Lock",
        desc: "Attacker targets Hospital ER SMB shares, deploying cryptolocker ransomware."
      }
    ];

    // Phase Configurations
    this.phases = [
      {
        id: 0,
        name: "Phase 0 - Baseline Operations",
        desc: "Normal operations. Low threat activity. Telemetry reporting clean states.",
        badgeClass: "bg-green-500/10 text-green-400 border border-green-500/30",
        start: 0,
        end: 60
      },
      {
        id: 1,
        name: "Phase 1 - Reconnaissance & Phishing",
        desc: "Active directory scans and brute force credentials pivot in progress.",
        badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
        start: 60,
        end: 135
      },
      {
        id: 2,
        name: "Phase 2 - Subsystem Exploitation",
        desc: "Exploit payload executed. Subnet targets compromised, causing service blackout/lock.",
        badgeClass: "bg-red-500/10 text-red-400 border border-red-500/30",
        start: 135,
        end: 210
      },
      {
        id: 3,
        name: "Phase 3 - Autonomous Isolation & Defense",
        desc: "SOAR firewall rules quarantine target subnets. Backups restore networks.",
        badgeClass: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
        start: 210,
        end: 270
      },
      {
        id: 4,
        name: "Phase 4 - Sanitization & Campaign Reset",
        desc: "Cleaning attacker caches, rotating threat indices, and standing by for next sequence.",
        badgeClass: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/30",
        start: 270,
        end: 300
      }
    ];
    this.isVoiceEnabled = true;
    this.selectedVoiceName = "";
    
    // Interactive Prompts Options & State
    this.isInteractiveMode = true;
    this.selectedChoiceIndex = 0;
    this.pollData = {};

    // CTF Mode Options & State
    this.isCtfMode = false;
    this.ctfScore = 0;
    this.ctfChallenges = {};
    this.solvedFlags = {}; // key format: `${scenarioId}-${phaseId}` -> true
  }

  async init() {
    // Instantiate subsystems
    this.attacker = new window.AttackerTerminal("attacker-terminal-content");
    this.cityMap = new window.CityMap("city-map-container");
    this.siem = new window.SiemDashboard("eps-chart", "threat-gauge-container", "siem-ticker-content");

    // Load interactive polls configuration from abstracted file
    try {
      const response = await fetch(`interactive_polls.json?v=${Date.now()}`);
      if (response.ok) {
        this.pollData = await response.json();
      } else {
        console.warn("interactive_polls.json response failed.");
      }
    } catch (err) {
      console.error("Failed to load interactive_polls.json config:", err);
    }

    // Load CTF challenges configuration
    try {
      const response = await fetch(`ctf_challenges.json?v=${Date.now()}`);
      if (response.ok) {
        this.ctfChallenges = await response.json();
      } else {
        console.warn("ctf_challenges.json response failed.");
      }
    } catch (err) {
      console.error("Failed to load ctf_challenges.json config:", err);
    }

    // Initialize subsystems
    this.attacker.init();
    this.cityMap.init();
    this.siem.init();

    // Bind controls
    this.bindControls();

    // Start tick loop in paused state
    this.currentPhase = -1;
    this.setScenario(0);
    
    // Update play/pause button UI to reflect paused state
    const playPauseBtn = document.getElementById("ctrl-play-pause");
    if (playPauseBtn) {
      if (this.isInteractiveMode) {
        playPauseBtn.disabled = true;
        playPauseBtn.innerHTML = `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> PAUSED`;
        playPauseBtn.className = "px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-600 font-mono text-xs flex items-center transition cursor-not-allowed opacity-50";
        
        const copilotContent = document.getElementById("ai-copilot-content");
        if (copilotContent) {
          copilotContent.textContent = "[SYSTEM NOTICE]: Simulation is in INTERACTIVE PROMPTS mode. Auto-play is disabled. Click any Phase Override button below to start voting and configure custom tactics.";
        }
      } else {
        playPauseBtn.innerHTML = `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> RESUME`;
        playPauseBtn.className = "px-3 py-1.5 rounded bg-green-500/10 border border-green-500/40 hover:bg-green-500/20 text-green-400 font-mono text-xs flex items-center transition glow-border-green";
      }
    }
  }

  bindControls() {
    // Voice toggle controls
    const voiceToggle = document.getElementById("ctrl-voice-toggle");
    if (voiceToggle) {
      voiceToggle.addEventListener("change", (e) => {
        this.isVoiceEnabled = e.target.checked;
        if (!this.isVoiceEnabled && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      });
    }

    // Interactive Prompts toggle controls
    const interactiveToggle = document.getElementById("ctrl-interactive-toggle");
    if (interactiveToggle) {
      interactiveToggle.addEventListener("change", (e) => {
        this.isInteractiveMode = e.target.checked;
        const playPauseBtn = document.getElementById("ctrl-play-pause");
        
        if (this.isInteractiveMode) {
          if (this.isCtfMode) {
            this.isCtfMode = false;
            const ctfToggle = document.getElementById("ctrl-ctf-toggle");
            if (ctfToggle) ctfToggle.checked = false;
            this.toggleCtfMode(false);
          }
          // Pause the simulation automatic playing
          this.isPlaying = false;
          if (this.timerId) clearTimeout(this.timerId);
          
          // Disable play/pause button and style it as paused/inactive
          if (playPauseBtn) {
            playPauseBtn.disabled = true;
            playPauseBtn.innerHTML = `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> PAUSED`;
            playPauseBtn.className = "px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-600 font-mono text-xs flex items-center transition cursor-not-allowed opacity-50";
          }
          
          // Notify operator via AI Co-Pilot
          const copilotContent = document.getElementById("ai-copilot-content");
          if (copilotContent) {
            copilotContent.textContent = "[SYSTEM NOTICE]: Simulation is in INTERACTIVE PROMPTS mode. Auto-play is disabled. Click any Phase Override button below to start voting and configure custom tactics.";
          }
        } else {
          // Re-enable play/pause button
          if (playPauseBtn) {
            playPauseBtn.disabled = false;
            playPauseBtn.innerHTML = `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> RESUME`;
            playPauseBtn.className = "px-3 py-1.5 rounded bg-green-500/10 border border-green-500/40 hover:bg-green-500/20 text-green-400 font-mono text-xs flex items-center transition glow-border-green";
          }
          
          // Notify operator via AI Co-Pilot
          const copilotContent = document.getElementById("ai-copilot-content");
          if (copilotContent) {
            copilotContent.textContent = "[SYSTEM NOTICE]: Interactive prompts disabled. Simulation controls restored. Click RESUME to auto-play the campaign.";
          }
        }
      });
    }

    // CTF Mode toggle controls
    const ctfToggle = document.getElementById("ctrl-ctf-toggle");
    if (ctfToggle) {
      ctfToggle.addEventListener("change", (e) => {
        this.toggleCtfMode(e.target.checked);
      });
    }

    // CTF Hint button
    const ctfHintBtn = document.getElementById("ctf-hint-btn");
    if (ctfHintBtn) {
      ctfHintBtn.addEventListener("click", () => {
        const hintText = document.getElementById("ctf-hint-text");
        if (hintText) {
          hintText.classList.toggle("hidden");
        }
      });
    }

    // CTF Submit button
    const ctfSubmitBtn = document.getElementById("ctf-submit-btn");
    if (ctfSubmitBtn) {
      ctfSubmitBtn.addEventListener("click", () => {
        this.submitCtfFlag();
      });
    }

    // CTF Flag input enter key
    const ctfFlagInput = document.getElementById("ctf-flag-input");
    if (ctfFlagInput) {
      ctfFlagInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.submitCtfFlag();
        }
      });
    }

    // Voice selection dropdown change
    const voiceSelect = document.getElementById("ctrl-voice-select");
    if (voiceSelect) {
      voiceSelect.addEventListener("change", (e) => {
        this.selectedVoiceName = e.target.value;
      });

      if ('speechSynthesis' in window) {
        // Load initial voices list
        this.populateVoicesDropdown();
        // Chrome/Firefox load voices asynchronously, so we also need voiceschanged
        window.speechSynthesis.onvoiceschanged = () => {
          this.populateVoicesDropdown();
        };
      }
    }

    // AI Analyze button trigger
    const aiBtn = document.getElementById("ai-analyze-btn");
    if (aiBtn) {
      aiBtn.addEventListener("click", () => {
        this.runAIAgentAnalysis();
      });
    }

    // Play/Pause button
    const playPauseBtn = document.getElementById("ctrl-play-pause");
    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", () => {
        if (this.isInteractiveMode) {
          const copilotContent = document.getElementById("ai-copilot-content");
          if (copilotContent) {
            copilotContent.textContent = "[SYSTEM NOTICE]: Auto-play is disabled in INTERACTIVE PROMPTS mode. Select a phase override in the SIEM header to trigger a poll and proceed manually.";
          }
          return;
        }
        this.isPlaying = !this.isPlaying;
        playPauseBtn.innerHTML = this.isPlaying 
          ? `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> PAUSE`
          : `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> RESUME`;
        
        playPauseBtn.className = this.isPlaying
          ? "px-3 py-1.5 rounded bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-300 font-mono text-xs flex items-center transition"
          : "px-3 py-1.5 rounded bg-green-500/10 border border-green-500/40 hover:bg-green-500/20 text-green-400 font-mono text-xs flex items-center transition glow-border-green";
        
        if (this.isPlaying) {
          this.triggerTickLoop();
        } else {
          if (this.timerId) clearTimeout(this.timerId);
        }
      });
    }

    // Speed controls
    const speeds = [1, 5, 10];
    speeds.forEach(spd => {
      const btn = document.getElementById(`ctrl-speed-${spd}x`);
      if (btn) {
        btn.addEventListener("click", () => {
          speeds.forEach(s => {
            const b = document.getElementById(`ctrl-speed-${s}x`);
            if (b) b.className = "px-2 py-1.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-500 font-mono text-[10px] hover:text-neutral-300 transition";
          });
          btn.className = "px-2 py-1.5 rounded bg-blue-500/10 border border-blue-500/40 text-blue-400 font-mono text-[10px] glow-border-blue transition";
          this.setSpeedMultiplier(spd);
        });
      }
    });

    // Phase Jumps
    this.phases.forEach(ph => {
      const btn = document.getElementById(`ctrl-phase-${ph.id}`);
      if (btn) {
        btn.addEventListener("click", () => {
          this.jumpToPhase(ph.id);
        });
      }
    });

    // Scenario Selection Jumps
    this.scenarios.forEach(sc => {
      const btn = document.getElementById(`ctrl-scenario-${sc.id}`);
      if (btn) {
        btn.addEventListener("click", () => {
          this.setScenario(sc.id);
        });
      }
    });
  }

  setSpeedMultiplier(multiplier) {
    this.speedMultiplier = multiplier;
    this.attacker.setSpeed(multiplier);
    this.siem.setSpeed(multiplier);
  }

  setScenario(scenarioId) {
    this.currentScenario = scenarioId;
    this.scenarioChanged = true;
    this.seconds = 0; // restart timeline from 0 for the new scenario
    this.selectedChoiceIndex = 0; // reset choice index to default

    // Update Scenario buttons active class styles
    this.scenarios.forEach(sc => {
      const btn = document.getElementById(`ctrl-scenario-${sc.id}`);
      if (btn) {
        if (sc.id === scenarioId) {
          btn.className = "px-2.5 py-1 rounded text-neutral-200 font-mono text-[9px] transition bg-neutral-900 border border-neutral-700 font-bold";
        } else {
          btn.className = "px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-neutral-200 transition font-mono text-[9px] text-neutral-500 border border-transparent";
        }
      }
    });

    // Force updates immediately
    this.currentPhase = -1;
    this.updateUI();
    this.evaluateStateTransitions();

    if (this.isPlaying) {
      if (this.timerId) clearTimeout(this.timerId);
      this.triggerTickLoop();
    }

    if (this.isCtfMode) {
      this.updateCtfConsole();
    }
  }

  jumpToPhase(phaseId) {
    const phase = this.phases.find(p => p.id === phaseId);
    if (!phase) return;

    if (this.isInteractiveMode) {
      this.showInteractivePoll(phaseId, (choiceIndex) => {
        // Track the chosen option
        this.selectedChoiceIndex = choiceIndex;

        // Set to phase start
        this.seconds = phase.start;
        this.currentPhase = -1; // force evaluation and transition
        this.updateUI();
        this.evaluateStateTransitions();
      });
    } else {
      this.selectedChoiceIndex = 0; // reset to default in non-interactive
      this.seconds = phase.start;
      this.updateUI();
      this.evaluateStateTransitions();
      if (this.isPlaying) {
        if (this.timerId) clearTimeout(this.timerId);
        this.tick();
        this.triggerTickLoop();
      }
    }
  }

  showInteractivePoll(phaseId, callback) {
    const modal = document.getElementById("interactive-poll-modal");
    const questionText = document.getElementById("poll-question-text");
    const choicesContainer = document.getElementById("poll-choices-container");
    
    if (!modal || !questionText || !choicesContainer) return;
    
    // Read from currentScenario's pollData
    const scenarioPolls = this.pollData[this.currentScenario];
    if (!scenarioPolls) return;
    const poll = scenarioPolls[phaseId];
    if (!poll) return;
    
    questionText.textContent = poll.question;
    choicesContainer.innerHTML = "";
    
    poll.choices.forEach((choice, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-4 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-blue-500/60 hover:bg-blue-950/30 text-neutral-300 hover:text-blue-400 transition duration-200 flex flex-col gap-2 focus:outline-none cursor-pointer";
      
      const titleSpan = document.createElement("span");
      titleSpan.className = "text-sm font-bold font-mono tracking-wide";
      titleSpan.textContent = choice.text;
      
      const descSpan = document.createElement("span");
      descSpan.className = "text-xs text-neutral-400 font-mono leading-normal";
      descSpan.textContent = choice.desc;
      
      btn.appendChild(titleSpan);
      btn.appendChild(descSpan);
      
      btn.addEventListener("click", () => {
        // Hide modal
        modal.classList.add("hidden");
        // Trigger callback with selected choice index
        callback(index);
      });
      
      choicesContainer.appendChild(btn);
    });
    
    modal.classList.remove("hidden");
  }

  triggerTickLoop() {
    if (this.timerId) clearTimeout(this.timerId);
    
    const run = () => {
      if (!this.isPlaying) return;
      this.tick();
      const delay = 1000 / this.speedMultiplier;
      this.timerId = setTimeout(run, delay);
    };

    const delay = 1000 / this.speedMultiplier;
    this.timerId = setTimeout(run, delay);
  }

  tick() {
    this.seconds++;

    if (this.seconds >= this.maxSeconds) {
      // Loop ends, pause the simulation and reset the current scenario instead of auto-playing the next campaign!
      this.seconds = 0;
      this.isPlaying = false;
      if (this.timerId) clearTimeout(this.timerId);

      // Reset play/pause button state in the DOM to reflect paused state
      const playPauseBtn = document.getElementById("ctrl-play-pause");
      if (playPauseBtn) {
        playPauseBtn.innerHTML = `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> RESUME`;
        playPauseBtn.className = "px-3 py-1.5 rounded bg-green-500/10 border border-green-500/40 hover:bg-green-500/20 text-green-400 font-mono text-xs flex items-center transition glow-border-green";
      }

      this.setScenario(this.currentScenario);
      return;
    }

    this.updateUI();
    this.evaluateStateTransitions();

    // Tick SIEM charts
    this.siem.tick();
  }

  evaluateStateTransitions() {
    const phase = this.phases.find(p => this.seconds >= p.start && this.seconds < p.end);
    if (phase && phase.id !== this.currentPhase) {
      this.currentPhase = phase.id;
      
      // Update UI Header Phase details
      const phaseBadge = document.getElementById("hud-phase-badge");
      const phaseTitle = document.getElementById("hud-phase-title");
      const phaseDesc = document.getElementById("hud-phase-desc");

      if (phaseBadge) {
        phaseBadge.textContent = `PHASE 0${phase.id}`;
        phaseBadge.className = `px-2 py-0.5 rounded text-[10px] font-bold tracking-wider shrink-0 ${phase.badgeClass}`;
      }
      if (phaseTitle) {
        phaseTitle.textContent = `${this.scenarios[this.currentScenario].name} · ${phase.name}`;
      }
      if (phaseDesc) {
        phaseDesc.textContent = phase.desc;
      }

      // Update Phase selector buttons styles
      this.phases.forEach(ph => {
        const btn = document.getElementById(`ctrl-phase-${ph.id}`);
        if (btn) {
          if (ph.id === phase.id) {
            btn.className = "px-2.5 py-1 rounded text-blue-400 font-mono text-[9px] transition bg-blue-500/10 border border-blue-500/40 glow-border-blue font-bold";
          } else {
            btn.className = "px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-neutral-200 transition font-mono text-[9px] text-neutral-500 border border-transparent";
          }
        }
      });

      // Update TTY Header title in Attacker panel
      const panelAttTitle = document.getElementById("panel-attacker-title");
      if (panelAttTitle) {
        panelAttTitle.textContent = `PANEL 1 // THREAT PROPAGATION SYSTEM (SCENARIO 0${this.currentScenario + 1})`;
      }

      // Trigger subsystems state change
      this.attacker.triggerPhase(phase.id, this.currentScenario, this.selectedChoiceIndex);
      this.cityMap.triggerPhase(phase.id, this.currentScenario, this.selectedChoiceIndex);
      this.siem.triggerPhase(phase.id, this.currentScenario, this.selectedChoiceIndex);

      // Voice prompt announcement
      this.announcePhase(phase.id);

      // Trigger AI Tactical Co-Pilot intrusion analysis
      this.runAIAgentAnalysis();
    }
  }

  updateUI() {
    const hudTimeElapsed = document.getElementById("hud-time-elapsed");
    const hudTimeRemaining = document.getElementById("hud-time-remaining");
    const hudTimelinePercent = document.getElementById("hud-timeline-percent");
    const hudCycleVal = document.getElementById("hud-cycle-val");

    if (hudCycleVal) hudCycleVal.textContent = this.cycleCount;

    const elapsedMin = String(Math.floor(this.seconds / 60)).padStart(2, '0');
    const elapsedSec = String(this.seconds % 60).padStart(2, '0');
    if (hudTimeElapsed) hudTimeElapsed.textContent = `${elapsedMin}:${elapsedSec}`;

    const activePhase = this.phases.find(p => p.id === this.currentPhase);
    if (activePhase) {
      const remainingSeconds = activePhase.end - this.seconds;
      const remMin = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
      const remSec = String(remainingSeconds % 60).padStart(2, '0');
      if (hudTimeRemaining) hudTimeRemaining.textContent = `${remMin}:${remSec}`;

      const totalPhaseDuration = activePhase.end - activePhase.start;
      const elapsedInPhase = this.seconds - activePhase.start;
      const progressPercent = Math.min(100, Math.floor((elapsedInPhase / totalPhaseDuration) * 100));
      if (hudTimelinePercent) {
        hudTimelinePercent.style.width = `${progressPercent}%`;
      }
    }
  }

  announcePhase(phaseId) {
    if (!this.isVoiceEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // Audio script announcements mapping Scenario and Phase
      const announcements = {
        0: { // Scenario 0: Power Grid
          0: "System baseline established. All networks operating within normal parameters.",
          1: "Threat warning. Reconnaissance activity detected targeting Substation Alpha network.",
          2: "Critical breach alert. Substation Alpha telemetry compromised. Municipal power grid offline.",
          3: "Mitigation active. Automated isolation protocols triggered. Restoring power grids.",
          4: "Sanitization sequence initiated. Threat cache rotation active. Next campaign standby."
        },
        1: { // Scenario 1: Transit API
          0: "System baseline established. Transit loop configuration online.",
          1: "Threat warning. Web API scanning activity detected targeting Metro signaling ports.",
          2: "Critical breach alert. Transit hub signaling overridden. Platform signals locked to red.",
          3: "Mitigation active. Automated firewall rules deployed. Restoring railways signaling.",
          4: "Sanitization sequence initiated. Request logs rotated. Next campaign standby."
        },
        2: { // Scenario 2: Hospital Ransomware
          0: "System baseline established. Hospital ER patient database active.",
          1: "Threat warning. Phishing entry backdoor detected on receptionist terminal.",
          2: "Critical breach alert. Cryptolocker ransomware execution detected. Database files encrypted.",
          3: "Mitigation active. Automated subnet quarantine deployed. Restoring patient records from backup.",
          4: "Sanitization sequence completed. Subnet disinfected. Threat campaign complete."
        }
      };

      let introText = "";
      if (this.scenarioChanged) {
        this.scenarioChanged = false;
        introText = `Initiating ${this.scenarios[this.currentScenario].name}. `;
      }

      const msgText = introText + (announcements[this.currentScenario][phaseId] || "");
      if (msgText) {
        const utterance = new SpeechSynthesisUtterance(msgText);
        
        // Conversational rates and pitches for natural human sweet tone
        utterance.rate = 0.95; // natural conversational pacing, slightly slower for sweeter tone
        utterance.pitch = 1.15;  // natural human sweet pitch, slightly higher to sound friendly/sweet
        
        const voices = window.speechSynthesis.getVoices();
        let voice = null;

        // If the user manually selected a voice from the dropdown, try to match it
        if (this.selectedVoiceName) {
          voice = voices.find(v => v.name === this.selectedVoiceName);
        }

        // Fallback matching logic if no manual select or voice not found
        if (!voice) {
          const femaleVoiceNames = [
            "Microsoft Jenny Online (Natural)", 
            "Microsoft Aria Online (Natural)", 
            "Microsoft Sonia Online (Natural)", 
            "Google UK English Female",
            "Google US English Female",
            "Samantha", 
            "Microsoft Zira", 
            "Microsoft Hazel",
            "Microsoft Jenny", 
            "Microsoft Aria"
          ];
          for (let name of femaleVoiceNames) {
            voice = voices.find(v => v.lang.startsWith('en') && v.name.includes(name));
            if (voice) break;
          }
        }

        if (!voice) {
          voice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
        }
        
        if (!voice) {
          voice = voices.find(v => v.lang.startsWith('en'));
        }

        if (voice) {
          utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
      }
    }
  }

  async runAIAgentAnalysis() {
    const statusIndicator = document.getElementById("ai-status-indicator");
    const copilotContent = document.getElementById("ai-copilot-content");
    const analyzeBtn = document.getElementById("ai-analyze-btn");
    const modelInput = document.getElementById("ai-model-name");

    if (!copilotContent) return;

    const modelName = modelInput ? modelInput.value.trim() : "gemma4:26b";
    
    if (statusIndicator) {
      statusIndicator.className = "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse";
    }
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "ANALYZING...";
      analyzeBtn.className = "px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-[8px] transition font-bold shrink-0";
    }

    copilotContent.textContent = "ESTABLISHING TELEMETRY FEED TO LOCAL MODEL...\n";

    const scenarioName = this.scenarios[this.currentScenario].name;
    const phase = this.phases.find(p => p.id === this.currentPhase) || { name: "Unknown", desc: "" };
    
    const ticker = document.getElementById("siem-ticker-content");
    let logs = [];
    if (ticker) {
      const children = Array.from(ticker.children);
      logs = children.slice(-3).map(el => el.querySelector("span:last-child")?.textContent || "").filter(Boolean);
    }
    const logsStr = logs.length > 0 ? logs.join(" | ") : "No telemetry logs recorded yet.";

    const prompt = `You are an expert cybersecurity incident responder at an Integrated Command Center.
Current Campaign: ${scenarioName}
Current Campaign Phase: ${phase.name} (${phase.desc})
Active Logs: ${logsStr}

Provide a highly concise, 2 to 3 sentence tactical threat analysis for command operators. Suggest a direct security defense recommendation. Output plain text only. Do not output markdown, asterisks, bullet points, prefix text, or conversational intro. Be direct and professional.`;

    try {
      const response = await fetch("http://172.27.120.208:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelName,
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || "No response received from local LLM.";
      
      this.typewriteText(copilotContent, `[AI ADVICE]: ${aiResponse}`);
      
      if (statusIndicator) {
        statusIndicator.className = "w-1.5 h-1.5 rounded-full bg-green-500 animate-ping";
      }
    } catch (err) {
      console.warn("Ollama AI Agent connection failed:", err);
      
      const errorMsg = `[OFFLINE] LOCAL AGENT OFFLINE\n\nFailed to reach Ollama at http://172.27.120.208:11434/api/generate.\n\nTo enable this panel:\n1. Install Ollama on host 172.27.120.208 and pull your model:\n   > ollama pull ${modelName}\n2. Set environment variable for CORS origins on that host:\n   $env:OLLAMA_ORIGINS="*"\n3. Run Ollama serve binding to the network interface:\n   > ollama serve --host 0.0.0.0\n\n(Fallback analysis template):\n- Campaign status is abnormal.\n- Threat levels are elevated for ${scenarioName}.\n- Recommended action: Verify and isolate critical subnet paths immediately.`;
      
      copilotContent.textContent = errorMsg;
      if (statusIndicator) {
        statusIndicator.className = "w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#ef4444]";
      }
    } finally {
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "ANALYZE";
        analyzeBtn.className = "px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 font-mono text-[8px] transition font-bold shrink-0";
      }
    }
  }

  typewriteText(container, text) {
    container.textContent = "";
    let i = 0;
    const speed = 25;
    const type = () => {
      if (i < text.length) {
        container.textContent += text.charAt(i);
        i++;
        container.scrollTop = container.scrollHeight;
        setTimeout(type, speed);
      }
    };
    type();
  }

  populateVoicesDropdown() {
    const voiceSelect = document.getElementById("ctrl-voice-select");
    if (!voiceSelect || !('speechSynthesis' in window)) return;

    const voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";

    // Add a default system voice option
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "SYSTEM DEFAULT";
    voiceSelect.appendChild(defaultOpt);
    
    // Filter and add English voices if list is loaded
    const englishVoices = voices.filter(v => v.lang.startsWith("en"));
    
    // Auto-select preferred sweet female voice on start if no user selection is saved
    if (!this.selectedVoiceName) {
      const preferred = [
        "Microsoft Jenny Online (Natural)",
        "Microsoft Aria Online (Natural)",
        "Microsoft Sonia Online (Natural)",
        "Google UK English Female",
        "Google US English Female",
        "Samantha",
        "Microsoft Zira",
        "Microsoft Hazel",
        "Microsoft Jenny",
        "Microsoft Aria"
      ];
      let foundVoice = null;
      for (const pref of preferred) {
        foundVoice = englishVoices.find(v => v.name.includes(pref));
        if (foundVoice) break;
      }
      if (foundVoice) {
        this.selectedVoiceName = foundVoice.name;
      }
    }

    englishVoices.forEach(voice => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      
      if (voice.name === this.selectedVoiceName) {
        option.selected = true;
      }
      
      voiceSelect.appendChild(option);
    });

    // Default select if nothing matched preferred and selected is still empty
    if (!this.selectedVoiceName && voiceSelect.value === "" && voiceSelect.children.length > 1) {
      this.selectedVoiceName = voiceSelect.children[1].value;
      voiceSelect.children[1].selected = true;
    }
  }

  toggleCtfMode(enabled) {
    this.isCtfMode = enabled;
    const aiContainer = document.getElementById("ai-copilot-container");
    const ctfContainer = document.getElementById("ctf-console-container");
    const scoreContainer = document.getElementById("ctf-score-container");
    const interactiveToggle = document.getElementById("ctrl-interactive-toggle");
    const playPauseBtn = document.getElementById("ctrl-play-pause");

    if (enabled) {
      // 1. Turn off Interactive Prompts
      if (this.isInteractiveMode) {
        this.isInteractiveMode = false;
        if (interactiveToggle) interactiveToggle.checked = false;
      }

      // 2. Hide AI Co-pilot, show CTF Console and Scoreboard
      if (aiContainer) aiContainer.classList.add("hidden");
      if (ctfContainer) ctfContainer.classList.remove("hidden");
      if (scoreContainer) scoreContainer.classList.remove("hidden");

      // 3. Pause timeline loop and lock controls
      this.isPlaying = false;
      if (this.timerId) clearTimeout(this.timerId);
      if (playPauseBtn) {
        playPauseBtn.disabled = true;
        playPauseBtn.innerHTML = `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> LOCKED`;
        playPauseBtn.className = "px-3 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-600 font-mono text-xs flex items-center transition cursor-not-allowed opacity-50";
      }

      // Disable phase overrides
      this.phases.forEach(ph => {
        const btn = document.getElementById(`ctrl-phase-${ph.id}`);
        if (btn) {
          btn.style.pointerEvents = "none";
          btn.style.opacity = "0.3";
        }
      });

      // 4. Force timeline to Phase 0 of the current scenario
      this.seconds = 0;
      this.currentPhase = -1;
      this.updateUI();
      this.evaluateStateTransitions();

      // 5. Update CTF HUD
      this.updateCtfConsole();
    } else {
      // Restore default states
      if (aiContainer) aiContainer.classList.remove("hidden");
      if (ctfContainer) ctfContainer.classList.add("hidden");
      if (scoreContainer) scoreContainer.classList.add("hidden");

      // Restore phase override buttons
      this.phases.forEach(ph => {
        const btn = document.getElementById(`ctrl-phase-${ph.id}`);
        if (btn) {
          btn.style.pointerEvents = "auto";
          btn.style.opacity = "1";
        }
      });

      // Restore Play/Pause button
      if (playPauseBtn) {
        playPauseBtn.disabled = false;
        playPauseBtn.innerHTML = `<svg class="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> RESUME`;
        playPauseBtn.className = "px-3 py-1.5 rounded bg-green-500/10 border border-green-500/40 hover:bg-green-500/20 text-green-400 font-mono text-xs flex items-center transition glow-border-green";
      }

      // Reset scenario to start fresh
      this.setScenario(this.currentScenario);
    }
  }

  updateCtfConsole() {
    const ctfTitle = document.getElementById("ctf-challenge-title");
    const ctfDesc = document.getElementById("ctf-challenge-desc");
    const ctfHintText = document.getElementById("ctf-hint-text");
    const ctfFeedback = document.getElementById("ctf-feedback");
    const ctfFlagInput = document.getElementById("ctf-flag-input");
    const ctfSubmitBtn = document.getElementById("ctf-submit-btn");

    if (!ctfTitle || !ctfDesc || !ctfHintText || !ctfFeedback) return;

    // Clear input and hide hint
    if (ctfFlagInput) ctfFlagInput.value = "";
    ctfHintText.classList.add("hidden");
    ctfFeedback.textContent = "AWAITING FLAG INPUT";
    ctfFeedback.className = "text-[9px] font-mono text-center mt-1.5 h-3.5 text-neutral-500";

    // targetPhase is the next phase to unlock.
    // If currentPhase is 0, we are on Challenge 1 (which leads to Phase 1).
    // If currentPhase is 1, Challenge 2 (leads to Phase 2).
    // If currentPhase is 2, Challenge 3 (leads to Phase 3).
    // If currentPhase is 3, they have completed Phase 3, so transition to Phase 4 (cleanse/completion).
    const targetPhase = this.currentPhase + 1;

    if (targetPhase > 3) {
      ctfTitle.textContent = "🏆 CAMPAIGN SECURED!";
      ctfDesc.innerHTML = `<span class="text-green-400 font-bold">CONGRATULATIONS OPERATOR!</span><br/>You successfully solved all challenges for this campaign.<br/><br/>Select another campaign above to start a new mission.`;
      if (ctfFlagInput) ctfFlagInput.disabled = true;
      if (ctfSubmitBtn) ctfSubmitBtn.disabled = true;
      
      // Auto advance to Phase 4 sanitization reset
      const nextPhaseConfig = this.phases.find(p => p.id === 4);
      if (nextPhaseConfig) {
        this.seconds = nextPhaseConfig.start;
        this.currentPhase = -1;
        this.updateUI();
        this.evaluateStateTransitions();
      }
      return;
    }

    if (ctfFlagInput) ctfFlagInput.disabled = false;
    if (ctfSubmitBtn) ctfSubmitBtn.disabled = false;

    const challenge = this.ctfChallenges[this.currentScenario]?.[targetPhase];
    if (challenge) {
      ctfTitle.textContent = challenge.title;
      ctfDesc.textContent = challenge.desc;
      ctfHintText.textContent = `HINT: ${challenge.hint}`;
    } else {
      ctfTitle.textContent = "Challenge: Loading...";
      ctfDesc.textContent = "Standby for incoming campaign telemetry briefing.";
    }
  }

  submitCtfFlag() {
    const ctfFlagInput = document.getElementById("ctf-flag-input");
    const ctfFeedback = document.getElementById("ctf-feedback");
    const ctfContainer = document.getElementById("ctf-console-container");

    if (!ctfFlagInput || !ctfFeedback) return;

    const userInput = ctfFlagInput.value.trim().toLowerCase();
    if (!userInput) {
      ctfFeedback.textContent = "ERROR: Flag input cannot be empty";
      ctfFeedback.className = "text-[9px] font-mono text-center mt-1.5 h-3.5 text-amber-500";
      return;
    }

    const targetPhase = this.currentPhase + 1;
    const challenge = this.ctfChallenges[this.currentScenario]?.[targetPhase];
    if (!challenge) return;

    const isCorrect = userInput === challenge.flag.toLowerCase();

    if (isCorrect) {
      this.playCtfCheers();
      const key = `${this.currentScenario}-${targetPhase}`;
      if (!this.solvedFlags[key]) {
        this.solvedFlags[key] = true;
        this.ctfScore += challenge.points;
        const scoreVal = document.getElementById("ctf-score-val");
        if (scoreVal) scoreVal.textContent = this.ctfScore;
      }

      ctfFeedback.textContent = `SUCCESS: VALID FLAG DECRYPTED! +${challenge.points} PTS`;
      ctfFeedback.className = "text-[9px] font-mono text-center mt-1.5 h-3.5 text-green-400 animate-pulse font-bold";

      // Trigger standard visual phase progression
      const nextPhaseConfig = this.phases.find(p => p.id === targetPhase);
      if (nextPhaseConfig) {
        this.seconds = nextPhaseConfig.start;
        this.currentPhase = -1; // force re-evaluation
        this.updateUI();
        this.evaluateStateTransitions();
      }

      setTimeout(() => {
        this.updateCtfConsole();
      }, 2000);

    } else {
      this.playCtfBuzzer();
      ctfFeedback.textContent = "ACCESS DENIED: INVALID FLAG / CHECKSUM MISMATCH";
      ctfFeedback.className = "text-[9px] font-mono text-center mt-1.5 h-3.5 text-red-500 font-bold";

      if (ctfContainer) {
        ctfContainer.classList.add("animate-shake");
        ctfContainer.style.borderColor = "#ef4444";
        setTimeout(() => {
          ctfContainer.classList.remove("animate-shake");
          ctfContainer.style.borderColor = "";
        }, 500);
      }
    }
  }

  playCtfBuzzer() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const duration = 0.8;
      
      // We use 3 oscillators to build a rich, discordant, descending "fail" buzz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const oscDiscord = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      oscDiscord.type = 'sawtooth';

      // Low power grid / system failure rumble starting frequencies
      osc1.frequency.setValueAtTime(140, ctx.currentTime);
      osc2.frequency.setValueAtTime(143, ctx.currentTime);
      oscDiscord.frequency.setValueAtTime(195, ctx.currentTime); // Discordant tritone/7th feel

      // Dramatic slide down in pitch
      osc1.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + duration);
      osc2.frequency.exponentialRampToValueAtTime(57, ctx.currentTime + duration);
      oscDiscord.frequency.exponentialRampToValueAtTime(77, ctx.currentTime + duration);

      // Volume envelope: start loud and decrease
      gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      oscDiscord.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      oscDiscord.start();

      osc1.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
      oscDiscord.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Failed to play dramatic buzzer audio:", e);
    }
  }

  playCtfCheers() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Step 1: Rapid triumphant arpeggio build-up
      const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
      const noteDelay = 0.06;
      
      arpeggio.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * noteDelay);
        
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime + index * noteDelay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * noteDelay + 0.25);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + index * noteDelay);
        osc.stop(ctx.currentTime + index * noteDelay + 0.25);
      });

      // Step 2: Big, dramatic, sustaining C-Major 9th chord at the end of the arpeggio
      const chordTime = arpeggio.length * noteDelay;
      const chordNotes = [
        { freq: 523.25, type: 'triangle' }, // C5
        { freq: 659.25, type: 'triangle' }, // E5
        { freq: 783.99, type: 'sine' },     // G5
        { freq: 987.77, type: 'sine' },     // B5 (Major 7th for warmth/gleam)
        { freq: 1046.50, type: 'sine' },    // C6
        { freq: 1318.51, type: 'sine' }     // E6
      ];
      
      chordNotes.forEach(note => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = note.type;
        // Introduce a tiny detune to give a rich chorus/ensemble effect
        osc.frequency.setValueAtTime(note.freq + (Math.random() * 4 - 2), ctx.currentTime + chordTime);
        
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime + chordTime);
        // Long, dramatic sustain and slow fade
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + chordTime + 1.2);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(ctx.currentTime + chordTime);
        osc.stop(ctx.currentTime + chordTime + 1.25);
      });
    } catch (e) {
      console.warn("Failed to play dramatic cheers audio:", e);
    }
  }
}

// Instantiate on window load
window.addEventListener("load", () => {
  window.AppState = new AppOrchestrator();
  window.AppState.init();
});
