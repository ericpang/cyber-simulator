# Cyber Range Simulation (Widescreen ICC Edition)

An interactive, widescreen Red vs. Blue cyber range simulator designed for student presentations and interactive training. It supports two distinct campaign modes: **Operational Technology (OT) Mode** and **Information Technology (IT) Mode**, configured via a root-level settings file.

Depending on the configuration, it displays real-time map telemetry (smart city grids or enterprise networks), attacker terminal commands execution, SIEM logs, threat metrics, and security instrumentation analytics.

---

## 🖥️ Application Design & Layout

The dashboard is designed for high-resolution widescreen screens (ICC Edition) and split into three primary panels:
1. **Top HUD Header**: Tracks the running status, active phase, campaign cycle counter, cycle time elapsed, phase countdown, voice narrator toggle, and dynamically updates headings/title based on the active campaign mode.
2. **Panel 1 - Threat Propagation System (Attacker Terminal)**: Simulates the execution of CLI tools, port scans, SSH/SMB brute-forcing, Metasploit/SQLi payloads, and shell outputs.
3. **Panel 2 - Network Topology Grid (Map)**: An interactive SVG-based network topology showing live node statuses (Green = operational, Orange = warning/recon, Red = compromised, Blue = isolated) and telemetry flows.
4. **Panel 3 - SIEM Events & Threat Deep Instrumentation**:
   - **Phase Override Controls**: Direct jump to any of the simulation phases.
   - **Real-Time Metrics**: Event logs rate (EPS), firewall statuses, and a radial threat danger gauge.
   - **EPS History Chart / Net Latency**: Dynamic line chart graphing log volume spikes and network performance.
   - **Live SIEM Ticker**: Scrollable feed showing raw IDS/IPS and firewall logs.
   - **AI Tactical Co-Pilot**: Connects to a local LLM (via Ollama) to analyze the current incident state and suggest mitigations.

---

## 📂 Project Structure

All campaign-specific logic, styling updates, maps, and logs are segregated into distinct directories:

```bash
├── index.html                  # Core HTML structure & dynamic campaign bootstrapper
├── .env                        # Config file setting OT_MODE, AI_AGENT, GEMINI_API_KEY, and OLLAMA endpoints
├── css/
│   └── custom.css              # Custom neon glows, scanlines, CRT screen, and layouts
├── js/
│   └── resizable.js            # Draggable split-pane layout resizing utility
└── campaigns/
    ├── ot/                     # OT Mode Campaign Directory (Smart City Cyber Range)
    │   ├── app.js              # OT master orchestrator & logic
    │   ├── attacker.js         # OT CLI attacker commands simulator
    │   ├── city-map.js         # OT municipal telemetry grid map controller
    │   ├── siem.js             # OT SIEM charts & alerts logger
    │   ├── interactive_polls.json # Interactive options for OT Scenarios
    │   ├── ctf_challenges.json # CTF questions & flags for OT Scenarios
    │   ├── demo_script.md      # Presenter guide for OT (Normal Mode)
    │   ├── demo_script_interactive.md # Presenter guide for OT (Interactive Mode)
    │   └── demo_script_ctf.md  # Presenter guide for OT (CTF Mode)
    └── it/                     # IT Mode Campaign Directory (Enterprise IT Cyber Range)
        ├── app.js              # IT master orchestrator & logic
        ├── attacker.js         # IT CLI attacker commands simulator
        ├── city-map.js         # IT enterprise network map controller
        ├── siem.js             # IT SIEM charts & alerts logger
        ├── interactive_polls.json # Interactive options for IT Scenarios
        ├── ctf_challenges.json # CTF questions & flags for IT Scenarios
        ├── demo_script.md      # Presenter guide for IT (Normal Mode)
        ├── demo_script_interactive.md # Presenter guide for IT (Interactive Mode)
        └── demo_script_ctf.md  # Presenter guide for IT (CTF Mode)
```

---

## ⚙️ Configuration & Modes Selection

The cyber range is configured via the root-level `.env` file:

```env
# Campaign Mode (true = OT campaigns, false = IT campaigns)
OT_MODE=false

# AI Agent Provider (options: gemini, ollama)
AI_AGENT=gemini

# Google Gemini AI Agent Configuration
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Local Ollama AI Agent Configuration
OLLAMA_ENDPOINT=http://172.27.120.208:11434/api/generate
OLLAMA_MODEL=gemma4:26b
```

- **`OT_MODE = true`**: Activates the **Smart City Cyber Range Simulation** (Power Grid, Transit, Hospital).
- **`OT_MODE = false`**: Activates the **Enterprise IT Cyber Range Simulation** (Active Directory Domain Ransomware, Cloud E-Commerce DB Exfiltration, Corporate BEC Phishing).

---

## ⚡ Core Campaigns (Scenarios)

### 1. Smart City Campaigns (OT Mode)
1. **Scenario 1 - Power Grid Substation Compromise**: Targets industrial control systems (ICS/SCADA) and Modbus TCP relays, causing municipal blackouts.
2. **Scenario 2 - Metro Transit Platform Signal Hijack**: Exploits REST API vulnerabilities and executes command injection to freeze rail transit signals.
3. **Scenario 3 - Hospital ER Ransomware Lock**: Scans for SMB EternalBlue vulnerabilities to deploy cryptolocker ransomware, encrypting hospital telemetry.

### 2. Enterprise IT Campaigns (IT Mode)
1. **Scenario 1 - Active Directory Domain Ransomware**: Targets domain controllers and Active Directory infrastructure via Kerberos ticket harvesting and credentials access.
2. **Scenario 2 - Cloud E-Commerce Database Exfiltration**: Exploits SQL Injection flaws to bypass WAF, execute UNION select statements, and dump customer records.
3. **Scenario 3 - Corporate BEC Financial Fraud**: Leverages phishing document macros (CVE-2021-40444) to steal session cookies and bypass MFA, committing invoice fraud.

---

## ⚙️ Presentation Operating Modes

The simulation can run in three distinct operational modes, toggled in the dashboard interface:

### 1. Normal Mode (Default Auto-Play)
* The timeline advances automatically.
* The system executes the default baseline attack and defense paths.

### 2. Interactive Mode
* Auto-play is paused. At each phase transition, the dashboard pauses and displays a decision poll.
* Users choose between 3 branching strategies. Selection changes the command output in the Attacker Terminal, the SIEM alerts, and the corresponding map pathways.

### 3. CTF Mode
* Mutually exclusive with Interactive Mode.
* Pauses at phase transitions, prompting users to answer Capture the Flag challenges.
* Users must find information from the live screens (such as target IPs, register databases, or isolated VLANs) and submit the correct flag to advance.

---

## 🚀 How to Run Locally

### 1. Start a Local Server
Because the application fetches configurations dynamically, it must be run from a local web server (opening the file directly via `file://` will trigger CORS block policies).

Using **Python**:
```bash
# Run in the project directory
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8000`.

Using **Node.js**:
```bash
npm install -g http-server
http-server -p 8000
```

### 2. Configure AI Tactical Co-Pilot
The AI Co-Pilot supports both **Google Gemini** and **Local Ollama** models, configured via `.env`:

#### Option A: Google Gemini (Cloud AI Agent)
1. Set `AI_AGENT=gemini` in `.env`.
2. Add your Gemini API key: `GEMINI_API_KEY=your_key_here`.
3. Set desired model (default: `GEMINI_MODEL=gemini-2.5-flash`).

#### Option B: Local Ollama (Self-Hosted AI Agent)
1. Set `AI_AGENT=ollama` in `.env`.
2. Run Ollama on host and enable CORS:
   ```powershell
   $env:OLLAMA_ORIGINS="*"
   ollama serve --host 0.0.0.0
   ```
3. Pull your model:
   ```bash
   ollama pull gemma4:26b
   ```

