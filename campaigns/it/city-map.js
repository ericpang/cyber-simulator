/**
 * City Map SVG Visual Topology controller
 * Renders the city grid, nodes, and handles animation states for multiple scenarios.
 * Dynamically updates font sizes and node descriptions matching the selected campaign.
 */

class CityMap {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentPhase = -1;
    this.currentScenario = -1;
  }

  init() {
    this.currentScenario = 0;
    this.container.innerHTML = this.renderSVG(0);
    this.setupNodesTooltip();
    
    // Initialize default states
    this.updateRadarSweep("#10b981");
    this.updateHUDOverlay(0, 0);
  }

  renderSVG(scenarioId) {
    let headerText = "MAP VIEWPORT: ENTERPRISE TOPOLOGY v2.40";
    let nodeHqText = "CORP_HQ";
    let nodeHqIp = "192.168.10.10";
    let nodeSubText = "DOMAIN_CONTROLLER";
    let nodeSubIp = "192.168.20.100 (AD)";
    let nodeResText = "WORKSTATION_LAN";
    let nodeResIp = "VLAN_30 (ACTIVE)";
    let nodeTranText = "FINANCE_SERVERS";
    let nodeTranIp = "VLAN_40 (ACTIVE)";
    let nodeHospText = "EMAIL_GATEWAY";
    let nodeHospIp = "VLAN_50 (ACTIVE)";
    
    let iconHq = `<path d="M-10 14 L-10 -12 L0 -18 L10 -12 L10 14 Z M-4 6 L-4 0 L4 0 L4 6 Z M-4 -6 L-4 -8 L4 -8 L4 -6 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    let iconSub = `<rect x="-12" y="-12" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                  <rect x="-12" y="-3" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                  <rect x="-12" y="6" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                  <circle cx="-6" cy="-9" r="1" fill="currentColor"/>
                  <circle cx="-6" cy="0" r="1" fill="currentColor"/>
                  <circle cx="-6" cy="9" r="1" fill="currentColor"/>`;
    let iconRes = `<rect x="-14" y="-10" width="28" height="17" fill="none" stroke="currentColor" stroke-width="2" rx="2"/>
                  <path d="M-5 7 L-9 13 L9 13 L5 7 Z" fill="none" stroke="currentColor" stroke-width="2"/>`;
    let iconTran = `<rect x="-12" y="-12" width="24" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                    <line x1="-12" y1="-4" x2="12" y2="-4" stroke="currentColor" stroke-width="1.5"/>
                    <line x1="-12" y1="4" x2="12" y2="4" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="0" cy="8" r="1.5" fill="currentColor"/>`;
    let iconHosp = `<rect x="-12" y="-9" width="24" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path d="M-12 -9 L0 1 L12 -9" fill="none" stroke="currentColor" stroke-width="2"/>`;
    let iconThreat = `<path d="M-8 -6 C-8 -12 8 -12 8 -6 C8 -2 6 2 4 4 L4 7 L-4 7 L-4 4 C-6 2 -8 -2 -8 -6 Z M-4 6 L4 6 M-3 -5 A1 1 0 0 1 -3 -3 M3 -5 A1 1 0 0 1 3 -3" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>`;

    if (scenarioId === 0) {
      headerText = "MAP VIEWPORT: ACTIVE DIRECTORY DOMAIN TOPOLOGY v2.4";
      nodeHqText = "CORP_HQ";
      nodeHqIp = "192.168.10.10";
      nodeSubText = "DOMAIN_CONTROLLER";
      nodeSubIp = "192.168.20.100 (AD)";
      nodeResText = "WORKSTATION_LAN";
      nodeResIp = "VLAN_30 (ACTIVE)";
      nodeTranText = "FINANCE_SERVERS";
      nodeTranIp = "VLAN_40 (ACTIVE)";
      nodeHospText = "EMAIL_GATEWAY";
      nodeHospIp = "VLAN_50 (ACTIVE)";
      
      iconSub = `<rect x="-12" y="-12" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                  <rect x="-12" y="-3" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                  <rect x="-12" y="6" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                  <circle cx="-6" cy="-9" r="1" fill="currentColor"/>
                  <circle cx="-6" cy="0" r="1" fill="currentColor"/>
                  <circle cx="-6" cy="9" r="1" fill="currentColor"/>`;
    } else if (scenarioId === 1) {
      headerText = "MAP VIEWPORT: CLOUD E-COMMERCE API TOPOLOGY v2.4";
      nodeHqText = "API_GATEWAY";
      nodeHqIp = "10.0.1.10";
      nodeSubText = "CLOUD_DATABASE";
      nodeSubIp = "10.0.2.50 (SQL)";
      nodeResText = "WEB_PORTAL";
      nodeResIp = "10.0.1.20 (ACTIVE)";
      nodeTranText = "PAYMENT_SERVICE";
      nodeTranIp = "10.0.3.15 (ACTIVE)";
      nodeHospText = "SEARCH_INDEX";
      nodeHospIp = "10.0.4.30 (ACTIVE)";
      
      iconHq = `<rect x="-12" y="-12" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <rect x="-12" y="-3" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <rect x="-12" y="6" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <circle cx="-6" cy="-9" r="1" fill="currentColor"/>
                <circle cx="-6" cy="0" r="1" fill="currentColor"/>
                <circle cx="-6" cy="9" r="1" fill="currentColor"/>`;
      iconSub = `<path d="M-12 -9 C-12 -13 12 -13 12 -9 C12 -5 -12 -5 -12 -9 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                 <path d="M-12 -9 L-12 0 C-12 4 12 4 12 0 L12 -9" fill="none" stroke="currentColor" stroke-width="2"/>
                 <path d="M-12 0 L-12 9 C-12 13 12 13 12 9 L12 0" fill="none" stroke="currentColor" stroke-width="2"/>`;
      iconRes = `<rect x="-14" y="-10" width="28" height="17" fill="none" stroke="currentColor" stroke-width="2" rx="2"/>
                <path d="M-5 7 L-9 13 L9 13 L5 7 Z" fill="none" stroke="currentColor" stroke-width="2"/>`;
      iconTran = `<rect x="-12" y="-12" width="24" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="-12" y1="-4" x2="12" y2="-4" stroke="currentColor" stroke-width="1.5"/>
                  <line x1="-12" y1="4" x2="12" y2="4" stroke="currentColor" stroke-width="1.5"/>`;
      iconHosp = iconSub;
    } else if (scenarioId === 2) {
      headerText = "MAP VIEWPORT: CORPORATE NETWORK TOPOLOGY v2.4";
      nodeHqText = "MAIL_SERVER";
      nodeHqIp = "172.16.5.10";
      nodeSubText = "EXECUTIVE_PC";
      nodeSubIp = "172.16.5.150 (USER)";
      nodeResText = "HR_PORTAL";
      nodeResIp = "172.16.10.12 (ACTIVE)";
      nodeTranText = "ACCOUNTING_PC";
      nodeTranIp = "172.16.10.20 (ACTIVE)";
      nodeHospText = "BACKUP_SERVER";
      nodeHospIp = "172.16.20.50 (ACTIVE)";
      
      // Phishing mail envelope with alert skull icon
      iconThreat = `<rect x="-12" y="-9" width="24" height="18" rx="2" fill="none" stroke="#ef4444" stroke-width="2"/>
                    <path d="M-12 -9 L0 1 L12 -9" fill="none" stroke="#ef4444" stroke-width="2"/>
                    <circle cx="0" cy="4" r="2.2" fill="#ef4444"/>`;
      iconHq = `<rect x="-12" y="-9" width="24" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M-12 -9 L0 1 L12 -9" fill="none" stroke="currentColor" stroke-width="2"/>`;
      iconSub = `<rect x="-14" y="-10" width="28" height="17" fill="none" stroke="currentColor" stroke-width="2" rx="2"/>
                <path d="M-5 7 L-9 13 L9 13 L5 7 Z" fill="none" stroke="currentColor" stroke-width="2"/>`;
      iconRes = iconHq;
      iconTran = iconSub;
      iconHosp = `<rect x="-12" y="-12" width="24" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="-12" y1="-4" x2="12" y2="-4" stroke="currentColor" stroke-width="1.5"/>
                  <line x1="-12" y1="4" x2="12" y2="4" stroke="currentColor" stroke-width="1.5"/>`;
    }

    return `
      <div class="relative w-full h-full bg-grid-cyber flex items-center justify-center p-4">
        <!-- Technical HUD Borders on canvas -->
        <div class="absolute top-2 left-2 font-mono text-[10px] text-neutral-500 tracking-wider">${headerText}</div>
        <div class="absolute bottom-2 right-2 font-mono text-[10px] text-neutral-500 tracking-wider">AUTO SCAN ACTIVE: 60FPS</div>
        <div class="absolute bottom-2 left-2 font-mono text-[10px] text-neutral-500 tracking-wider">MONITORING: ALL SUB-VLAN VECTORS</div>

        <svg viewBox="0 0 800 480" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Hexagonal shield pattern -->
            <pattern id="shield-hex-pattern" width="8" height="13.86" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 8 2.3 L 8 6.9 L 4 9.2 L 0 6.9 L 0 2.3 Z" fill="none" stroke="#3b82f6" stroke-width="0.5" opacity="0.6"/>
            </pattern>

            <!-- Radar Sweep trailing gradient -->
            <linearGradient id="radar-sweep-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop id="radar-stop-start" offset="0%" stop-color="rgba(16, 185, 129, 0)"/>
              <stop id="radar-stop-end" offset="100%" stop-color="rgba(16, 185, 129, 0.25)"/>
            </linearGradient>

            <!-- Neon Glow Filters -->
            <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feComponentTransfer in="blur" result="glow1">
                <feFuncA type="linear" slope="0.8"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="glow-red" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feComponentTransfer in="blur" result="glow1">
                <feFuncA type="linear" slope="0.8"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feComponentTransfer in="blur" result="glow1">
                <feFuncA type="linear" slope="0.8"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feComponentTransfer in="blur" result="glow1">
                <feFuncA type="linear" slope="0.8"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Outer HUD corner decoration brackets -->
          <path d="M 15 30 L 15 15 L 30 15" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none"/>
          <path d="M 785 30 L 785 15 L 770 15" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none"/>
          <path d="M 15 450 L 15 465 L 30 465" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none"/>
          <path d="M 785 450 L 785 465 L 770 465" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none"/>

          <!-- Dynamic Real-Time HUD Metrics Box inside SVG -->
          <g id="hud-metrics-overlay" transform="translate(560, 25)" font-family="monospace">
            <!-- Tech border background -->
            <rect width="220" height="55" fill="rgba(10,10,10,0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1" rx="4"/>
            <path d="M 0 10 L 0 0 L 10 0 M 210 0 L 220 0 L 220 10 M 220 45 L 220 55 L 210 55 M 10 55 L 0 55 L 0 45" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" fill="none"/>
            <text x="12" y="18" font-size="9" fill="#a3a3a3" font-weight="bold">SYSTEM TELEMETRY HUD</text>
            <text x="12" y="32" font-size="10" fill="#3b82f6" font-weight="bold" id="hud-svg-integrity">SYS_INTEGRITY: 100%</text>
            <text x="12" y="45" font-size="10" fill="#10b981" font-weight="bold" id="hud-svg-frequency">NET_LATENCY: 5 ms</text>
            <circle cx="205" cy="15" r="3" fill="#10b981" id="hud-svg-dot" class="animate-pulse"/>
          </g>

          <!-- Group for Data Connection Flows -->
          <g id="map-links">
            <!-- External Threat Source -> Corp HQ -->
            <path id="path-threat-glow" d="M 70 80 Q 110 90 150 140" fill="none" stroke="#262626" stroke-width="6" opacity="0.15" class="transition-all duration-700"/>
            <path id="path-threat" d="M 70 80 Q 110 90 150 140" fill="none" class="data-flow-path data-flow-stopped stroke-neutral-800" stroke-width="2"/>
            
            <!-- Corp HQ -> Substation Alpha -->
            <path id="path-hq-sub-glow" d="M 170 160 Q 285 200 400 240" fill="none" stroke="#10b981" stroke-width="6" opacity="0.15" class="transition-all duration-700" filter="url(#glow-green)"/>
            <path id="path-hq-sub" d="M 170 160 Q 285 200 400 240" fill="none" class="data-flow-path stroke-green-500" stroke-width="2"/>
            
            <!-- Substation Alpha -> Residential District -->
            <path id="path-sub-res-glow" d="M 400 240 Q 300 310 200 380" fill="none" stroke="#10b981" stroke-width="6" opacity="0.15" class="transition-all duration-700" filter="url(#glow-green)"/>
            <path id="path-sub-res" d="M 400 240 Q 300 310 200 380" fill="none" class="data-flow-path stroke-green-500" stroke-width="2"/>
            
            <!-- Substation Alpha -> Transport Hub -->
            <path id="path-sub-tran-glow" d="M 400 240 Q 500 190 600 140" fill="none" stroke="#10b981" stroke-width="6" opacity="0.15" class="transition-all duration-700" filter="url(#glow-green)"/>
            <path id="path-sub-tran" d="M 400 240 Q 500 190 600 140" fill="none" class="data-flow-path stroke-green-500" stroke-width="2"/>
            
            <!-- Substation Alpha -> Hospital Wing -->
            <path id="path-sub-hosp-glow" d="M 400 240 Q 510 310 620 380" fill="none" stroke="#10b981" stroke-width="6" opacity="0.15" class="transition-all duration-700" filter="url(#glow-green)"/>
            <path id="path-sub-hosp" d="M 400 240 Q 510 310 620 380" fill="none" class="data-flow-path stroke-green-500" stroke-width="2"/>
          </g>

          <!-- Group for Data Connection Moving Particles -->
          <g id="map-particles">
            <g id="particles-threat">
              <circle r="3" fill="#ef4444" opacity="0" filter="url(#glow-red)" class="flow-particle">
                <animateMotion id="anim-threat-1" dur="2s" repeatCount="indefinite" path="M 70 80 Q 110 90 150 140"/>
              </circle>
              <circle r="3" fill="#ef4444" opacity="0" filter="url(#glow-red)" class="flow-particle">
                <animateMotion id="anim-threat-2" dur="2s" begin="1s" repeatCount="indefinite" path="M 70 80 Q 110 90 150 140"/>
              </circle>
            </g>
            <g id="particles-hq-sub">
              <circle r="3" fill="#10b981" opacity="0.95" filter="url(#glow-green)" class="flow-particle">
                <animateMotion id="anim-hq-sub-1" dur="4s" repeatCount="indefinite" path="M 170 160 Q 285 200 400 240"/>
              </circle>
              <circle r="3" fill="#10b981" opacity="0.95" filter="url(#glow-green)" class="flow-particle">
                <animateMotion id="anim-hq-sub-2" dur="4s" begin="2s" repeatCount="indefinite" path="M 170 160 Q 285 200 400 240"/>
              </circle>
            </g>
            <g id="particles-sub-res">
              <circle r="3" fill="#10b981" opacity="0.95" filter="url(#glow-green)" class="flow-particle">
                <animateMotion id="anim-sub-res-1" dur="4s" repeatCount="indefinite" path="M 400 240 Q 300 310 200 380"/>
              </circle>
              <circle r="3" fill="#10b981" opacity="0.95" filter="url(#glow-green)" class="flow-particle">
                <animateMotion id="anim-sub-res-2" dur="4s" begin="2s" repeatCount="indefinite" path="M 400 240 Q 300 310 200 380"/>
              </circle>
            </g>
            <g id="particles-sub-tran">
              <circle r="3" fill="#10b981" opacity="0.95" filter="url(#glow-green)" class="flow-particle">
                <animateMotion id="anim-sub-tran-1" dur="4s" repeatCount="indefinite" path="M 400 240 Q 500 190 600 140"/>
              </circle>
              <circle r="3" fill="#10b981" opacity="0.95" filter="url(#glow-green)" class="flow-particle">
                <animateMotion id="anim-sub-tran-2" dur="4s" begin="2s" repeatCount="indefinite" path="M 400 240 Q 500 190 600 140"/>
              </circle>
            </g>
            <g id="particles-sub-hosp">
              <circle r="3" fill="#10b981" opacity="0.95" filter="url(#glow-green)" class="flow-particle">
                <animateMotion id="anim-sub-hosp-1" dur="4s" repeatCount="indefinite" path="M 400 240 Q 510 310 620 380"/>
              </circle>
              <circle r="3" fill="#10b981" opacity="0.95" filter="url(#glow-green)" class="flow-particle">
                <animateMotion id="anim-sub-hosp-2" dur="4s" begin="2s" repeatCount="indefinite" path="M 400 240 Q 510 310 620 380"/>
              </circle>
            </g>
          </g>

          <!-- Group for Nodes -->
          <g id="map-nodes">
            
            <!-- GATEWAY / INTERNET NODE (Hacker source representation) -->
            <g id="node-threat" class="map-node opacity-30 transition-opacity duration-700" transform="translate(70, 80)">
              <g class="node-pulse-wrapper">
                <!-- Advanced Tech Rings -->
                <circle r="30" fill="none" stroke="#ef4444" stroke-width="1" stroke-dasharray="2, 4" class="node-ring-cw" opacity="0.4"/>
                <circle r="22" fill="#050505" stroke="#ef4444" stroke-width="1.5" filter="url(#glow-red)" class="node-core"/>
                <circle r="26" fill="none" stroke="#ef4444" stroke-width="1" stroke-dasharray="2, 6"/>
                <!-- Icon -->
                ${iconThreat}
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-threat" class="target-reticle hidden">
                <path d="M -34 -34 L -24 -34 M -34 -34 L -34 -24" stroke="#ef4444" stroke-width="2" fill="none"/>
                <path d="M 34 -34 L 24 -34 M 34 -34 L 34 -24" stroke="#ef4444" stroke-width="2" fill="none"/>
                <path d="M -34 34 L -24 34 M -34 34 L -34 24" stroke="#ef4444" stroke-width="2" fill="none"/>
                <path d="M 34 34 L 24 34 M 34 34 L 34 24" stroke="#ef4444" stroke-width="2" fill="none"/>
                <text y="-40" font-family="monospace" font-size="8" fill="#ef4444" text-anchor="middle" font-weight="bold" letter-spacing="1">ATTACK_SOURCE</text>
              </g>
              <text y="48" font-family="monospace" font-size="11" fill="#ef4444" text-anchor="middle" font-weight="bold">EXT_GATEWAY</text>
              <text y="60" font-family="monospace" font-size="8" fill="#737373" text-anchor="middle">WAN (185.220.101.4)</text>
            </g>

            <!-- NODE A: CORP HQ -->
            <g id="node-hq" class="map-node" transform="translate(150, 140)">
              <!-- Automated Radar Sweep ring for HQ scanning -->
              <circle id="radar-sweep-line" r="28" fill="none" stroke="#10b981" stroke-width="1" filter="url(#glow-green)" opacity="0"/>
              
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="34" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4, 4" class="node-ring-cw" opacity="0.35"/>
                <circle r="24" fill="#050505" stroke="currentColor" stroke-width="1.8" class="node-core" filter="url(#glow-green)"/>
                <circle r="29" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
                <!-- Icon -->
                ${iconHq}
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-hq" class="target-reticle hidden">
                <path d="M -38 -38 L -28 -38 M -38 -38 L -38 -28" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 38 -38 L 28 -38 M 38 -38 L 38 -28" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M -38 38 L -28 38 M -38 38 L -38 28" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 38 38 L 28 38 M 38 38 L 38 28" stroke="currentColor" stroke-width="2" fill="none"/>
                <text y="-46" font-family="monospace" font-size="8" fill="currentColor" text-anchor="middle" font-weight="bold" letter-spacing="1">TARGET_LOCKED</text>
              </g>
              <text y="50" font-family="monospace" font-size="11" fill="#f5f5f5" text-anchor="middle" font-weight="bold">${nodeHqText}</text>
              <text y="62" font-family="monospace" font-size="9" fill="#10b981" text-anchor="middle">${nodeHqIp}</text>
            </g>

            <!-- NODE B: SUBSTATION ALPHA / CENTRAL AD -->
            <g id="node-sub" class="map-node" transform="translate(400, 240)">
              <g class="node-pulse-wrapper node-pulse-green">
                <!-- Tech hexagon shroud -->
                <polygon points="0,-40 34.64,-20 34.64,20 0,40 -34.64,20 -34.64,-20" fill="none" stroke="currentColor" stroke-width="1" class="node-ring-ccw" opacity="0.3"/>
                <circle r="26" fill="#050505" stroke="currentColor" stroke-width="2" class="node-core" filter="url(#glow-green)"/>
                <circle r="31" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3, 1" opacity="0.4"/>
                <!-- Shield Honeypot Overlay -->
                <polygon id="shield-sub" points="0,-45 38.97,-22.5 38.97,22.5 0,45 -38.97,22.5 -38.97,-22.5" fill="url(#shield-hex-pattern)" stroke="#3b82f6" stroke-width="1.8" class="hidden transition-all filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"/>
                <!-- Icon -->
                ${iconSub}
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-sub" class="target-reticle hidden">
                <path d="M -44 -44 L -34 -44 M -44 -44 L -44 -34" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 44 -44 L 34 -44 M 44 -44 L 44 -34" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M -44 44 L -34 44 M -44 44 L -44 34" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 44 44 L 34 44 M 44 44 L 44 34" stroke="currentColor" stroke-width="2" fill="none"/>
                <text y="-52" font-family="monospace" font-size="8" fill="currentColor" text-anchor="middle" font-weight="bold" letter-spacing="1">BREACH_DETECTED</text>
              </g>
              <text y="54" font-family="monospace" font-size="11" fill="#f5f5f5" text-anchor="middle" font-weight="bold">${nodeSubText}</text>
              <text y="66" font-family="monospace" font-size="9" fill="#10b981" text-anchor="middle">${nodeSubIp}</text>
            </g>

            <!-- NODE C: RESIDENTIAL DISTRICT / WORKSTATION LAN -->
            <g id="node-res" class="map-node" transform="translate(200, 380)">
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="32" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="1, 4" class="node-ring-cw" opacity="0.4"/>
                <circle r="22" fill="#050505" stroke="currentColor" stroke-width="1.8" class="node-core" filter="url(#glow-green)"/>
                <circle r="27" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
                <!-- Shield Honeypot Overlay -->
                <polygon id="shield-res" points="0,-36 31.18,-18 31.18,18 0,36 -31.18,18 -31.18,-18" fill="url(#shield-hex-pattern)" stroke="#3b82f6" stroke-width="1.8" class="hidden transition-all filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"/>
                <!-- Icon -->
                ${iconRes}
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-res" class="target-reticle hidden">
                <path d="M -36 -36 L -26 -36 M -36 -36 L -36 -26" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 36 -36 L 26 -36 M 36 -36 L 36 -26" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M -36 36 L -26 36 M -36 36 L -36 26" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 36 36 L 26 36 M 36 36 L 36 26" stroke="currentColor" stroke-width="2" fill="none"/>
                <text y="-44" font-family="monospace" font-size="8" fill="currentColor" text-anchor="middle" font-weight="bold" letter-spacing="1">HOST_COMPROMISED</text>
              </g>
              <text y="48" font-family="monospace" font-size="11" fill="#f5f5f5" text-anchor="middle" font-weight="bold">${nodeResText}</text>
              <text y="60" font-family="monospace" font-size="9" fill="#10b981" text-anchor="middle">${nodeResIp}</text>
            </g>

            <!-- NODE D: TRANSPORT HUB / FINANCE SERVERS -->
            <g id="node-tran" class="map-node" transform="translate(600, 140)">
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="32" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="6, 2" class="node-ring-ccw" opacity="0.35"/>
                <circle r="22" fill="#050505" stroke="currentColor" stroke-width="1.8" class="node-core" filter="url(#glow-green)"/>
                <circle r="27" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
                <!-- Shield Honeypot Overlay -->
                <polygon id="shield-tran" points="0,-36 31.18,-18 31.18,18 0,36 -31.18,18 -31.18,-18" fill="url(#shield-hex-pattern)" stroke="#3b82f6" stroke-width="1.8" class="hidden transition-all filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"/>
                <!-- Icon -->
                ${iconTran}
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-tran" class="target-reticle hidden">
                <path d="M -36 -36 L -26 -36 M -36 -36 L -36 -26" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 36 -36 L 26 -36 M 36 -36 L 36 -26" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M -36 36 L -26 36 M -36 36 L -36 26" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 36 36 L 26 36 M 36 36 L 36 26" stroke="currentColor" stroke-width="2" fill="none"/>
                <text y="-44" font-family="monospace" font-size="8" fill="currentColor" text-anchor="middle" font-weight="bold" letter-spacing="1">INTEGRITY_VIOLATION</text>
              </g>
              <text y="48" font-family="monospace" font-size="11" fill="#f5f5f5" text-anchor="middle" font-weight="bold">${nodeTranText}</text>
              <text y="60" font-family="monospace" font-size="9" fill="#10b981" text-anchor="middle">${nodeTranIp}</text>
            </g>

            <!-- NODE E: HOSPITAL ER / EMAIL GATEWAY -->
            <g id="node-hosp" class="map-node" transform="translate(620, 380)">
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="34" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="10, 4" class="node-ring-cw" opacity="0.35"/>
                <circle r="24" fill="#050505" stroke="currentColor" stroke-width="1.8" class="node-core" filter="url(#glow-green)"/>
                <circle r="29" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
                <!-- Shield Honeypot Overlay -->
                <polygon id="shield-hosp" points="0,-38 32.91,-19 32.91,19 0,38 -32.91,19 -32.91,-19" fill="url(#shield-hex-pattern)" stroke="#3b82f6" stroke-width="1.8" class="hidden transition-all filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"/>
                <!-- Icon -->
                ${iconHosp}
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-hosp" class="target-reticle hidden">
                <path d="M -38 -38 L -28 -38 M -38 -38 L -38 -28" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 38 -38 L 28 -38 M 38 -38 L 38 -28" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M -38 38 L -28 38 M -38 38 L -38 28" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M 38 38 L 28 38 M 38 38 L 38 28" stroke="currentColor" stroke-width="2" fill="none"/>
                <text y="-46" font-family="monospace" font-size="8" fill="currentColor" text-anchor="middle" font-weight="bold" letter-spacing="1">SYSTEM_ENCRYPTED</text>
              </g>
              <text y="50" font-family="monospace" font-size="11" fill="#f5f5f5" text-anchor="middle" font-weight="bold">${nodeHospText}</text>
              <text y="62" font-family="monospace" font-size="9" fill="#10b981" text-anchor="middle">${nodeHospIp}</text>
            </g>

          </g>
        </svg>
        
        <!-- Live Map Info overlay tooltip panel -->
        <div id="map-info-box" class="absolute bottom-6 left-6 max-w-xs bg-neutral-950/95 border border-neutral-800 p-3 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] font-mono text-[10px] hidden leading-normal z-20">
          <div id="map-tooltip-title" class="font-bold mb-1 text-green-500">Node Tooltip</div>
          <div id="map-tooltip-desc" class="text-neutral-400">Node Description text dynamically loaded.</div>
        </div>
      </div>
    `;
  }

  setupNodesTooltip() {
    let nodeMap = {};
    if (this.currentScenario === 0) {
      nodeMap = {
        "node-threat": { title: "External Threat Gateway", desc: "Unrecognized WAN entry point routing suspicious traffic via Tor Exit node pathways." },
        "node-hq": { title: "Corporate Headquarters (VLAN 10)", desc: "Primary administrative networks. Houses corporate email servers and active directory VPN portals." },
        "node-sub": { title: "Domain Controller (VLAN 20)", desc: "Primary Domain Controller server. Manages Active Directory accounts and handles NTDS databases." },
        "node-res": { title: "Workstation LAN (VLAN 30)", desc: "Internal corporate workstation networks. Highly dependent on central AD group policy controls." },
        "node-tran": { title: "Finance Servers (VLAN 40)", desc: "Internal accounting database hosts managing transaction ledgers and financial documents." },
        "node-hosp": { title: "Email Gateway (VLAN 50)", desc: "Corporate mail security exchange and external SMTP relay server." }
      };
    } else if (this.currentScenario === 1) {
      nodeMap = {
        "node-threat": { title: "Threat Gateway (WAN)", desc: "Malicious command routing node intercepting public API traffic." },
        "node-hq": { title: "API Gateway (VLAN 10)", desc: "Primary ingress interface routing public API request queries to local cloud subnets." },
        "node-sub": { title: "Cloud Database (VLAN 20)", desc: "Master MySQL database storing customer tables and administrative hashes." },
        "node-res": { title: "Web Portal (VLAN 10)", desc: "Front-end server presenting e-commerce storefront. Handles dynamic database queries." },
        "node-tran": { title: "Payment Service (VLAN 30)", desc: "Payment verification module. Validates processing records against the database." },
        "node-hosp": { title: "Search Index Microservice", desc: "Edge server caching queries and product indexes for local web portals." }
      };
    } else {
      nodeMap = {
        "node-threat": { title: "Phishing Entry Vector (SMTP)", desc: "Compromised external server relaying email links containing malicious payloads." },
        "node-hq": { title: "Corporate Mail Server (OWA)", desc: "Outlook Web Access portal hosting central employee mailboxes and inbox rules." },
        "node-sub": { title: "Executive Workstation (VLAN 20)", desc: "CFO admin console workstation. Targeted for session token theft and credential dumping." },
        "node-res": { title: "HR Portal (VLAN 10)", desc: "Personnel records database. Linked to active directory authentication controls." },
        "node-tran": { title: "Accounting PC (VLAN 30)", desc: "Accounts payable workstation. Responsible for outbound billing transactions." },
        "node-hosp": { title: "Backup Server (VLAN 40)", desc: "Local corporate backup storage repository saving weekly offline file copies." }
      };
    }

    Object.keys(nodeMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("mouseenter", (e) => {
          const tooltip = document.getElementById("map-info-box");
          const title = document.getElementById("map-tooltip-title");
          const desc = document.getElementById("map-tooltip-desc");
          if (tooltip && title && desc) {
            title.textContent = nodeMap[id].title;
            
            let isNodeCritical = false;
            if (this.currentPhase === 2) {
              if (this.currentScenario === 0 && (id === 'node-sub' || id === 'node-res' || id === 'node-tran')) isNodeCritical = true;
              if (this.currentScenario === 1 && id === 'node-tran') isNodeCritical = true;
              if (this.currentScenario === 2 && id === 'node-hosp') isNodeCritical = true;
            }
            title.className = `font-bold mb-1 ${
              id === 'node-threat' ? 'text-red-500' : 
              isNodeCritical ? 'text-red-500' :
              this.currentPhase === 1 && id === 'node-hq' ? 'text-amber-500' : 'text-green-500'
            }`;
            desc.textContent = nodeMap[id].desc;
            tooltip.classList.remove("hidden");
          }
        });

        el.addEventListener("mouseleave", () => {
          const tooltip = document.getElementById("map-info-box");
          if (tooltip) tooltip.classList.add("hidden");
        });
      }
    });
  }

  /**
   * Main phase update entry point
   */
  triggerPhase(phase, scenarioId = 0, optionIndex = 0) {
    if (this.currentScenario !== scenarioId) {
      this.currentScenario = scenarioId;
      this.container.innerHTML = this.renderSVG(scenarioId);
      this.setupNodesTooltip();
    }
    this.currentPhase = phase;
    this.currentOptionIndex = optionIndex;

    const nodeThreat = document.getElementById("node-threat");
    const nodeHq = document.getElementById("node-hq");
    const nodeSub = document.getElementById("node-sub");
    const nodeRes = document.getElementById("node-res");
    const nodeTran = document.getElementById("node-tran");
    const nodeHosp = document.getElementById("node-hosp");

    const setNodeState = (node, statusClass) => {
      if (!node) return;
      const wrapper = node.querySelector(".node-pulse-wrapper");
      const core = node.querySelector(".node-core");
      if (wrapper) {
        wrapper.classList.remove("node-pulse-green", "node-pulse-amber", "node-pulse-red", "node-pulse-blue");
        wrapper.classList.add(statusClass);
      }
      
      // Update core glow dynamic filters
      if (core) {
        let filterVal = "none";
        if (statusClass === "node-pulse-green") filterVal = "url(#glow-green)";
        else if (statusClass === "node-pulse-amber") filterVal = "url(#glow-amber)";
        else if (statusClass === "node-pulse-red") filterVal = "url(#glow-red)";
        else if (statusClass === "node-pulse-blue") filterVal = "url(#glow-blue)";
        core.setAttribute("filter", filterVal);
      }
    };

    // Default cleanup for reset/phase-switches
    const allNodeIds = ['threat', 'hq', 'sub', 'res', 'tran', 'hosp'];
    allNodeIds.forEach(id => {
      this.toggleTargetReticle(id, false);
      this.toggleShield(id, false);
    });

    if (nodeSub) nodeSub.style.color = ""; 
    if (nodeTran) nodeTran.style.color = ""; 
    if (nodeHosp) nodeHosp.style.color = ""; 

    // Update dynamic HUD overlays
    this.updateHUDOverlay(phase, scenarioId);

    // Handle states depending on scenario
    if (scenarioId === 0) {
      // --- Scenario 0: Active Directory Domain Ransomware ---
      switch(phase) {
        case 0: // Baseline
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateRadarSweep("#10b981");

          this.updatePathState("threat", "#262626", "data-flow-stopped", 2, 0);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-res", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#10b981", "data-flow-slow", 2, 0.15);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeSub, "node-pulse-green");
          setNodeState(nodeRes, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");

          this.updateSubText(nodeHq, "192.168.10.10 (VPN)");
          this.updateSubText(nodeSub, "VLAN_20 (AD)");
          this.updateSubText(nodeRes, "VLAN_30 (ACTIVE)");
          this.updateSubText(nodeTran, "VLAN_40 (ACTIVE)");
          this.updateSubText(nodeHosp, "VLAN_50 (ACTIVE)");
          
          this.updateNodeOpacity(nodeRes, 1);
          this.updateNodeOpacity(nodeTran, 1);
          break;

        case 1: // Recon
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updateRadarSweep("#f59e0b");
          this.toggleTargetReticle("hq", true);

          this.updatePathState("threat", "#f59e0b", "data-flow-fast", 2.5, 0.25);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-res", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#10b981", "data-flow-slow", 2, 0.15);

          this.setPathParticles("threat", "#f59e0b", 1.5, true);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-amber");
          this.updateSubText(nodeHq, "BRUTE_FORCE_SCAN");
          break;

        case 2: // Exploit
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updateRadarSweep("#ef4444");
          
          this.toggleTargetReticle("sub", true);
          this.toggleTargetReticle("res", true);
          this.toggleTargetReticle("tran", true);

          this.updatePathState("threat", "#ef4444", "data-flow-fast", 3, 0.35);
          this.updatePathState("hq-sub", "#ef4444", "data-flow-fast", 3.5, 0.35);
          this.updatePathState("sub-res", "#262626", "data-flow-stopped", 1.5, 0);
          this.updatePathState("sub-tran", "#262626", "data-flow-stopped", 1.5, 0);
          this.updatePathState("sub-hosp", "#f59e0b", "data-flow-slow", 1.5, 0.2);

          this.setPathParticles("threat", "#ef4444", 0.8, true);
          this.setPathParticles("hq-sub", "#ef4444", 0.8, true);
          this.setPathParticles("sub-res", "#262626", 4, false);
          this.setPathParticles("sub-tran", "#262626", 4, false);
          this.setPathParticles("sub-hosp", "#f59e0b", 4, true);

          setNodeState(nodeHq, "node-pulse-red");
          setNodeState(nodeSub, "node-pulse-red");
          this.updateSubText(nodeSub, "NTDS_COMPROMISED [FAIL]");

          setNodeState(nodeRes, "node-pulse-red");
          this.updateSubText(nodeRes, "DOMAIN LOCKED [FAIL]");
          this.updateNodeOpacity(nodeRes, 0.35);

          setNodeState(nodeTran, "node-pulse-red");
          this.updateSubText(nodeTran, "SUBNET ENCRYPTED [FAIL]");
          this.updateNodeOpacity(nodeTran, 0.35);

          setNodeState(nodeHosp, "node-pulse-amber");
          this.updateSubText(nodeHosp, "ISOLATED BACKUPS");
          break;

        case 3: // Mitigate
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-30 transition-opacity duration-700");
          this.updateRadarSweep("#3b82f6");
          
          this.toggleShield("sub", true);

          this.updatePathState("threat", "#262626", "data-flow-stopped", 1, 0);
          this.updatePathState("hq-sub", "#3b82f6", "data-flow-stopped", 2, 0.25);
          this.updatePathState("sub-res", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#10b981", "data-flow-slow", 2, 0.15);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#3b82f6", 3, false);
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-green");
          this.updateSubText(nodeHq, "CREDENTIALS_REVOKED");

          setNodeState(nodeSub, "node-pulse-blue");
          this.updateSubText(nodeSub, "AD_RESTORED (OK)");

          setNodeState(nodeRes, "node-pulse-green");
          this.updateSubText(nodeRes, "DOMAIN LOGINS ACTIVE");
          this.updateNodeOpacity(nodeRes, 1);

          setNodeState(nodeTran, "node-pulse-green");
          this.updateSubText(nodeTran, "SERVICES RESTORED (OK)");
          this.updateNodeOpacity(nodeTran, 1);

          setNodeState(nodeHosp, "node-pulse-green");
          this.updateSubText(nodeHosp, "EMAIL GATEWAY ACTIVE");
          break;

        case 4: // Reset
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateRadarSweep("#10b981");

          this.updatePathState("threat", "#262626", "data-flow-stopped", 2, 0);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-res", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#10b981", "data-flow-slow", 2, 0.15);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeSub, "node-pulse-green");
          setNodeState(nodeRes, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");

          this.updateSubText(nodeHq, "192.168.10.10 (VPN)");
          this.updateSubText(nodeSub, "VLAN_20 (AD)");
          this.updateSubText(nodeRes, "VLAN_30 (ACTIVE)");
          this.updateSubText(nodeTran, "VLAN_40 (ACTIVE)");
          this.updateSubText(nodeHosp, "VLAN_50 (ACTIVE)");
          
          this.updateNodeOpacity(nodeRes, 1);
          this.updateNodeOpacity(nodeTran, 1);
          break;
      }
    } else if (scenarioId === 1) {
      // --- Scenario 1: Cloud E-Commerce Database Exfiltration ---
      switch(phase) {
        case 0: // Baseline
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateRadarSweep("#10b981");

          this.updatePathState("threat", "#262626", "data-flow-stopped", 2, 0);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-res", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#10b981", "data-flow-slow", 2, 0.15);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeSub, "node-pulse-green");
          setNodeState(nodeRes, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");

          this.updateSubText(nodeHq, "10.0.1.10 (API)");
          this.updateSubText(nodeSub, "VLAN_20 (SQL_DB)");
          this.updateSubText(nodeRes, "VLAN_10 (PORTAL_OK)");
          this.updateSubText(nodeTran, "VLAN_30 (PAY_ACTIVE)");
          this.updateSubText(nodeHosp, "VLAN_40 (INDEX_OK)");
          break;

        case 1: // Recon
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updateRadarSweep("#f59e0b");
          
          this.toggleTargetReticle("hq", true);
          this.toggleTargetReticle("tran", true);

          this.updatePathState("threat", "#f59e0b", "data-flow-fast", 2.5, 0.25);
          this.setPathParticles("threat", "#f59e0b", 1.5, true);

          setNodeState(nodeHq, "node-pulse-amber");
          setNodeState(nodeTran, "node-pulse-amber");
          
          this.updateSubText(nodeHq, "API_VULN_SCAN");
          this.updateSubText(nodeTran, "PORT_SCAN_ACTIVE");
          break;

        case 2: // Exploit
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updateRadarSweep("#ef4444");
          
          this.toggleTargetReticle("tran", true);

          this.updatePathState("threat", "#ef4444", "data-flow-fast", 3, 0.35);
          this.updatePathState("hq-sub", "#ef4444", "data-flow-fast", 3.5, 0.35);
          this.updatePathState("sub-tran", "#ef4444", "data-flow-fast", 3.5, 0.35);
          
          this.setPathParticles("threat", "#ef4444", 0.8, true);
          this.setPathParticles("hq-sub", "#ef4444", 0.8, true);
          this.setPathParticles("sub-tran", "#ef4444", 0.8, true);

          setNodeState(nodeHq, "node-pulse-red");
          setNodeState(nodeTran, "node-pulse-red");
          
          this.updateSubText(nodeHq, "SQL_INJECTION_CONNECTED");
          this.updateSubText(nodeTran, "DATABASE EXFILTRATION [FAIL]");
          break;

        case 3: // Mitigate
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-30 transition-opacity duration-700");
          this.updateRadarSweep("#3b82f6");
          
          this.toggleShield("tran", true);

          this.updatePathState("threat", "#262626", "data-flow-stopped", 1, 0);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#3b82f6", "data-flow-stopped", 2, 0.25);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#3b82f6", 3, false);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-blue");
          
          this.updateSubText(nodeHq, "IP_BLOCKED_BY_WAF");
          this.updateSubText(nodeTran, "DB_ACCESS_RESTORED (OK)");
          break;

        case 4: // Reset
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateRadarSweep("#10b981");

          this.updatePathState("threat", "#262626", "data-flow-stopped", 2, 0);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-res", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#10b981", "data-flow-slow", 2, 0.15);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeSub, "node-pulse-green");
          setNodeState(nodeRes, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");

          this.updateSubText(nodeHq, "10.0.1.10 (API)");
          this.updateSubText(nodeTran, "VLAN_30 (PAY_ACTIVE)");
          break;
      }
    } else if (scenarioId === 2) {
      // --- Scenario 2: Corporate BEC Financial Fraud Campaign ---
      switch(phase) {
        case 0: // Baseline
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateRadarSweep("#10b981");

          this.updatePathState("threat", "#262626", "data-flow-stopped", 2, 0);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-res", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#10b981", "data-flow-slow", 2, 0.15);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeSub, "node-pulse-green");
          setNodeState(nodeRes, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");

          this.updateSubText(nodeHq, "172.16.5.10 (OWA)");
          this.updateSubText(nodeSub, "VLAN_20 (EXEC_PC)");
          this.updateSubText(nodeRes, "VLAN_10 (HR_PORTAL)");
          this.updateSubText(nodeTran, "VLAN_30 (ACCT_PC)");
          this.updateSubText(nodeHosp, "VLAN_40 (BACKUPS)");
          break;

        case 1: // Recon
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updateRadarSweep("#f59e0b");
          
          this.toggleTargetReticle("hq", true);
          this.toggleTargetReticle("hosp", true);

          this.updatePathState("threat", "#f59e0b", "data-flow-fast", 2.5, 0.25);
          this.setPathParticles("threat", "#f59e0b", 1.5, true);

          setNodeState(nodeHq, "node-pulse-amber");
          setNodeState(nodeHosp, "node-pulse-amber");
          
          this.updateSubText(nodeHq, "PHISHING_PAYLOAD_SMTP");
          this.updateSubText(nodeHosp, "WORKSTATION_EXPLOIT_SCAN");
          break;

        case 2: // Exploit
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updateRadarSweep("#ef4444");
          
          this.toggleTargetReticle("hosp", true);

          this.updatePathState("threat", "#ef4444", "data-flow-fast", 3, 0.35);
          this.updatePathState("hq-sub", "#ef4444", "data-flow-fast", 3.5, 0.35);
          this.updatePathState("sub-hosp", "#ef4444", "data-flow-fast", 3.5, 0.35);

          this.setPathParticles("threat", "#ef4444", 0.8, true);
          this.setPathParticles("hq-sub", "#ef4444", 0.8, true);
          this.setPathParticles("sub-hosp", "#ef4444", 0.8, true);

          setNodeState(nodeHq, "node-pulse-red");
          setNodeState(nodeHosp, "node-pulse-red");
          
          this.updateSubText(nodeHq, "SESSION_HIJACKED");
          this.updateSubText(nodeHosp, "FRAUD_INVOICE_SENT [FAIL]");
          break;

        case 3: // Mitigate
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-30 transition-opacity duration-700");
          this.updateRadarSweep("#3b82f6");
          
          this.toggleShield("hosp", true);

          this.updatePathState("threat", "#262626", "data-flow-stopped", 1, 0);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#3b82f6", "data-flow-stopped", 2, 0.25);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#3b82f6", 3, false);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-blue");
          
          this.updateSubText(nodeHq, "SESSION_INVALIDATED");
          this.updateSubText(nodeHosp, "RECOVERY RUNNING (OK)");
          break;

        case 4: // Reset
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateRadarSweep("#10b981");

          this.updatePathState("threat", "#262626", "data-flow-stopped", 2, 0);
          this.updatePathState("hq-sub", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-res", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-tran", "#10b981", "data-flow-slow", 2, 0.15);
          this.updatePathState("sub-hosp", "#10b981", "data-flow-slow", 2, 0.15);

          this.setPathParticles("threat", "#ef4444", 2, false);
          this.setPathParticles("hq-sub", "#10b981", 4, true);
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeSub, "node-pulse-green");
          setNodeState(nodeRes, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");

          this.updateSubText(nodeHq, "172.16.5.10 (OWA)");
          this.updateSubText(nodeHosp, "VLAN_40 (BACKUPS)");
          break;
      }
    }
  }

  updatePathState(id, strokeColor, flowClass, strokeWidth, glowOpacity = 0.15) {
    const path = document.getElementById(`path-${id}`);
    const glow = document.getElementById(`path-${id}-glow`);
    
    if (path) {
      path.setAttribute("class", "data-flow-path " + flowClass);
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", strokeWidth);
    }
    
    if (glow) {
      glow.setAttribute("stroke", strokeColor);
      glow.style.opacity = glowOpacity;
      
      let filterVal = "none";
      if (strokeColor === "#ef4444") filterVal = "url(#glow-red)";
      else if (strokeColor === "#f59e0b") filterVal = "url(#glow-amber)";
      else if (strokeColor === "#3b82f6") filterVal = "url(#glow-blue)";
      else if (strokeColor === "#10b981") filterVal = "url(#glow-green)";
      
      glow.setAttribute("filter", filterVal);
    }
  }

  setPathParticles(id, color, speedSec, active) {
    const group = document.getElementById(`particles-${id}`);
    if (!group) return;
    const circles = group.querySelectorAll("circle");
    circles.forEach((circle, index) => {
      if (!active) {
        circle.style.opacity = "0";
      } else {
        circle.style.opacity = "0.95";
        circle.setAttribute("fill", color);
        
        let filterVal = "none";
        if (color === "#ef4444") filterVal = "url(#glow-red)";
        else if (color === "#f59e0b") filterVal = "url(#glow-amber)";
        else if (color === "#3b82f6") filterVal = "url(#glow-blue)";
        else if (color === "#10b981") filterVal = "url(#glow-green)";
        circle.setAttribute("filter", filterVal);
        
        const anim = circle.querySelector("animateMotion");
        if (anim) {
          anim.setAttribute("dur", `${speedSec}s`);
          if (index === 1) {
            anim.setAttribute("begin", `${speedSec / 2}s`);
          }
          try {
            anim.beginElement();
          } catch(e) {}
        }
      }
    });
  }

  toggleTargetReticle(nodeId, show) {
    const reticle = document.getElementById(`reticle-${nodeId}`);
    if (reticle) {
      if (show) {
        reticle.classList.remove("hidden");
      } else {
        reticle.classList.add("hidden");
      }
    }
  }

  toggleShield(nodeId, show) {
    const shield = document.getElementById(`shield-${nodeId}`);
    if (shield) {
      if (show) {
        shield.classList.remove("hidden");
      } else {
        shield.classList.add("hidden");
      }
    }
  }

  updateRadarSweep(color) {
    const stopStart = document.getElementById("radar-stop-start");
    const stopEnd = document.getElementById("radar-stop-end");
    const sweepLine = document.getElementById("radar-sweep-line");
    
    if (stopStart && stopEnd) {
      stopStart.setAttribute("stop-color", color === "#262626" ? "rgba(0,0,0,0)" : color + "00");
      stopEnd.setAttribute("stop-color", color === "#262626" ? "rgba(0,0,0,0)" : color + "30");
    }
    
    if (sweepLine) {
      sweepLine.setAttribute("stroke", color);
      let filterVal = "none";
      if (color === "#ef4444") filterVal = "url(#glow-red)";
      else if (color === "#f59e0b") filterVal = "url(#glow-amber)";
      else if (color === "#3b82f6") filterVal = "url(#glow-blue)";
      else if (color === "#10b981") filterVal = "url(#glow-green)";
      sweepLine.setAttribute("filter", filterVal);
    }
  }

  updateHUDOverlay(phase, scenarioId) {
    const integrityText = document.getElementById("hud-svg-integrity");
    const freqText = document.getElementById("hud-svg-frequency");
    const dot = document.getElementById("hud-svg-dot");

    let integrity = "100%";
    let latency = "5 ms";
    let statusColor = "#10b981"; // green

    if (phase === 0) {
      integrity = "100%";
      latency = "5 ms";
      statusColor = "#10b981";
    } else if (phase === 1) {
      integrity = "98%";
      latency = "12 ms";
      statusColor = "#f59e0b"; // amber
    } else if (phase === 2) {
      statusColor = "#ef4444"; // red
      if (scenarioId === 0) {
        integrity = "24%";
        latency = "1500 ms";
      } else if (scenarioId === 1) {
        integrity = "62%";
        latency = "850 ms";
      } else {
        integrity = "15%";
        latency = "120 ms";
      }
    } else if (phase === 3) {
      integrity = "85%";
      latency = "8 ms";
      statusColor = "#3b82f6"; // blue
    } else if (phase === 4) {
      integrity = "100%";
      latency = "5 ms";
      statusColor = "#10b981";
    }

    if (integrityText) {
      integrityText.textContent = `SYS_INTEGRITY: ${integrity}`;
      integrityText.setAttribute("fill", statusColor);
    }
    if (freqText) {
      freqText.textContent = `NET_LATENCY: ${latency}`;
      freqText.setAttribute("fill", statusColor);
    }
    if (dot) {
      dot.setAttribute("fill", statusColor);
    }
  }

  updateSubText(nodeGroup, text) {
    if (!nodeGroup) return;
    const textEls = nodeGroup.getElementsByTagName("text");
    if (textEls.length > 1) {
      textEls[1].textContent = text;
      // Change color based on status
      if (text.includes("FAIL") || text.includes("BLACKOUT") || text.includes("LOCK") || text.includes("TAMPERED") || text.includes("COMPROMISED") || text.includes("SCAN") || text.includes("ENCRYPTED")) {
        textEls[1].setAttribute("fill", "#ef4444");
      } else if (text.includes("RESTORED") || text.includes("ONLINE") || text.includes("POWERED") || text.includes("ACTIVE") || text.includes("OK") || text.includes("REVOKED") || text.includes("INVALIDATED")) {
        textEls[1].setAttribute("fill", "#10b981");
      } else if (text.includes("EMERGENCY") || text.includes("GENERATOR") || text.includes("RUNNING") || text.includes("PIVOT") || text.includes("ISOLATED") || text.includes("PHISHING")) {
        textEls[1].setAttribute("fill", "#f59e0b");
      } else {
        textEls[1].setAttribute("fill", "#a3a3a3");
      }
    }
  }

  updateNodeOpacity(nodeGroup, opacity) {
    if (!nodeGroup) return;
    nodeGroup.setAttribute("opacity", opacity);
  }
}

// Global hook
window.CityMap = CityMap;
