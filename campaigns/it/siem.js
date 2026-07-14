/**
 * SIEM (Security Information and Event Management) Dashboard controller
 * Manages the events line chart (Chart.js), radial threat gauge, and log ticker feed.
 * Supports multiple IT scenarios (0: Active Directory, 1: Cloud E-Commerce, 2: BEC)
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
      0: { // Scenario 0: Active Directory Ransomware
        0: [
          "Inbound traffic normal on firewall interface eth0. Bandwidth: 42.8 Mbps",
          "LDAP telemetry polling complete: DomainController_192.168.20.100 reporting status OK",
          "Active Directory domain sync successful with Secondary DC server",
          "DHCP lease renewed for client workstation host DESKTOP-AD03",
          "Encrypted directory database backup task completed successfully"
        ],
        1: [
          "IP 185.220.101.4 (External WAN) scanning TCP ports 389, 445, 3389",
          "Intrusion Detection System: TCP SYN Portscan detected targeting Domain Controller from source 185.220.101.4",
          "Threshold exceeded: 12 authentication failures within 10s from IP 185.220.101.4 on domain accounts",
          "Failed login attempts on RDP service (VLAN 20, target DOMAIN_CONTROLLER) - user: Administrator",
          "Failed login attempts on RDP service (VLAN 20, target DOMAIN_CONTROLLER) - user: sysadmin",
          "Kerberos TGT Ticket Harvesting SUCCESSFUL for principal 'sysadmin' from unauthorized IP 185.220.101.4"
        ],
        2: [
          "SMB protocol anomaly: Unrecognized service write command sent to DOMAIN_CONTROLLER",
          "Active Directory Alert: NTDS.dit database file write lock requested by process locker.exe!",
          "System login failure telemetry: Workstation LAN (VLAN 30) reporting Domain authentication server unreachable",
          "Finance database telemetry: Finance servers (VLAN 40) reporting account lockouts",
          "Active Directory replication service lost communication with 192.168.20.100 (Timeout)",
          "Mail Server SMTP queue starting to buffer due to Domain authentication failure"
        ],
        3: [
          "SOAR (Security Orchestration, Automation, Response) triggered for Enterprise network",
          "Automated isolation directive deployed: Restricting firewall interface eth0:VLAN20",
          "Domain Controller VLAN 20 quarantined. Attacker access routes blocked.",
          "Threat source vector severed. Firewall active rules updated.",
          "Directory recovery sequence: Restoring NTDS.dit database from offline backups",
          "Authentication telemetry restored for Workstation LAN and Finance servers (100% active)"
        ],
        4: [
          "SOAR incident response capture archived. Incident ticket #INC-94821",
          "Security logs rotated. Threat index resetting.",
          "Running compliance validation sweep...",
          "Validation sweep complete: All directory endpoints green. Systems healthy."
        ]
      },
      1: { // Scenario 1: Cloud E-Commerce SQLi
        0: [
          "Web traffic normal on portal interface. Bandwidth: 124 Mbps",
          "API request status check: OK (200) from web_portal_10.0.1.20",
          "SQL database replicas health check: OK, replication delay 0ms",
          "Active session count: 4,050 concurrent customer connections"
        ],
        1: [
          "Intrusion detection warning: API vulnerability scan detected from WAN IP 189.124.99.112",
          "sqlmap scan signature detected on HTTP service (VLAN 10, WEB_PORTAL)",
          "Vulnerability Alert: Multiple HTTP 500/GET queries on URL /api/v1/users",
          "IDS Warning: Automated security audit sweep running against SQL DB API endpoints."
        ],
        2: [
          "CRITICAL ALERT: SQL Injection syntax UNION SELECT detected on POST /api/v1/users!",
          "ALERT: Unauthorized web shell execution detected. Process spawned: /bin/sh",
          "CRITICAL TELEMETRY: Database dump command executing on e-commerce catalog.",
          "ALERT: Customer table rows exported. Sensitive payment details exposed!",
          "ALERT: Web Portal CPU usage spiked to 100% due to database lock queries.",
          "WAF STATE DETECTED: Incoming rule update queued -> STATUS: BLOCKED for attacking IP."
        ],
        3: [
          "SOAR ACTION: Network isolation block deployed for Web Portal VLAN 10.",
          "SOAR ACTION: IP 189.124.99.112 blocked at WAF gateway level.",
          "INFO: SQL Injection database dump process aborted. Sockets closed.",
          "INFO: Prepared statement rollback deployed. Restoring database access.",
          "INFO: E-Commerce portal back online. SQL queries sanitized."
        ],
        4: [
          "Incident ticket #INC-94830 archived for security review.",
          "Rotated API request logs. Threat index reset.",
          "Failsafe status validation check complete: SQL database sanitized."
        ]
      },
      2: { // Scenario 2: Corporate BEC Phishing
        0: [
          "Mail gateway server status: OK. Anti-spam definitions up to date.",
          "Firewall check: Inbound SMTP routing restricted to MX records.",
          "Workstation health sweep: active and polling (450 nodes online).",
          "Active directory session status: OK for CFO_workstation_172.16.5.150"
        ],
        1: [
          "IDS Notice: Inbound phishing email quarantined for user finance-clerk@enterprise.com",
          "WARN: User executive_cfo opened external link containing macro-enabled attachment.",
          "ALERT: Backdoor command shell established from executive PC to IP 45.227.254.12",
          "WARN: Privilege escalation attempt detected on host CFO_workstation via CVE-2021-40444"
        ],
        2: [
          "CRITICAL ALERT: Mimikatz session dumping execution detected on CFO Workstation!",
          "ALERT: Active directory mail credentials compromised for principal executive_cfo.",
          "CRITICAL BREACH: Fraudulent wire transfer mail template dispatched to accounting PC!",
          "ALERT: Mail forwarding rules modified (copying all emails to hacker@evil.org).",
          "WARN: High-value financial exfiltration alert triggered on SMTP outbound queues.",
          "SOAR PRE-STAGE: Invalidation task prepared for CFO session tokens."
        ],
        3: [
          "SOAR ACTION: Automated quarantine of CFO workstation VLAN 20. Subnet isolated.",
          "SOAR ACTION: Active Directory session REVOKED for compromise account executive_cfo.",
          "INFO: Malicious mail forwarding rules deleted. Outbound SMTP queue flushed.",
          "INFO: Workstation recovery initialized using clean Golden OS profile.",
          "INFO: CFO credentials rotated. Financial transaction verification complete."
        ],
        4: [
          "Security compliance validation sweep: Mailboxes safe. Accounts disinfected.",
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
      <div class="relative w-full h-full flex flex-col items-center justify-center p-2">
        <svg viewBox="0 0 100 100" class="w-24 h-24 transform -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#262626" stroke-width="6"/>
          <circle id="threat-gauge-circle" cx="50" cy="50" r="42" fill="none" stroke="#10b981" stroke-width="6.5" 
            stroke-dasharray="263.89" stroke-dashoffset="263.89" class="transition-all duration-700 ease-out"/>
        </svg>
        <div class="absolute flex flex-col items-center justify-center">
          <span class="text-neutral-500 font-mono text-[9px] uppercase tracking-wider">threat index</span>
          <span id="threat-gauge-text" class="text-lg font-extrabold font-mono text-green-500">0.02</span>
        </div>
      </div>
    `;
  }

  initTicker() {
    const ticker = document.getElementById(this.tickerContainerId);
    if (!ticker) return;
    ticker.innerHTML = "";
    
    // Log immediate startup
    this.logAlert("SIEM dashboard initialization completed successfully. Real-time logging channel open.", -1);
    this.resetTickerInterval();
  }

  resetTickerInterval() {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
    }
    
    const intervalTime = 6000 / this.speedMultiplier;
    this.tickerInterval = setInterval(() => {
      this.injectRandomAlert();
    }, intervalTime);
  }

  /**
   * Orchestrator hook when phase transitions
   */
  triggerPhase(phase, scenarioId = 0, optionIndex = 0) {
    this.currentPhase = phase;
    this.currentScenario = scenarioId;

    // Reset ticker interval immediately to inject first alert fast
    this.resetTickerInterval();
    
    // Inject phase starter alert
    this.injectPhaseStarterAlert(phase);

    // Update chart colors and visual styles matching threat levels
    this.updateChartStylesForPhase(phase);
  }

  updateChartStylesForPhase(phase) {
    if (!this.chart) return;
    
    let color = '#10b981'; // Green
    let fill = 'rgba(16, 185, 129, 0.05)';
    
    if (phase === 1) {
      color = '#f59e0b'; // Amber
      fill = 'rgba(245, 158, 11, 0.05)';
    } else if (phase === 2) {
      color = '#ef4444'; // Red
      fill = 'rgba(239, 68, 68, 0.08)';
    } else if (phase === 3) {
      color = '#3b82f6'; // Blue
      fill = 'rgba(59, 130, 246, 0.06)';
    }

    this.chart.data.datasets[0].borderColor = color;
    this.chart.data.datasets[0].backgroundColor = fill;
    this.chart.update();
  }

  /**
   * Main clock step loop
   */
  tick() {
    this.timeCounter++;

    // Calculate dynamic EPS targets based on scenario and phase progression
    let targetEps = 40 + Math.floor(Math.random() * 20); // Baseline Phase 0
    let threatValue = 0.02;

    if (this.currentPhase === 1) {
      targetEps = 240 + Math.floor(Math.random() * 80); // Phase 1 Recon
      threatValue = 0.35 + (Math.random() * 0.1);
    } else if (this.currentPhase === 2) {
      targetEps = 950 + Math.floor(Math.random() * 450); // Phase 2 Breach (Critical)
      threatValue = 0.88 + (Math.random() * 0.08);
    } else if (this.currentPhase === 3) {
      targetEps = 420 + Math.floor(Math.random() * 110); // Phase 3 Mitigation active
      threatValue = 0.44 - (this.timeCounter % 10) * 0.02;
    } else if (this.currentPhase === 4) {
      targetEps = 55 + Math.floor(Math.random() * 15); // Phase 4 Sanitization / Resetting
      threatValue = 0.05;
    }

    // Slide window data
    this.chartData.shift();
    this.chartData.push(targetEps);
    
    // Shift labels
    this.chartLabels.shift();
    this.chartLabels.push(`-${this.maxDataPoints - (this.timeCounter % this.maxDataPoints)}s`);
    
    if (this.chart) {
      this.chart.update('none'); // silent update
    }

    // Update gauge
    this.updateThreatGauge(threatValue);
  }

  updateThreatGauge(val) {
    const circle = document.getElementById("threat-gauge-circle");
    const text = document.getElementById("threat-gauge-text");

    if (!circle || !text) return;

    // Constrain val
    const rawVal = Math.min(1.0, Math.max(0.0, val));
    
    // Percent offsets 0 to 263.89
    const perimeter = 2 * Math.PI * 42; // ~263.89
    const offset = perimeter - (rawVal * perimeter);
    circle.style.strokeDashoffset = offset;

    // Format text
    text.textContent = rawVal.toFixed(2);

    // Color matching
    let color = "#10b981"; // green
    if (rawVal >= 0.3 && rawVal < 0.7) {
      color = "#f59e0b"; // amber
    } else if (rawVal >= 0.7) {
      color = "#ef4444"; // red
    } else if (this.currentPhase === 3) {
      color = "#3b82f6"; // SOAR blue
    }

    circle.setAttribute("stroke", color);
    text.setAttribute("fill", color);
  }

  injectPhaseStarterAlert(phase) {
    const starterMessages = {
      0: {
        0: "System check completed. Directory services baseline configuration is active.",
        1: "System check completed. E-Commerce web API gateway online.",
        2: "System check completed. Corporate SMTP mail server active."
      },
      1: {
        0: "Intrusion Detection System warning: Anomalous ping sweep/scans targeting Domain Controller.",
        1: "Intrusion Detection System warning: API path scan sweep targeting SQL database endpoints.",
        2: "IDS warning: Anomalous phishing link clicked on CFO executive PC email."
      },
      2: {
        0: "CRITICAL BREACH ALERT: Active Directory NTDS database file write lock detected by process locker.exe!",
        1: "CRITICAL BREACH ALERT: SQL Injection database dump exfiltration command executing on web portal!",
        2: "CRITICAL BREACH ALERT: Session hijacked. Outbound wire transfer payment fraud executed!"
      },
      3: {
        0: "BLUE TEAM SOAR RESPONSE INITIATED: Automated quarantine of primary Domain Controller VLAN 20.",
        1: "BLUE TEAM SOAR RESPONSE INITIATED: Web Application Firewall blocking rules active. Attacker IP blocked.",
        2: "BLUE TEAM SOAR RESPONSE INITIATED: Revoking executive session tokens and quarantining CFO Workstation VLAN 20."
      },
      4: {
        0: "Sanitization loop executing: Incident logs archived. ROTATING THREAT INDEX.",
        1: "Sanitization loop executing: WAF logs saved. Refreshed authentication session tokens.",
        2: "Sanitization loop executing: Mail forward rules deleted. Workstation restored from Golden Image."
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
