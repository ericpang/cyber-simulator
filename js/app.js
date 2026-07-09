/**
 * Master Central Orchestrator & State Machine
 * Coordinates timeline loop, phase transitions, multiple scenarios, and HUD controls
 */

class AppOrchestrator {
  constructor() {
    this.seconds = 0;
    this.maxSeconds = 300; // 5 minutes per loop
    this.cycleCount = 1;
    this.isPlaying = true;
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
  }

  init() {
    // Instantiate subsystems
    this.attacker = new window.AttackerTerminal("attacker-terminal-content");
    this.cityMap = new window.CityMap("city-map-container");
    this.siem = new window.SiemDashboard("eps-chart", "threat-gauge-container", "siem-ticker-content");

    // Initialize subsystems
    this.attacker.init();
    this.cityMap.init();
    this.siem.init();

    // Bind controls
    this.bindControls();

    // Start tick loop
    this.currentPhase = -1;
    this.setScenario(0);
    this.triggerTickLoop();
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
  }

  jumpToPhase(phaseId) {
    const phase = this.phases.find(p => p.id === phaseId);
    if (phase) {
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
      // Loop ends, auto transition to next scenario!
      this.seconds = 0;
      this.cycleCount++;
      const nextScenarioId = (this.currentScenario + 1) % this.scenarios.length;
      this.setScenario(nextScenarioId);
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
      this.attacker.triggerPhase(phase.id, this.currentScenario);
      this.cityMap.triggerPhase(phase.id, this.currentScenario);
      this.siem.triggerPhase(phase.id, this.currentScenario);

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
}

// Instantiate on window load
window.addEventListener("load", () => {
  window.AppState = new AppOrchestrator();
  window.AppState.init();
});
