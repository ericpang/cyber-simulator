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
    let headerText = "MAP VIEWPORT: CITY-GRID-TOPOLOGY v2.40";
    let nodeHqText = "CORP_HQ";
    let nodeHqIp = "192.168.42.10";
    let nodeSubText = "SUBSTATION_ALPHA";
    let nodeSubIp = "192.168.42.50";
    let nodeResText = "MUNI_GRID_WEST";
    let nodeResIp = "VLAN_102 (POWERED)";
    let nodeTranText = "TRANSIT_HUB";
    let nodeTranIp = "VLAN_108 (ACTIVE)";
    let nodeHospText = "HOSPITAL_ER";
    let nodeHospIp = "VLAN_110 (CRITICAL)";
    
    let iconHq = `<path d="M-10 14 L-10 -12 L0 -18 L10 -12 L10 14 Z M-4 6 L-4 0 L4 0 L4 6 Z M-4 -6 L-4 -8 L4 -8 L4 -6 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    let iconSub = `<polygon points="4,-16 -12,2 2,2 -4,16 12,-2 -2,-2" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>`;
    let iconRes = `<path d="M-12 12 L-12 -2 L0 -12 L12 -2 L12 12 Z M-6 12 L-6 4 L6 4 L6 12 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    let iconTran = `<path d="M-10 6 C-10 -10 10 -10 10 6 L10 12 L-10 12 Z M-6 -4 L6 -4 M-6 2 A2 2 0 0 1 -6 6 M6 2 A2 2 0 0 1 6 6" fill="none" stroke="currentColor" stroke-width="2"/>
                <line x1="-6" y1="12" x2="-10" y2="16" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="12" x2="10" y2="16" stroke="currentColor" stroke-width="2"/>`;
    let iconHosp = `<path d="M-4 12 L4 12 L4 4 L12 4 L12 -4 L4 -4 L4 -12 L-4 -12 L-4 -4 L-12 -4 L-12 4 L-4 4 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    let iconThreat = `<path d="M-8 -6 C-8 -12 8 -12 8 -6 C8 -2 6 2 4 4 L4 7 L-4 7 L-4 4 C-6 2 -8 -2 -8 -6 Z M-4 6 L4 6 M-3 -5 A1 1 0 0 1 -3 -3 M3 -5 A1 1 0 0 1 3 -3" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>`;

    if (scenarioId === 0) {
      headerText = "MAP VIEWPORT: SCADA POWER GRID GRID-TOPOLOGY v2.4";
      nodeHqText = "CORP_HQ";
      nodeHqIp = "192.168.42.10";
      nodeSubText = "SUBSTATION_ALPHA";
      nodeSubIp = "192.168.42.50";
      nodeResText = "GRID_WEST";
      nodeResIp = "VLAN_102 (POWERED)";
      nodeTranText = "GRID_EAST";
      nodeTranIp = "VLAN_108 (POWERED)";
      nodeHospText = "HOSPITAL_ER";
      nodeHospIp = "VLAN_110 (GRID_POWER)";
      
      // Transmission power pole icon for Grid East
      iconTran = `<path d="M-10 14 L-2 -14 L2 -14 L10 14 M-14 -6 L14 -6 M-11 4 L11 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    } else if (scenarioId === 1) {
      headerText = "MAP VIEWPORT: RAIL TRANSIT TOPOLOGY SCANNER v2.4";
      nodeHqText = "CENTRAL_CONTROL";
      nodeHqIp = "192.168.42.10 (API)";
      nodeSubText = "TRANSIT_HUB_SWITCH";
      nodeSubIp = "VLAN_42 (SIGNALS)";
      nodeResText = "STATION_WEST";
      nodeResIp = "VLAN_102 (SIGNALS_OK)";
      nodeTranText = "STATION_EAST";
      nodeTranIp = "VLAN_108 (SIGNALS_OK)";
      nodeHospText = "TERMINAL_SOUTH";
      nodeHospIp = "VLAN_110 (LOOP_OK)";
      
      // Server stack icon for HQ
      iconHq = `<rect x="-12" y="-12" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <rect x="-12" y="-3" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <rect x="-12" y="6" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <circle cx="-6" cy="-9" r="1" fill="currentColor"/>
                <circle cx="-6" cy="0" r="1" fill="currentColor"/>
                <circle cx="-6" cy="9" r="1" fill="currentColor"/>`;
      // All other station nodes are train front icons
      iconSub = `<path d="M-10 6 C-10 -10 10 -10 10 6 L10 12 L-10 12 Z M-6 -4 L6 -4 M-6 2 A2 2 0 0 1 -6 6 M6 2 A2 2 0 0 1 6 6" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <line x1="-6" y1="12" x2="-10" y2="16" stroke="currentColor" stroke-width="2.5"/>
                <line x1="6" y1="12" x2="10" y2="16" stroke="currentColor" stroke-width="2.5"/>`;
      iconRes = iconSub;
      iconTran = iconSub;
      iconHosp = iconSub;
    } else if (scenarioId === 2) {
      headerText = "MAP VIEWPORT: ENTERPRISE CLINICAL NETWORK v2.4";
      nodeHqText = "DOMAIN_CONTROLLER";
      nodeHqIp = "192.168.42.10 (AD)";
      nodeSubText = "EHR_DATABASE";
      nodeSubIp = "VLAN_42 (DATABASE)";
      nodeResText = "RECEPTION_PC";
      nodeResIp = "VLAN_102 (AD_JOINED)";
      nodeTranText = "PHARMACY_VLAN";
      nodeTranIp = "VLAN_108 (DISPENSARY)";
      nodeHospText = "ICU_MONITORS";
      nodeHospIp = "VLAN_110 (DB_ACTIVE)";
      
      // Phishing mail envelope with alert skull icon
      iconThreat = `<rect x="-12" y="-9" width="24" height="18" rx="2" fill="none" stroke="#ef4444" stroke-width="2"/>
                    <path d="M-12 -9 L0 1 L12 -9" fill="none" stroke="#ef4444" stroke-width="2"/>
                    <circle cx="0" cy="4" r="2.2" fill="#ef4444"/>`;
      // Server stack for Domain Controller
      iconHq = `<rect x="-12" y="-12" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <rect x="-12" y="-3" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <rect x="-12" y="6" width="24" height="6" fill="none" stroke="currentColor" stroke-width="1.8" rx="1"/>
                <circle cx="-6" cy="-9" r="1" fill="currentColor"/>
                <circle cx="-6" cy="0" r="1" fill="currentColor"/>
                <circle cx="-6" cy="9" r="1" fill="currentColor"/>`;
      // Database cylinders stack for Sub
      iconSub = `<path d="M-12 -9 C-12 -13 12 -13 12 -9 C12 -5 -12 -5 -12 -9 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                 <path d="M-12 -9 L-12 0 C-12 4 12 4 12 0 L12 -9" fill="none" stroke="currentColor" stroke-width="2"/>
                 <path d="M-12 0 L-12 9 C-12 13 12 13 12 9 L12 0" fill="none" stroke="currentColor" stroke-width="2"/>`;
      // Workstation PC screen for Res
      iconRes = `<rect x="-14" y="-10" width="28" height="17" fill="none" stroke="currentColor" stroke-width="2" rx="2"/>
                 <path d="M-5 7 L-9 13 L9 13 L5 7 Z" fill="none" stroke="currentColor" stroke-width="2"/>`;
      // Pharmacy Pills for Tran
      iconTran = `<rect x="-12" y="-4" width="24" height="8" rx="4" transform="rotate(-45)" fill="none" stroke="currentColor" stroke-width="2"/>
                  <circle cx="7" cy="-7" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      // ICU monitor heartbeat pulse for Hospital
      iconHosp = `<rect x="-14" y="-11" width="28" height="22" fill="none" stroke="currentColor" stroke-width="1.8" rx="2"/>
                  <path d="M-10 0 L-4 0 L-2 -8 L1 8 L3 -3 L5 0 L10 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
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
            <text x="12" y="45" font-size="10" fill="#10b981" font-weight="bold" id="hud-svg-frequency">GRID_FREQ: 60.00 Hz</text>
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
            </g>

            <!-- NODE A: Corporate HQ / Central Control / Domain Controller -->
            <g id="node-hq" class="map-node" transform="translate(150, 140)">
              <g class="node-pulse-wrapper node-pulse-green">
                <!-- Advanced Tech Rings -->
                <circle r="34" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4, 6" class="node-ring-cw" opacity="0.3"/>
                <circle r="38" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="16, 26" class="node-ring-ccw" opacity="0.5"/>
                <!-- Core background & border -->
                <circle r="26" fill="#040404" stroke="currentColor" stroke-width="2" class="node-core"/>
                <!-- Icon -->
                ${iconHq}
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-hq" class="target-reticle hidden">
                <path d="M -44 -44 L -32 -44 M -44 -44 L -44 -32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 44 -44 L 32 -44 M 44 -44 L 44 -32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M -44 44 L -32 44 M -44 44 L -44 32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 44 44 L 32 44 M 44 44 L 44 32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <text y="-52" font-family="monospace" font-size="9" fill="#ef4444" text-anchor="middle" font-weight="bold" letter-spacing="1.5" class="glow-text-red">TARGET_LOCKED</text>
              </g>
              <text y="52" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">${nodeHqText}</text>
              <text y="66" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">${nodeHqIp}</text>
            </g>

            <!-- NODE B: Substation Alpha / Transit Switch / EHR Database -->
            <g id="node-sub" class="map-node" transform="translate(400, 240)">
              <g class="node-pulse-wrapper node-pulse-green">
                <!-- Advanced Tech Rings -->
                <circle r="38" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6, 8" class="node-ring-cw" opacity="0.3"/>
                <circle r="42" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="24, 30" class="node-ring-ccw" opacity="0.5"/>
                <!-- Core background & border -->
                <circle r="30" fill="#040404" stroke="currentColor" stroke-width="2.5" class="node-core"/>
                <circle r="36" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3, 3"/>
                <!-- Icon -->
                ${iconSub}
              </g>
              <!-- Shielding Hex Dome Overlay -->
              <g id="shield-sub" class="hidden">
                <!-- Expanding ripple -->
                <circle r="50" fill="none" stroke="#3b82f6" stroke-width="1.5" class="shield-ring" opacity="0.8"/>
                <!-- Hex Shield Body -->
                <circle r="44" fill="url(#shield-hex-pattern)" stroke="#3b82f6" stroke-width="2.5" opacity="0.3" filter="url(#glow-blue)"/>
                <circle r="44" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="12, 6" class="node-ring-cw"/>
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-sub" class="target-reticle hidden">
                <path d="M -48 -48 L -36 -48 M -48 -48 L -48 -36" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 48 -48 L 36 -48 M 48 -48 L 48 -36" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M -48 48 L -36 48 M -48 48 L -48 36" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 48 48 L 36 48 M 48 48 L 48 36" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <text y="-56" font-family="monospace" font-size="9" fill="#ef4444" text-anchor="middle" font-weight="bold" letter-spacing="1.5" class="glow-text-red">TARGET_LOCKED</text>
              </g>
              <text y="58" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">${nodeSubText}</text>
              <text y="72" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">${nodeSubIp}</text>
            </g>

            <!-- NODE C: Grid West / Station West / Reception PC -->
            <g id="node-res" class="map-node" transform="translate(200, 380)">
              <g class="node-pulse-wrapper node-pulse-green">
                <!-- Advanced Tech Rings -->
                <circle r="34" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4, 6" class="node-ring-cw" opacity="0.3"/>
                <circle r="38" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="16, 26" class="node-ring-ccw" opacity="0.5"/>
                <!-- Core background & border -->
                <circle r="26" fill="#040404" stroke="currentColor" stroke-width="2" class="node-core"/>
                <!-- Icon -->
                ${iconRes}
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-res" class="target-reticle hidden">
                <path d="M -44 -44 L -32 -44 M -44 -44 L -44 -32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 44 -44 L 32 -44 M 44 -44 L 44 -32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M -44 44 L -32 44 M -44 44 L -44 32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 44 44 L 32 44 M 44 44 L 44 32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <text y="-52" font-family="monospace" font-size="9" fill="#ef4444" text-anchor="middle" font-weight="bold" letter-spacing="1.5" class="glow-text-red">SERVICE_INTERRUPTED</text>
              </g>
              <text y="52" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">${nodeResText}</text>
              <text y="66" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">${nodeResIp}</text>
            </g>

            <!-- NODE D: Grid East / Station East / Pharmacy VLAN -->
            <g id="node-tran" class="map-node" transform="translate(600, 140)">
              <g class="node-pulse-wrapper node-pulse-green">
                <!-- Advanced Tech Rings -->
                <circle r="34" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4, 6" class="node-ring-cw" opacity="0.3"/>
                <circle r="38" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="16, 26" class="node-ring-ccw" opacity="0.5"/>
                <!-- Core background & border -->
                <circle r="26" fill="#040404" stroke="currentColor" stroke-width="2" class="node-core"/>
                <!-- Icon -->
                ${iconTran}
              </g>
              <!-- Shielding Hex Dome Overlay -->
              <g id="shield-tran" class="hidden">
                <!-- Expanding ripple -->
                <circle r="46" fill="none" stroke="#3b82f6" stroke-width="1.5" class="shield-ring" opacity="0.8"/>
                <!-- Hex Shield Body -->
                <circle r="42" fill="url(#shield-hex-pattern)" stroke="#3b82f6" stroke-width="2" opacity="0.3" filter="url(#glow-blue)"/>
                <circle r="42" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="12, 6" class="node-ring-cw"/>
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-tran" class="target-reticle hidden">
                <path d="M -44 -44 L -32 -44 M -44 -44 L -44 -32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 44 -44 L 32 -44 M 44 -44 L 44 -32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M -44 44 L -32 44 M -44 44 L -44 32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 44 44 L 32 44 M 44 44 L 44 32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <text y="-52" font-family="monospace" font-size="9" fill="#ef4444" text-anchor="middle" font-weight="bold" letter-spacing="1.5" class="glow-text-red">TARGET_LOCKED</text>
              </g>
              <text y="52" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">${nodeTranText}</text>
              <text y="66" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">${nodeTranIp}</text>
            </g>

            <!-- NODE E: Hospital ER / Terminal South / ICU Monitors -->
            <g id="node-hosp" class="map-node" transform="translate(620, 380)">
              <g class="node-pulse-wrapper node-pulse-green">
                <!-- Advanced Tech Rings -->
                <circle r="34" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4, 6" class="node-ring-cw" opacity="0.3"/>
                <circle r="38" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="16, 26" class="node-ring-ccw" opacity="0.5"/>
                <!-- Core background & border -->
                <circle r="26" fill="#040404" stroke="currentColor" stroke-width="2" class="node-core"/>
                <!-- Icon -->
                ${iconHosp}
              </g>
              <!-- Shielding Hex Dome Overlay -->
              <g id="shield-hosp" class="hidden">
                <!-- Expanding ripple -->
                <circle r="46" fill="none" stroke="#3b82f6" stroke-width="1.5" class="shield-ring" opacity="0.8"/>
                <!-- Hex Shield Body -->
                <circle r="42" fill="url(#shield-hex-pattern)" stroke="#3b82f6" stroke-width="2" opacity="0.3" filter="url(#glow-blue)"/>
                <circle r="42" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="12, 6" class="node-ring-cw"/>
              </g>
              <!-- Lock-On Reticle -->
              <g id="reticle-hosp" class="target-reticle hidden">
                <path d="M -44 -44 L -32 -44 M -44 -44 L -44 -32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 44 -44 L 32 -44 M 44 -44 L 44 -32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M -44 44 L -32 44 M -44 44 L -44 32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <path d="M 44 44 L 32 44 M 44 44 L 44 32" stroke="#ef4444" stroke-width="2.5" fill="none"/>
                <text y="-52" font-family="monospace" font-size="9" fill="#ef4444" text-anchor="middle" font-weight="bold" letter-spacing="1.5" class="glow-text-red">TARGET_LOCKED</text>
              </g>
              <text y="52" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">${nodeHospText}</text>
              <text y="66" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">${nodeHospIp}</text>
            </g>
          </g>
        </svg>

        <!-- Dynamic Tooltip or Info Floating overlay -->
        <div id="map-info-box" class="absolute bottom-4 left-4 bg-neutral-950/90 border border-neutral-850 p-3 rounded font-mono text-xs max-w-xs backdrop-blur-md hidden shadow-2xl z-20">
          <div class="font-bold text-green-500 mb-1" id="map-tooltip-title">Node Title</div>
          <div class="text-neutral-400" id="map-tooltip-desc">Description about current status.</div>
        </div>
      </div>
    `;
  }

  setupNodesTooltip() {
    let nodeMap = {};
    if (this.currentScenario === 0) {
      nodeMap = {
        "node-threat": { title: "External Threat Gateway", desc: "Unrecognized WAN entry point routing suspicious traffic via Tor Exit node pathways." },
        "node-hq": { title: "Corporate Headquarters (VLAN 10)", desc: "Primary administrative networks. Houses corporate email servers and VPN portals connected to central grid controllers." },
        "node-sub": { title: "Substation Alpha (VLAN 42)", desc: "High-voltage distribution controller managing municipal energy routing. Operates Modbus TCP telemetry relays." },
        "node-res": { title: "Municipal Grid West (VLAN 102)", desc: "Residential power grid servicing residential districts. Highly dependent on Substation Alpha telemetry." },
        "node-tran": { title: "Municipal Grid East (VLAN 108)", desc: "Industrial and commercial power grid loops feeding transit lines and manufacturing complexes." },
        "node-hosp": { title: "Hospital Emergency Wing (VLAN 110)", desc: "Critical healthcare infrastructure. Fed by grid power with secondary backup diesel generators." }
      };
    } else if (this.currentScenario === 1) {
      nodeMap = {
        "node-threat": { title: "Threat Gateway (WAN)", desc: "Malicious command routing node intercepting public API traffic." },
        "node-hq": { title: "Central Control / Web API (VLAN 10)", desc: "Handles train scheduling, status updates, and public telemetry APIs." },
        "node-sub": { title: "Transit Hub Switch (VLAN 108)", desc: "Master industrial switch controlling signal configurations and rail switching loops." },
        "node-res": { title: "Station West (Line 1)", desc: "Commuter platform signal controller regulating platform indicators and safety gates." },
        "node-tran": { title: "Station East (Line 2)", desc: "Busy inner-city passenger transfer station. Automated track switching systems online." },
        "node-hosp": { title: "Terminal South (VLAN 110)", desc: "End of transit loop station with high-reliability power systems." }
      };
    } else {
      nodeMap = {
        "node-threat": { title: "Phishing Entry Vector (SMTP)", desc: "Compromised mail gateway relaying macro-enabled phishing attachments." },
        "node-hq": { title: "Domain Controller (Active Directory)", desc: "Manages healthcare network credentials, group policies, and LDAP auth services." },
        "node-sub": { title: "EHR Patient Database (VLAN 110)", desc: "Central database housing clinical records, medication allocations, and physician logs." },
        "node-res": { title: "Reception PC (VLAN 102)", desc: "Admissions workstation running database client software. Vulnerable to local SMB pivoting." },
        "node-tran": { title: "Pharmacy Dispensing Station", desc: "Automated dispensary machine verifying dosages against EHR database server." },
        "node-hosp": { title: "ICU Patient Monitors (VLAN 110)", desc: "Real-time vitals trackers monitoring critical emergency patients." }
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
  triggerPhase(phase, scenarioId = 0) {
    if (this.currentScenario !== scenarioId) {
      this.currentScenario = scenarioId;
      this.container.innerHTML = this.renderSVG(scenarioId);
      this.setupNodesTooltip();
    }
    this.currentPhase = phase;

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
      // --- Scenario 0: Power Grid Substation Compromise ---
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

          this.updateSubText(nodeHq, "192.168.42.10 (VPN)");
          this.updateSubText(nodeSub, "VLAN_42 (SCADA)");
          this.updateSubText(nodeRes, "VLAN_102 (POWERED)");
          this.updateSubText(nodeTran, "VLAN_108 (POWERED)");
          this.updateSubText(nodeHosp, "VLAN_110 (GRID_POWER)");
          
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

        case 2: // Exploit (blackout)
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
          this.updateSubText(nodeSub, "PLC_TAMPERED [FAIL]");

          setNodeState(nodeRes, "node-pulse-red");
          this.updateSubText(nodeRes, "GRID BLACKOUT [FAIL]");
          this.updateNodeOpacity(nodeRes, 0.35);

          setNodeState(nodeTran, "node-pulse-red");
          this.updateSubText(nodeTran, "GRID BLACKOUT [FAIL]");
          this.updateNodeOpacity(nodeTran, 0.35);

          setNodeState(nodeHosp, "node-pulse-amber");
          this.updateSubText(nodeHosp, "EMERGENCY GENERATOR");
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
          this.setPathParticles("hq-sub", "#3b82f6", 3, false); // Blocked flow particles
          this.setPathParticles("sub-res", "#10b981", 4, true);
          this.setPathParticles("sub-tran", "#10b981", 4, true);
          this.setPathParticles("sub-hosp", "#10b981", 4, true);

          setNodeState(nodeHq, "node-pulse-green");
          this.updateSubText(nodeHq, "CREDENTIALS_REVOKED");

          setNodeState(nodeSub, "node-pulse-blue");
          this.updateSubText(nodeSub, "PLC_RESTORED (OK)");

          setNodeState(nodeRes, "node-pulse-green");
          this.updateSubText(nodeRes, "POWER RESTORED (OK)");
          this.updateNodeOpacity(nodeRes, 1);

          setNodeState(nodeTran, "node-pulse-green");
          this.updateSubText(nodeTran, "POWER RESTORED (OK)");
          this.updateNodeOpacity(nodeTran, 1);

          setNodeState(nodeHosp, "node-pulse-green");
          this.updateSubText(nodeHosp, "GRID POWER ACTIVE");
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

          this.updateSubText(nodeHq, "192.168.42.10 (VPN)");
          this.updateSubText(nodeSub, "VLAN_42 (SCADA)");
          this.updateSubText(nodeRes, "VLAN_102 (POWERED)");
          this.updateSubText(nodeTran, "VLAN_108 (POWERED)");
          this.updateSubText(nodeHosp, "VLAN_110 (GRID_POWER)");
          
          this.updateNodeOpacity(nodeRes, 1);
          this.updateNodeOpacity(nodeTran, 1);
          break;
      }
    } else if (scenarioId === 1) {
      // --- Scenario 1: Transit Hub Signal Hijack ---
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

          this.updateSubText(nodeHq, "192.168.42.10 (API)");
          this.updateSubText(nodeSub, "VLAN_42 (SIGNALS)");
          this.updateSubText(nodeRes, "VLAN_102 (SIGNALS_OK)");
          this.updateSubText(nodeTran, "VLAN_108 (SIGNALS_OK)");
          this.updateSubText(nodeHosp, "VLAN_110 (LOOP_OK)");
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
          
          this.updateSubText(nodeHq, "API_EXPLOIT_SCAN");
          this.updateSubText(nodeTran, "SIGNAL_PORT_SCAN");
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
          
          this.updateSubText(nodeHq, "REVERSE_SHELL_CONNECTED");
          this.updateSubText(nodeTran, "SIGNAL OVERRIDE [FAIL]");
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
          
          this.updateSubText(nodeHq, "WAN_IP_BLOCKED");
          this.updateSubText(nodeTran, "SIGNAL_ROLLBACK (OK)");
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

          this.updateSubText(nodeHq, "192.168.42.10 (API)");
          this.updateSubText(nodeTran, "VLAN_108 (SIGNALS_OK)");
          break;
      }
    } else if (scenarioId === 2) {
      // --- Scenario 2: Hospital ER Ransomware Lock ---
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

          this.updateSubText(nodeHq, "192.168.42.10 (AD)");
          this.updateSubText(nodeSub, "VLAN_42 (DATABASE)");
          this.updateSubText(nodeRes, "VLAN_102 (AD_JOINED)");
          this.updateSubText(nodeTran, "VLAN_108 (DISPENSARY)");
          this.updateSubText(nodeHosp, "VLAN_110 (DB_ACTIVE)");
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
          
          this.updateSubText(nodeHq, "PHISHING_BACKDOOR");
          this.updateSubText(nodeHosp, "WORKSTATION_PIVOT");
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
          
          this.updateSubText(nodeHq, "DOMAIN_COMPROMISED");
          this.updateSubText(nodeHosp, "RANSOMWARE LOCK [FAIL]");
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
          
          this.updateSubText(nodeHq, "SUBNET_ISOLATED");
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

          this.updateSubText(nodeHq, "192.168.42.10 (AD)");
          this.updateSubText(nodeHosp, "VLAN_110 (DB_ACTIVE)");
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
    let frequency = "60.00 Hz";
    let statusColor = "#10b981"; // green

    if (phase === 0) {
      integrity = "100%";
      frequency = "60.00 Hz";
      statusColor = "#10b981";
    } else if (phase === 1) {
      integrity = "98%";
      frequency = "59.98 Hz";
      statusColor = "#f59e0b"; // amber
    } else if (phase === 2) {
      statusColor = "#ef4444"; // red
      if (scenarioId === 0) {
        integrity = "24%";
        frequency = "48.12 Hz";
      } else if (scenarioId === 1) {
        integrity = "62%";
        frequency = "59.95 Hz";
      } else {
        integrity = "15%";
        frequency = "59.97 Hz";
      }
    } else if (phase === 3) {
      integrity = "85%";
      frequency = "60.00 Hz";
      statusColor = "#3b82f6"; // blue
    } else if (phase === 4) {
      integrity = "100%";
      frequency = "60.00 Hz";
      statusColor = "#10b981";
    }

    if (integrityText) {
      integrityText.textContent = `SYS_INTEGRITY: ${integrity}`;
      integrityText.setAttribute("fill", statusColor);
    }
    if (freqText) {
      freqText.textContent = `GRID_FREQ: ${frequency}`;
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
      if (text.includes("FAIL") || text.includes("BLACKOUT") || text.includes("LOCK") || text.includes("TAMPERED") || text.includes("COMPROMISED") || text.includes("SCAN")) {
        textEls[1].setAttribute("fill", "#ef4444");
      } else if (text.includes("RESTORED") || text.includes("ONLINE") || text.includes("POWERED") || text.includes("ACTIVE") || text.includes("OK") || text.includes("REVOKED")) {
        textEls[1].setAttribute("fill", "#10b981");
      } else if (text.includes("EMERGENCY") || text.includes("GENERATOR") || text.includes("RUNNING") || text.includes("PIVOT")) {
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
