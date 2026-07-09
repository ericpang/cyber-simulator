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
    this.container.innerHTML = this.renderSVG();
    this.setupNodesTooltip();
  }

  renderSVG() {
    return `
      <div class="relative w-full h-full bg-grid-cyber flex items-center justify-center p-4">
        <!-- Technical HUD Borders on canvas -->
        <div class="absolute top-2 left-2 font-mono text-[10px] text-neutral-500 tracking-wider">MAP VIEWPORT: CITY-GRID-TOPOLOGY v1.42</div>
        <div class="absolute bottom-2 right-2 font-mono text-[10px] text-neutral-500 tracking-wider">AUTO SCAN ACTIVE: 60FPS</div>

        <svg viewBox="0 0 800 480" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          <!-- Background grid circles and lines -->
          <circle cx="400" cy="240" r="120" stroke="rgba(255,255,255,0.02)" stroke-width="1.5" fill="none" stroke-dasharray="4, 4"/>
          <circle cx="400" cy="240" r="200" stroke="rgba(255,255,255,0.015)" stroke-width="1.5" fill="none"/>
          <line x1="400" y1="40" x2="400" y2="440" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>
          <line x1="100" y1="240" x2="700" y2="240" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>

          <!-- Group for Data Connection Flows -->
          <g id="map-links">
            <!-- External Threat Source -> Corp HQ -->
            <path id="path-threat" d="M 70 80 Q 110 90 150 140" fill="none" class="data-flow-path data-flow-stopped stroke-neutral-800" stroke-width="2"/>
            
            <!-- Corp HQ -> Substation Alpha -->
            <path id="path-hq-sub" d="M 170 160 Q 285 200 400 240" fill="none" class="data-flow-path stroke-green-500" stroke-width="2"/>
            
            <!-- Substation Alpha -> Residential District -->
            <path id="path-sub-res" d="M 400 240 Q 300 310 200 380" fill="none" class="data-flow-path stroke-green-500" stroke-width="2"/>
            
            <!-- Substation Alpha -> Transport Hub -->
            <path id="path-sub-tran" d="M 400 240 Q 500 190 600 140" fill="none" class="data-flow-path stroke-green-500" stroke-width="2"/>
            
            <!-- Substation Alpha -> Hospital Wing -->
            <path id="path-sub-hosp" d="M 400 240 Q 510 310 620 380" fill="none" class="data-flow-path stroke-green-500" stroke-width="2"/>
          </g>

          <!-- Group for Nodes -->
          <g id="map-nodes">
            
            <!-- GATEWAY / INTERNET NODE (Hacker source representation) -->
            <g id="node-threat" class="map-node opacity-30 transition-opacity duration-700" transform="translate(70, 80)">
              <g class="node-pulse-wrapper">
                <circle r="22" fill="#0c0a09" stroke="#ef4444" stroke-width="1" class="glow-border-red"/>
                <circle r="26" fill="none" stroke="#ef4444" stroke-width="1" stroke-dasharray="2, 6"/>
                <!-- Skull Icon -->
                <path d="M-8 -6 C-8 -12 8 -12 8 -6 C8 -2 6 2 4 4 L4 7 L-4 7 L-4 4 C-6 2 -8 -2 -8 -6 Z M-4 6 L4 6 M-3 -5 A1 1 0 0 1 -3 -3 M3 -5 A1 1 0 0 1 3 -3" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
              </g>
              <text y="38" font-family="monospace" font-size="11" fill="#ef4444" text-anchor="middle" font-weight="bold">EXT_GATEWAY</text>
            </g>

            <!-- NODE A: Corporate HQ -->
            <g id="node-hq" class="map-node" transform="translate(150, 140)">
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="26" fill="#022c22" stroke="currentColor" stroke-width="2"/>
                <!-- Corporate Tower Icon -->
                <path d="M-10 14 L-10 -12 L0 -18 L10 -12 L10 14 Z M-4 6 L-4 0 L4 0 L4 6 Z M-4 -6 L-4 -8 L4 -8 L4 -6 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </g>
              <text y="44" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">CORP_HQ</text>
              <text y="58" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">192.168.42.10</text>
            </g>

            <!-- NODE B: Substation Alpha (Primary target) -->
            <g id="node-sub" class="map-node" transform="translate(400, 240)">
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="30" fill="#022c22" stroke="currentColor" stroke-width="2.5"/>
                <circle r="36" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3, 3"/>
                <!-- Lightning Bolt Icon -->
                <polygon points="4,-16 -12,2 2,2 -4,16 12,-2 -2,-2" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
              </g>
              <!-- Shielding effect ring overlay (Initially hidden) -->
              <circle id="shield-ring-sub" r="44" fill="none" stroke="#3b82f6" stroke-width="2.5" class="shield-ring hidden"/>
              <text y="50" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">SUBSTATION_ALPHA</text>
              <text y="64" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">192.168.42.50</text>
            </g>

            <!-- NODE C: Residential District -->
            <g id="node-res" class="map-node" transform="translate(200, 380)">
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="26" fill="#022c22" stroke="currentColor" stroke-width="2"/>
                <!-- House Icon -->
                <path d="M-12 12 L-12 -2 L0 -12 L12 -2 L12 12 Z M-6 12 L-6 4 L6 4 L6 12 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </g>
              <text y="44" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">MUNI_GRID_WEST</text>
              <text y="58" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">VLAN_102 (POWERED)</text>
            </g>

            <!-- NODE D: Transportation Hub -->
            <g id="node-tran" class="map-node" transform="translate(600, 140)">
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="26" fill="#022c22" stroke="currentColor" stroke-width="2"/>
                <!-- Subway / Train Front Icon -->
                <path d="M-10 6 C-10 -10 10 -10 10 6 L10 12 L-10 12 Z M-6 -4 L6 -4 M-6 2 A2 2 0 0 1 -6 6 M6 2 A2 2 0 0 1 6 6" fill="none" stroke="currentColor" stroke-width="2"/>
                <line x1="-6" y1="12" x2="-10" y2="16" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="12" x2="10" y2="16" stroke="currentColor" stroke-width="2"/>
              </g>
              <!-- Shielding effect ring overlay (Initially hidden) -->
              <circle id="shield-ring-tran" r="40" fill="none" stroke="#3b82f6" stroke-width="2.5" class="shield-ring hidden"/>
              <text y="44" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">TRANSIT_HUB</text>
              <text y="58" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">VLAN_108 (ACTIVE)</text>
            </g>

            <!-- NODE E: Hospital Wing (Critical Infrastructure) -->
            <g id="node-hosp" class="map-node" transform="translate(620, 380)">
              <g class="node-pulse-wrapper node-pulse-green">
                <circle r="26" fill="#022c22" stroke="currentColor" stroke-width="2"/>
                <!-- Medical Cross Icon -->
                <path d="M-4 12 L4 12 L4 4 L12 4 L12 -4 L4 -4 L4 -12 L-4 -12 L-4 -4 L-12 -4 L-12 4 L-4 4 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </g>
              <!-- Shielding effect ring overlay (Initially hidden) -->
              <circle id="shield-ring-hosp" r="40" fill="none" stroke="#3b82f6" stroke-width="2.5" class="shield-ring hidden"/>
              <text y="44" font-family="monospace" font-size="13" fill="currentColor" text-anchor="middle" font-weight="bold">HOSPITAL_ER</text>
              <text y="58" font-family="monospace" font-size="10" fill="#a3a3a3" text-anchor="middle">VLAN_110 (CRITICAL)</text>
            </g>
          </g>
        </svg>

        <!-- Dynamic Tooltip or Info Floating overlay -->
        <div id="map-info-box" class="absolute bottom-4 left-4 bg-neutral-950/90 border border-neutral-800 p-3 rounded font-mono text-xs max-w-xs backdrop-blur-md hidden shadow-lg">
          <div class="font-bold text-green-500 mb-1" id="map-tooltip-title">Node Title</div>
          <div class="text-neutral-400" id="map-tooltip-desc">Description about current status.</div>
        </div>
      </div>
    `;
  }

  setupNodesTooltip() {
    const nodeMap = {
      "node-hq": { title: "Corporate Headquarters (VLAN 10)", desc: "Primary administrative networks. Houses corporate email servers and active directory services connected to external portals." },
      "node-sub": { title: "Substation Alpha (VLAN 42)", desc: "High-voltage distribution controller managing municipal energy routing. Operates Modbus TCP telemetry relays." },
      "node-res": { title: "Municipal Grid West (VLAN 102)", desc: "Residential power grid servicing roughly 140,000 households. Highly dependent on Substation Alpha telemetry." },
      "node-tran": { title: "Metro Transit Hub (VLAN 108)", desc: "Automated train routing and platform signaling systems. High-reliability networking requirement." },
      "node-hosp": { title: "Hospital Emergency Wing (VLAN 110)", desc: "Critical healthcare infrastructure. Supported by redundant battery systems and smart-switching micro-grids." },
      "node-threat": { title: "External Threat Gateway", desc: "Unrecognized WAN entry point routing suspicious traffic via Tor Exit node pathways." }
    };

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
    this.currentPhase = phase;
    this.currentScenario = scenarioId;

    const pathThreat = document.getElementById("path-threat");
    const pathHqSub = document.getElementById("path-hq-sub");
    const pathSubRes = document.getElementById("path-sub-res");
    const pathSubTran = document.getElementById("path-sub-tran");
    const pathSubHosp = document.getElementById("path-sub-hosp");

    const nodeThreat = document.getElementById("node-threat");
    const nodeHq = document.getElementById("node-hq");
    const nodeSub = document.getElementById("node-sub");
    const nodeRes = document.getElementById("node-res");
    const nodeTran = document.getElementById("node-tran");
    const nodeHosp = document.getElementById("node-hosp");

    const shieldSub = document.getElementById("shield-ring-sub");
    const shieldTran = document.getElementById("shield-ring-tran");
    const shieldHosp = document.getElementById("shield-ring-hosp");

    const setNodeState = (node, statusClass) => {
      if (!node) return;
      const wrapper = node.querySelector(".node-pulse-wrapper");
      if (wrapper) {
        wrapper.classList.remove("node-pulse-green", "node-pulse-amber", "node-pulse-red");
        wrapper.classList.add(statusClass);
      }
    };

    const hideAllShields = () => {
      if (shieldSub) shieldSub.classList.add("hidden");
      if (shieldTran) shieldTran.classList.add("hidden");
      if (shieldHosp) shieldHosp.classList.add("hidden");
    };

    // Default cleanup for reset/phase-switches
    hideAllShields();
    if (nodeSub) nodeSub.style.color = ""; 
    if (nodeTran) nodeTran.style.color = ""; 
    if (nodeHosp) nodeHosp.style.color = ""; 

    // Handle states depending on scenario
    if (scenarioId === 0) {
      // --- Scenario 0: Power Grid Substation Compromise ---
      switch(phase) {
        case 0: // Baseline
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updatePath(pathThreat, "data-flow-stopped stroke-neutral-800", 2);
          this.updatePath(pathHqSub, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubRes, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubTran, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubHosp, "stroke-green-500 data-flow-slow", 2);

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
          this.updatePath(pathThreat, "stroke-amber-500 data-flow-fast", 2.5);
          this.updatePath(pathHqSub, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubRes, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubTran, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubHosp, "stroke-green-500 data-flow-slow", 2);

          setNodeState(nodeHq, "node-pulse-amber");
          this.updateSubText(nodeHq, "BRUTE_FORCE_SCAN");
          break;

        case 2: // Exploit (blackout)
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updatePath(pathThreat, "stroke-red-500 data-flow-fast", 3);
          this.updatePath(pathHqSub, "stroke-red-500 data-flow-fast", 3.5);
          this.updatePath(pathSubRes, "stroke-neutral-800 data-flow-stopped", 1.5);
          this.updatePath(pathSubTran, "stroke-neutral-800 data-flow-stopped", 1.5);
          this.updatePath(pathSubHosp, "stroke-amber-500 data-flow-slow", 1.5);

          setNodeState(nodeHq, "node-pulse-red");
          setNodeState(nodeSub, "node-pulse-red");
          this.updateSubText(nodeSub, "PLC_TAMPERED [FAIL]");

          setNodeState(nodeRes, "node-pulse-red");
          this.updateSubText(nodeRes, "GRID BLACKOUT [FAIL]");
          this.updateNodeOpacity(nodeRes, 0.3);

          setNodeState(nodeTran, "node-pulse-red");
          this.updateSubText(nodeTran, "GRID BLACKOUT [FAIL]");
          this.updateNodeOpacity(nodeTran, 0.3);

          setNodeState(nodeHosp, "node-pulse-amber");
          this.updateSubText(nodeHosp, "EMERGENCY GENERATOR");
          break;

        case 3: // Mitigate
          if (shieldSub) shieldSub.classList.remove("hidden");
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-30 transition-opacity duration-700");

          this.updatePath(pathThreat, "stroke-neutral-800 data-flow-stopped", 1);
          this.updatePath(pathHqSub, "stroke-blue-500 data-flow-stopped", 2);
          this.updatePath(pathSubRes, "stroke-green-500 data-flow-path", 2);
          this.updatePath(pathSubTran, "stroke-green-500 data-flow-path", 2);
          this.updatePath(pathSubHosp, "stroke-green-500 data-flow-path", 2);

          setNodeState(nodeHq, "node-pulse-green");
          this.updateSubText(nodeHq, "CREDENTIALS_REVOKED");

          setNodeState(nodeSub, "node-pulse-green");
          nodeSub.style.color = "#3b82f6"; 
          this.updateSubText(nodeSub, "PLC_RESTORED (OK)");

          setNodeState(nodeRes, "node-pulse-green");
          this.updateSubText(nodeRes, "POWER RESTORED (OK)");
          this.updateNodeOpacity(nodeRes, 1);

          setNodeState(nodeTran, "node-pulse-green");
          this.updateSubText(nodeTran, "TRANSIT POWER RESTORED");
          this.updateNodeOpacity(nodeTran, 1);

          setNodeState(nodeHosp, "node-pulse-green");
          this.updateSubText(nodeHosp, "GRID POWER ACTIVE");
          break;

        case 4: // Reset
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateSubText(nodeHq, "192.168.42.10 (VPN)");
          this.updateSubText(nodeSub, "VLAN_42 (SCADA)");
          this.updateSubText(nodeRes, "VLAN_102 (POWERED)");
          this.updateSubText(nodeTran, "VLAN_108 (POWERED)");
          this.updateSubText(nodeHosp, "VLAN_110 (GRID_POWER)");
          break;
      }
    } else if (scenarioId === 1) {
      // --- Scenario 1: Transit Hub Signal Hijack ---
      switch(phase) {
        case 0: // Baseline
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updatePath(pathThreat, "data-flow-stopped stroke-neutral-800", 2);
          this.updatePath(pathHqSub, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubRes, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubTran, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubHosp, "stroke-green-500 data-flow-slow", 2);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeSub, "node-pulse-green");
          setNodeState(nodeRes, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");

          this.updateSubText(nodeHq, "192.168.42.10 (API)");
          this.updateSubText(nodeSub, "VLAN_42 (GRID_OK)");
          this.updateSubText(nodeRes, "VLAN_102 (GRID_OK)");
          this.updateSubText(nodeTran, "VLAN_108 (SIGNALS_OK)");
          this.updateSubText(nodeHosp, "VLAN_110 (GRID_OK)");
          break;

        case 1: // Recon
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updatePath(pathThreat, "stroke-amber-500 data-flow-fast", 2.5);
          setNodeState(nodeHq, "node-pulse-amber");
          setNodeState(nodeTran, "node-pulse-amber");
          
          this.updateSubText(nodeHq, "API_EXPLOIT_SCAN");
          this.updateSubText(nodeTran, "SIGNAL_PORT_SCAN");
          break;

        case 2: // Exploit
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updatePath(pathThreat, "stroke-red-500 data-flow-fast", 3);
          this.updatePath(pathHqSub, "stroke-red-500 data-flow-fast", 3.5);
          this.updatePath(pathSubTran, "stroke-red-500 data-flow-fast", 3.5);
          
          setNodeState(nodeHq, "node-pulse-red");
          setNodeState(nodeTran, "node-pulse-red");
          
          this.updateSubText(nodeHq, "REVERSE_SHELL_CONNECTED");
          this.updateSubText(nodeTran, "SIGNAL OVERRIDE [FAIL]");
          break;

        case 3: // Mitigate
          if (shieldTran) shieldTran.classList.remove("hidden");
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-30 transition-opacity duration-700");

          this.updatePath(pathThreat, "stroke-neutral-800 data-flow-stopped", 1);
          this.updatePath(pathHqSub, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubTran, "stroke-blue-500 data-flow-stopped", 2);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          nodeTran.style.color = "#3b82f6"; 
          
          this.updateSubText(nodeHq, "WAN_IP_BLOCKED");
          this.updateSubText(nodeTran, "SIGNAL_ROLLBACK (OK)");
          break;

        case 4: // Reset
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateSubText(nodeHq, "192.168.42.10 (API)");
          this.updateSubText(nodeTran, "VLAN_108 (SIGNALS_OK)");
          break;
      }
    } else if (scenarioId === 2) {
      // --- Scenario 2: Hospital ER Ransomware Lock ---
      switch(phase) {
        case 0: // Baseline
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updatePath(pathThreat, "data-flow-stopped stroke-neutral-800", 2);
          this.updatePath(pathHqSub, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubRes, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubTran, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubHosp, "stroke-green-500 data-flow-slow", 2);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeSub, "node-pulse-green");
          setNodeState(nodeRes, "node-pulse-green");
          setNodeState(nodeTran, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");

          this.updateSubText(nodeHq, "192.168.42.10 (AD)");
          this.updateSubText(nodeSub, "VLAN_42 (GRID_OK)");
          this.updateSubText(nodeRes, "VLAN_102 (GRID_OK)");
          this.updateSubText(nodeTran, "VLAN_108 (GRID_OK)");
          this.updateSubText(nodeHosp, "VLAN_110 (DB_ACTIVE)");
          break;

        case 1: // Recon
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updatePath(pathThreat, "stroke-amber-500 data-flow-fast", 2.5);
          setNodeState(nodeHq, "node-pulse-amber");
          setNodeState(nodeHosp, "node-pulse-amber");
          
          this.updateSubText(nodeHq, "PHISHING_BACKDOOR");
          this.updateSubText(nodeHosp, "WORKSTATION_PIVOT");
          break;

        case 2: // Exploit
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-100 transition-opacity duration-700");
          this.updatePath(pathThreat, "stroke-red-500 data-flow-fast", 3);
          this.updatePath(pathHqSub, "stroke-red-500 data-flow-fast", 3.5);
          this.updatePath(pathSubHosp, "stroke-red-500 data-flow-fast", 3.5);

          setNodeState(nodeHq, "node-pulse-red");
          setNodeState(nodeHosp, "node-pulse-red");
          
          this.updateSubText(nodeHq, "DOMAIN_COMPROMISED");
          this.updateSubText(nodeHosp, "RANSOMWARE LOCK [FAIL]");
          break;

        case 3: // Mitigate
          if (shieldHosp) shieldHosp.classList.remove("hidden");
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-30 transition-opacity duration-700");

          this.updatePath(pathThreat, "stroke-neutral-800 data-flow-stopped", 1);
          this.updatePath(pathHqSub, "stroke-green-500 data-flow-slow", 2);
          this.updatePath(pathSubHosp, "stroke-blue-500 data-flow-stopped", 2);

          setNodeState(nodeHq, "node-pulse-green");
          setNodeState(nodeHosp, "node-pulse-green");
          nodeHosp.style.color = "#3b82f6"; 
          
          this.updateSubText(nodeHq, "SUBNET_ISOLATED");
          this.updateSubText(nodeHosp, "RECOVERY RUNNING (OK)");
          break;

        case 4: // Reset
          if (nodeThreat) nodeThreat.setAttribute("class", "map-node opacity-10 transition-opacity duration-700");
          this.updateSubText(nodeHq, "192.168.42.10 (AD)");
          this.updateSubText(nodeHosp, "VLAN_110 (DB_ACTIVE)");
          break;
      }
    }
  }

  updatePath(path, classes, strokeWidth) {
    if (!path) return;
    path.setAttribute("class", "data-flow-path " + classes);
    path.setAttribute("stroke-width", strokeWidth);
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
