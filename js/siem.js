/**
 * SIEM (Security Information and Event Management) Dashboard controller
 * Manages the events line chart (Chart.js), radial threat gauge, and log ticker feed.
 * Supports multiple scenarios (0: Power Grid, 1: Transit, 2: Hospital)
 */

class SiemDashboard {
  constructor(chartCanvasId, gaugeContainerId, tickerContainerId) {
    this.chartCanvasId = chartCanvasId;
    this.gaugeContainerId = gaugeContainerId;
    this.tickerContainerId = tickerContainerId;

    this.chart = null;
    this.currentPhase = -1;
    this.currentScenario = -1;
    this.speedMultiplier = 1;
    
    // EPS sliding window
    this.maxDataPoints = 20;
    this.chartLabels = [];
    this.chartData = [];
    this.timeCounter = 0;

    // Tick lists for logger grouped by Scenario and Phase
    this.alertTemplates = {
      0: { // Scenario 0: Power Grid Substation Compromise
        0: [
          "Inbound traffic normal on firewall interface eth0. Bandwidth: 42.8 Mbps",
          "SCADA telemetry polling complete: PLC_192.168.42.50 reporting status OK",
          "Active Directory domain sync successful with HQ server",
          "DHCP lease renewed for client hostname OPERATOR_WS_3",
          "Encrypted database backup task completed successfully"
        ],
        1: [
          "IP 185.220.101.4 (External WAN) scanning TCP ports 22, 80, 443, 502, 44818",
          "Intrusion Detection System: TCP SYN Portscan detected from source 185.220.101.4",
          "Threshold exceeded: 12 authentication failures within 10s from IP 185.220.101.4",
          "Failed login attempts on SSH service (VLAN 10, target CORP_HQ) - user: admin",
          "Failed login attempts on SSH service (VLAN 10, target CORP_HQ) - user: scada_ops",
          "SSH Authentication SUCCESSFUL for user 'engineering' from unauthorized IP 185.220.101.4"
        ],
        2: [
          "Modbus protocol anomaly: Unrecognized function code write command sent to PLC_192.168.42.50",
          "ICS telemetry alert: Coil register 40001 (Main Breaker) modified from normal operations!",
          "Power grid failure telemetry: Municipal grid West (VLAN 102) reporting voltage collapse (0 kV)",
          "Power grid failure telemetry: Transit system (VLAN 108) reporting loss of line pressure",
          "SCADA network communication lost with 192.168.42.50 (Timeout)",
          "Emergency diesel backup generators automatically engaging for Hospital ER (VLAN 110)"
        ],
        3: [
          "SOAR (Security Orchestration, Automation, Response) triggered for SCADA network",
          "Automated isolation directive deployed: Restricting firewall interface eth0:VLAN42",
          "Host route revoked: IP 192.168.42.10 isolated from accessing SCADA VLAN 42",
          "Threat source vector severed. Firewall active rules updated.",
          "Grid recovery sequence: Re-routing electrical loops to Municipal Grid West",
          "Grid recovery sequence: Power telemetry restored for Transit system (100% load)"
        ],
        4: [
          "SOAR incident response capture archived. Incident ticket #INC-94821",
          "Security logs rotated. Threat index resetting.",
          "Running compliance validation sweep...",
          "Validation sweep complete: All municipal endpoints green. Systems healthy."
        ]
      },
      1: { // Scenario 1: Transit Hub Signal Hijack
        0: [
          "Transit telemetry feed active on signal loop track A & B.",
          "API request status check: OK (200) from controller_192.168.42.80",
          "Metro route coordination: Automatic scheduling script running.",
          "Active Directory check: Operator console login status green."
        ],
        1: [
          "Intrusion detection warning: API vulnerability scan detected from WAN IP 189.124.99.112",
          "Nikto scan signature detected on HTTP service (VLAN 108, TRANSIT_HUB)",
          "Vulnerability Alert: Multiple HTTP 404/GET queries on non-existent directories.",
          "IDS Warning: Automated security audit sweep running against API signal override routes."
        ],
        2: [
          "CRITICAL ALERT: Command injection syntax detected on POST /api/v1/signal/override!",
          "ALERT: Unauthorized reverse shell connection established to external IP 10.10.14.89",
          "CRITICAL TELEMETRY: Signal Override command executing on Transit Controller CLI.",
          "ALERT: Track B rail signals set to RED. Track collision warning systems engaged!",
          "ALERT: Railway automatic failsafe emergency stop triggered. Grid lock in progress."
        ],
        3: [
          "SOAR ACTION: Network isolation block deployed for VLAN 108 transit endpoints.",
          "SOAR ACTION: IP 189.124.99.112 blocked at main edge firewall gateway.",
          "INFO: Signal controller override connection dropped. Session terminated.",
          "INFO: Rail routing rollback script deployed. Restoring Track B signal statuses.",
          "INFO: Transit systems online. Normal operations re-established."
        ],
        4: [
          "Incident ticket #INC-94830 archived for security review.",
          "Rotated API request logs. Threat index reset.",
          "Failsafe status validation check complete: Railway signals green."
        ]
      },
      2: { // Scenario 2: Hospital ER Ransomware Lock
        0: [
          "Hospital server health sweep: OK. Database replicas sync active.",
          "Firewall check: Inbound SMB/LDAP requests restricted to municipal range.",
          "Patient telemetry feeds: active and polling (120 nodes online).",
          "DHCP lease renewal: ER operator workstation assigned IP 192.168.42.92"
        ],
        1: [
          "IDS Notice: Inbound phishing email quarantined for user operator2@hospital.local",
          "WARN: User er_reception opened external link containing macro script attachment.",
          "ALERT: Backdoor command shell established from receptionist console to IP 45.227.254.12",
          "WARN: Privilege escalation attempt detected on host receptionist_PC via exploit CVE-2022-26923"
        ],
        2: [
          "CRITICAL ALERT: Cryptolocker binary execution detected in C:\\Windows\\Temp\\locker.exe!",
          "ALERT: Multiple bulk file write operations. Shadow copies deleted on receptionist server.",
          "CRITICAL BREACH: Patient database records encrypted. Files renamed with .locked suffix!",
          "ALERT: HVAC ventilation control registers offline (temperature alarm triggered).",
          "WARN: Emergency air-gapped system isolation manual switch pulled by administrator."
        ],
        3: [
          "SOAR ACTION: Automated quarantine of receptionist VLAN 110. Subnet isolated.",
          "SOAR ACTION: Active Directory credentials revoked for compromise session er_reception.",
          "INFO: Ransomware network propagation halted. 0 files affected on other subnets.",
          "INFO: Emergency backup system recovery loop initialized from air-gapped backups.",
          "INFO: HVAC control systems re-loaded. Temperature stabilizing. Patient records online."
        ],
        4: [
          "Security compliance validation sweep: VLAN 110 safe. Systems disinfected.",
          "Incident report #INC-94831 compiled. Security logs rotated.",
          "Threat index baseline restore complete."
        ]
      }
    };

    this.tickerInterval = null;
  }

  init() {
    this.initChart();
    this.initGauge();
    this.initTicker();
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    this.resetTickerInterval();
  }

  initChart() {
    const ctx = document.getElementById(this.chartCanvasId).getContext('2d');
    
    // Seed initial historical baseline data
    for (let i = 0; i < this.maxDataPoints; i++) {
      this.chartLabels.push(`-${this.maxDataPoints - i}s`);
      this.chartData.push(40 + Math.floor(Math.random() * 25));
    }

    // Chart.js styling configurations
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'EPS (Events Per Second)',
          data: this.chartData,
          borderColor: '#10b981', // green default
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.1)' },
            ticks: { display: false }
          },
          y: {
            min: 0,
            max: 1600,
            grid: { color: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
              color: '#737373',
              font: { family: 'monospace', size: 9 }
            }
          }
        }
      }
    });
  }

  initGauge() {
    const container = document.getElementById(this.gaugeContainerId);
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center relative w-full h-full">
        <svg viewBox="0 0 100 100" class="w-36 h-36">
          <!-- Background track -->
          <circle cx="50" cy="50" r="40" stroke="#171717" stroke-width="8" fill="none" />
          <!-- Animated Progress arc -->
          <circle id="threat-gauge-circle" cx="50" cy="50" r="40" stroke="#10b981" stroke-width="8" fill="none" 
            stroke-dasharray="251.2" stroke-dashoffset="251.2" transform="rotate(-90 50 50)" class="radial-progress-transition" />
          <!-- Center Text -->
          <text id="threat-gauge-text" x="50" y="56" font-family="monospace" font-size="18" fill="#10b981" text-anchor="middle" font-weight="bold">0%</text>
        </svg>
        <div class="font-mono text-[10px] text-neutral-500 mt-2 tracking-wider">SIEM THREAT INDEX</div>
      </div>
    `;
  }

  initTicker() {
    const ticker = document.getElementById(this.tickerContainerId);
    if (!ticker) return;
    ticker.innerHTML = `<div class="text-neutral-500 font-mono text-xs">// Event log connection established. Polling logs...</div>`;
    this.resetTickerInterval();
  }

  resetTickerInterval() {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    
    // Choose base speed: print a message roughly every 2.5s (scaled by multiplier)
    const intervalTime = 2500 / this.speedMultiplier;
    this.tickerInterval = setInterval(() => {
      this.injectRandomAlert();
    }, intervalTime);
  }

  triggerPhase(phase, scenarioId = 0) {
    this.currentPhase = phase;
    this.currentScenario = scenarioId;
    
    // Color configurations based on phase
    let color = '#10b981'; // Green
    if (phase === 1) color = '#f59e0b'; // Amber
    if (phase === 2) color = '#ef4444'; // Red
    if (phase === 3) color = '#3b82f6'; // Blue

    // Update Chart.js lines
    if (this.chart) {
      this.chart.data.datasets[0].borderColor = color;
      this.chart.data.datasets[0].backgroundColor = this.hexToRgba(color, 0.05);
      this.chart.update('none');
    }

    // Trigger immediate major alerts on phase changes
    this.injectPhaseStarterAlert(phase);

    // Update status labels in SIEM
    this.updateMetricsText(phase, scenarioId);
  }

  updateMetricsText(phase, scenarioId) {
    const fwEl = document.getElementById("siem-metric-fw");
    const levelEl = document.getElementById("siem-metric-level font-bold") || document.getElementById("siem-metric-level");
    
    if (fwEl) {
      if (phase === 3) {
        fwEl.textContent = "ISOLATED (SOAR)";
        fwEl.className = "text-xs font-bold text-blue-400 mt-0.5";
      } else if (phase === 2) {
        fwEl.textContent = "BYPASSED [FAIL]";
        fwEl.className = "text-xs font-bold text-red-500 mt-0.5";
      } else {
        fwEl.textContent = "ACTIVE (OK)";
        fwEl.className = "text-xs font-bold text-green-400 mt-0.5";
      }
    }

    if (levelEl) {
      if (phase === 0 || phase === 4) {
        levelEl.textContent = "NORMAL";
        levelEl.className = "text-xs font-bold text-green-400";
      } else if (phase === 1) {
        levelEl.textContent = "ELEVATED";
        levelEl.className = "text-xs font-bold text-amber-500";
      } else if (phase === 2) {
        levelEl.textContent = "BREACH CRITICAL";
        levelEl.className = "text-xs font-bold text-red-500";
      } else if (phase === 3) {
        levelEl.textContent = "MITIGATING";
        levelEl.className = "text-xs font-bold text-blue-400";
      }
    }
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Called once every second by the main orchestrator loop
   */
  tick() {
    this.timeCounter++;
    
    // 1. Generate appropriate Events Per Second (EPS) based on Phase
    let targetEPS = 50;
    let noise = Math.floor(Math.random() * 20) - 10;

    switch(this.currentPhase) {
      case 0:
        targetEPS = 50 + noise; // 40-70
        break;
      case 1:
        targetEPS = 180 + Math.floor(Math.random() * 80) - 40; // 140-220
        break;
      case 2:
        targetEPS = 1350 + Math.floor(Math.random() * 300) - 150; // 1200-1500
        break;
      case 3:
        targetEPS = 130 + Math.floor(Math.random() * 40) - 20; // 110-150
        break;
      case 4:
        targetEPS = 50 + noise; // back to normal 40-70
        break;
    }

    if (targetEPS < 10) targetEPS = 10;

    this.chartData.push(targetEPS);
    if (this.chartData.length > this.maxDataPoints) {
      this.chartData.shift();
    }
    
    if (this.chart) {
      this.chart.update('none');
    }

    const epsValEl = document.getElementById("siem-metric-eps");
    if (epsValEl) epsValEl.textContent = targetEPS;

    // 2. Manage Threat Index Gauge logic
    let targetThreatPercent = 0;
    switch(this.currentPhase) {
      case 0:
        targetThreatPercent = 4;
        break;
      case 1:
        targetThreatPercent = 38;
        break;
      case 2:
        targetThreatPercent = 98;
        break;
      case 3:
        targetThreatPercent = 12;
        break;
      case 4:
        targetThreatPercent = 4;
        break;
    }
    // add small fluctuation
    if (this.currentPhase !== 2) {
      targetThreatPercent += (this.timeCounter % 2 === 0 ? 1 : -1);
    }
    this.updateThreatGauge(targetThreatPercent);
  }

  updateThreatGauge(percent) {
    const circle = document.getElementById("threat-gauge-circle");
    const text = document.getElementById("threat-gauge-text");
    if (!circle || !text) return;

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    const circumference = 251.2;
    const offset = circumference - (percent / 100) * circumference;
    circle.setAttribute("stroke-dashoffset", offset);
    text.textContent = `${percent}%`;

    // Colors
    let color = "#10b981"; // green
    if (percent >= 25 && percent < 75) color = "#f59e0b"; // amber
    if (percent >= 75) color = "#ef4444"; // red
    if (this.currentPhase === 3) color = "#3b82f6"; // blue mitigation

    circle.setAttribute("stroke", color);
    text.setAttribute("fill", color);
  }

  injectPhaseStarterAlert(phase) {
    const starterMessages = {
      0: {
        0: "System check completed. Baseline security configuration is active.",
        1: "System check completed. Transit loop configuration online.",
        2: "System check completed. Hospital ER replica active."
      },
      1: {
        0: "Intrusion Detection System warning: Anomalous ping sweep/scans targeting Substation Alpha.",
        1: "Intrusion Detection System warning: API path scan sweep targeting Metro signaling ports.",
        2: "IDS warning: Anomalous phishing carrier link detected on ER user reception email."
      },
      2: {
        0: "CRITICAL BREACH ALERT: Unauthorized SCADA Modbus override registry coil modification detected!",
        1: "CRITICAL BREACH ALERT: Command injection override executing on Rail signal systems!",
        2: "CRITICAL BREACH ALERT: Ransomware cryptolocker execution detected in local Temp folder!"
      },
      3: {
        0: "BLUE TEAM SOAR RESPONSE INITIATED: Automated quarantine of Substation Alpha VLAN 42.",
        1: "BLUE TEAM SOAR RESPONSE INITIATED: Restricting Transit API access, severing compromised sockets.",
        2: "BLUE TEAM SOAR RESPONSE INITIATED: Quarantining Hospital VLAN 110, triggering backup restore sequence."
      },
      4: {
        0: "Sanitization loop executing: Incident logs archived. ROTATING THREAT INDEX.",
        1: "Sanitization loop executing: API tokens refreshed. Incident logs archived.",
        2: "Sanitization loop executing: Ransomware decryption complete. Patient records restored."
      }
    };

    const scId = (this.currentScenario !== -1) ? this.currentScenario : 0;
    const msg = starterMessages[phase][scId] || "Alert loop tracking active.";
    this.logAlert(msg, phase);
  }

  injectRandomAlert() {
    const scId = (this.currentScenario !== -1) ? this.currentScenario : 0;
    const phId = (this.currentPhase !== -1) ? this.currentPhase : 0;
    
    const scTemplates = this.alertTemplates[scId];
    if (!scTemplates) return;
    const templates = scTemplates[phId];
    if (!templates) return;

    const msg = templates[Math.floor(Math.random() * templates.length)];
    this.logAlert(msg, this.currentPhase);
  }

  logAlert(message, phase) {
    const ticker = document.getElementById(this.tickerContainerId);
    if (!ticker) return;

    // Build timestamp
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds()/10)).padStart(2, '0')}`;

    // Select color based on level
    let badgeClass = "text-green-500 bg-green-500/10 border border-green-500/30";
    let badgeText = "INFO";

    if (phase === 1) {
      badgeClass = "text-amber-500 bg-amber-500/10 border border-amber-500/30";
      badgeText = "WARN";
    } else if (phase === 2) {
      badgeClass = "text-red-500 bg-red-500/10 border border-red-500/30";
      badgeText = "ALERT";
      if (message.includes("CRITICAL") || message.includes("BREACH")) {
        badgeText = "CRIT";
      }
    } else if (phase === 3) {
      badgeClass = "text-blue-500 bg-blue-500/10 border border-blue-500/30";
      badgeText = "SOAR";
    }

    const logEl = document.createElement("div");
    logEl.className = "flex gap-3 py-1 text-[13px] font-mono items-start opacity-0 transition-opacity duration-300";
    logEl.innerHTML = `
      <span class="text-neutral-500 shrink-0 font-light">${ts}</span>
      <span class="px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0 ${badgeClass}">${badgeText}</span>
      <span class="text-neutral-300 break-all select-all">${message}</span>
    `;

    ticker.appendChild(logEl);
    
    setTimeout(() => {
      logEl.classList.remove("opacity-0");
    }, 10);

    while (ticker.childElementCount > 40) {
      ticker.removeChild(ticker.firstElementChild);
    }

    ticker.scrollTop = ticker.scrollHeight;
  }
}

window.SiemDashboard = SiemDashboard;
