# Smart City Cyber Range Simulation: Demonstration Guide & Script

Welcome to the official demonstration guide and script for the **Smart City Cyber Range Simulation (Widescreen ICC Edition)**. This document provides a step-by-step presentation script designed for student presenters. It covers the user interface layout, interaction controls, and a detailed walkthrough of all three simulation scenarios.

---

## 🖥️ Layout of the Integrated Command Center (ICC)

When presenting, orient the audience to the widescreen layout of the dashboard:
1. **Top HUD Header**: Contains the running status indicator, the currently active simulation phase, a real-time campaign cycle counter, cycle time elapsed, and phase countdown.
2. **Demonstration Controls (Header Right)**: 
   - **VOICE narration toggle & dropdown**: Selects the active voice engine (featuring high-quality sweet/natural voices).
   - **PAUSE / RESUME button**: Pauses the timeline to allow for detailed explanations.
   - **Speed controls (1X, 5X, 10X)**: Accelerates or slows down the timeline.
3. **Active Campaign Selector**: Located above Panel 1, allowing instant toggling between **Power Grid**, **Transit System**, and **Hospital ER** scenarios.
4. **Panel 1 // Threat Propagation System (Attacker Terminal)**: Displays the real-time execution of the attacker's CLI tools, scans, payloads, and terminal feedbacks.
5. **Panel 2 // Municipal Telemetry Grid (Map)**: An interactive SVG-based city network topology showing node statuses (Green = operational, Orange = warning/recon, Red = compromised, Blue = isolated) and telemetry flows.
6. **Panel 3 // SIEM Events & Threat Deep Instrumentation**:
   - **Phase Override buttons**: Force-jumps the simulation to any of the 5 phases.
   - **Metrics panel**: Shows Events Per Second (EPS), Firewall Status, and Threat Level.
   - **Threat Gauge**: A radial meter showing real-time danger level.
   - **EPS History Chart**: A live line chart mapping the log stream intensity.
   - **Live SIEM Event Stream**: Scrollable feed showing raw IDS/IPS and firewall logs.
   - **AI Co-Pilot**: Interactive panel generating real-time tactical advice.

---

## ⚡ Scenario 1: Power Grid Substation Compromise
**Focus**: Industrial Control Systems (ICS/SCADA), Modbus TCP protocol vulnerability, and PLC exploitation.

### Phase 0: Baseline Operations (00:00 - 01:00)
* **Visual Cues on Screen**: 
  - Substation Alpha and all city sectors are glowing **green** on the map.
  - Telemetry EPS is steady at 15–20.
  - Threat Level displays `NORMAL`.
  - Attacker terminal is idle, running ping sweeps to verify connection.
* **Automated Voice Announcement**: *"System baseline established. All networks operating within normal parameters."*
* **Demonstrator Script**:
  > "Welcome to the Integrated Command Center. We are currently observing Campaign 1: Power Grid Substation Compromise. In this baseline phase, the smart city's municipal power grid is operating normally. Our telemetry indicators show a normal log rate of under twenty events per second, with firewall state showing active and secure. The central node, Substation Alpha, is feeding power flows to residential, transit, and hospital systems, as shown by the flowing green lines on our telemetry grid map."

---

### Phase 1: Reconnaissance & Phishing (01:00 - 02:15)
* **Visual Cues on Screen**: 
  - Attacker terminal begins execution of `nmap` port scanning and `hydra` SSH password brute-forcing.
  - The path between `EXT_GATEWAY` and `CORP_HQ` turns **orange**, with animated flow pulses.
  - SIEM EPS spikes up to 40–50.
  - SIEM Live stream prints alerts like `IDS ALERT: SSH Brute Force attempt detected on Corp Gateway`.
* **Automated Voice Announcement**: *"Threat warning. Reconnaissance activity detected targeting Substation Alpha network."*
* **Demonstrator Script**:
  > "As we transition into Phase 1, our Threat Propagation System detects active reconnaissance. On the attacker terminal, we see an Nmap scan targeting ports in our network. The attacker locates port `502`—the default Modbus TCP port—open on Substation Alpha. They then execute a Hydra brute-force campaign against the corporate gateway. On the telemetry grid, the link between the external gateway and Corporate HQ lights up orange, representing the threat vector. In the SIEM panel below, the log rate has climbed to 45 events per second, and alerts are flagging SSH credential stuffing."

---

### Phase 2: Subsystem Exploitation (02:15 - 03:30)
* **Visual Cues on Screen**: 
  - The attacker terminal screen changes to **red** text, showing a Metasploit console login and execution of `exploit/linux/scada/modbus_merge`.
  - Substation Alpha node flashes red. The lines feeding power to the Residential District and city sectors turn **red** and stop flowing.
  - The Threat Gauge fills to red (`CRITICAL`), and EPS jumps to 120+.
  - The SIEM feed overflows with PLC registry write alerts and power failure logs.
* **Automated Voice Announcement**: *"Critical breach alert. Substation Alpha telemetry compromised. Municipal power grid offline."*
* **Demonstrator Script**:
  > "We have reached Phase 2: Exploitation. The attacker has successfully leveraged compromised corporate credentials to pivot into the operational technology network. Using Metasploit, they send malicious Modbus registers to override the main PLC breaker. The physical consequences are visible on our map: Substation Alpha has turned red, data flows have stopped, and the residential grid is experiencing a complete blackout. The threat level is now critical, with event logs exceeding 120 per second as power systems drop offline."

---

### Phase 3: Autonomous Isolation & Defense (03:30 - 04:30)
* **Visual Cues on Screen**: 
  - The link between `CORP_HQ` and `SUBSTATION_ALPHA` turns **blue**, showing automated network containment.
  - Substation Alpha's icon changes to blue (`ISOLATED`).
  - Attacker terminal prints `CONNECTION REFUSED - VLAN firewall active`.
  - Power lines slowly recover back to green as secondary generators engage.
  - EPS starts dropping back to normal ranges.
* **Automated Voice Announcement**: *"Mitigation active. Automated isolation protocols triggered. Restoring power grids."*
* **Demonstrator Script**:
  > "In response to the exploit, the Blue Team's autonomous SOAR orchestrator triggers. Within milliseconds of the Modbus override, firewall rules are updated to quarantine the attacker's VLAN. The map shows the telemetry link switching to blue, indicating the infected network segment is completely isolated. With the threat vector blocked, automated grid rerouting protocols restore auxiliary power, bringing the municipal sectors back online while engineering teams clean the primary PLC controllers."

---

### Phase 4: Sanitization & Campaign Reset (04:30 - 05:00)
* **Visual Cues on Screen**: 
  - Attacker terminal prints local environment cleaning logs.
  - All nodes and links return to baseline green.
  - Threat Level resets to `NORMAL` and Threat Gauge drops to zero.
* **Automated Voice Announcement**: *"Sanitization sequence initiated. Threat cache rotation active. Next campaign standby."*
* **Demonstrator Script**:
  > "In the final phase, sanitization scripts clean up the active registry values, logs are rotated, and forensic telemetry is archived. The threat level returns to normal, readying the environment for the next scenario. Let's toggle the Campaign Selector to Campaign 2."

---

## 🚇 Scenario 2: Metro Transit Platform Signal Hijack
**Focus**: Web API vulnerabilities, unauthorized command injection, and critical transit signaling overrides.

### Phase 0: Baseline Operations (00:00 - 01:00)
* **Visual Cues on Screen**: 
  - Transit Hub node and metro lines are glowing **green**.
  - Event logs show normal train routing telemetry.
* **Automated Voice Announcement**: *"System baseline established. Transit loop configuration online."*
* **Demonstrator Script**:
  > "We are now viewing Campaign 2: Transit System Signal Hijack. The metro transit signals and rail networks are operating normally. Trains are moving, signaling lights are green, and API queries checking signal statuses are returning secure response codes."

---

### Phase 1: Reconnaissance & Phishing (01:00 - 02:15)
* **Visual Cues on Screen**: 
  - Attacker terminal runs `nikto` directory scans against the Transit API.
  - Terminal output identifies a vulnerable endpoint: `POST /api/v1/signal/override` containing a shell injection candidate.
  - SIEM alerts display unauthorized API structure scans.
* **Automated Voice Announcement**: *"Threat warning. Web API scanning activity detected targeting Metro signaling ports."*
* **Demonstrator Script**:
  > "In Phase 1, the attacker scans our public-facing transit endpoints. On the terminal, we see the Nikto scanner probing HTTP web directory structures. They identify an unauthenticated endpoint in the Metro Transit Signaling API that allows raw shell command parameters to be passed without proper input validation. This represents our attack vector."

---

### Phase 2: Subsystem Exploitation (02:15 - 03:30)
* **Visual Cues on Screen**: 
  - Attacker terminal executes a `curl` POST request containing a reverse bash shell payload.
  - Terminal outputs `Shell connection received on 10.10.14.89`.
  - Attacker runs `./override_signals.sh --all-tracks --red`.
  - Transit Hub node turns **red**. Signals lock to red across the metro network.
  - Live alerts output: `IDS ALERT: Remote Bash Shell Spawned on Port 4444`.
* **Automated Voice Announcement**: *"Critical breach alert. Transit hub signaling overridden. Platform signals locked to red."*
* **Demonstrator Script**:
  > "Phase 2 exploitation begins. The attacker sends a crafted curl request containing a reverse shell command injection. The server executes the payload, granting the attacker interactive command-line access. They then execute a script that overrides rail signals, locking the entire transit loop to red. Under normal conditions, this would cause citywide gridlock. The Threat Gauge spikes to Critical, reflecting the operational impact."

---

### Phase 3: Autonomous Isolation & Defense (03:30 - 04:30)
* **Visual Cues on Screen**: 
  - Transit Hub network segment turns **blue** (`ISOLATED`).
  - Attacker shell prints `Connection reset by peer` and fails to reconnect.
  - Transit signals are restored to normal operating states.
* **Automated Voice Announcement**: *"Mitigation active. Automated firewall rules deployed. Restoring railways signaling."*
* **Demonstrator Script**:
  > "Our defense systems identify the anomalous reverse shell. The inline firewall drops the active connection and automatically updates security rules to drop all traffic to the signal controller's web server. The Transit Hub node is isolated, and backup signal controllers automatically assume master state, clearing the red locks and resuming safe railway operations."

---

### Phase 4: Sanitization & Campaign Reset (04:30 - 05:00)
* **Visual Cues on Screen**: 
  - Attacker terminal cleans directory caches and deletes shell logs.
  - Map status transitions back to operational green.
* **Automated Voice Announcement**: *"Sanitization sequence initiated. Request logs rotated. Next campaign standby."*
* **Demonstrator Script**:
  > "Finally, the sanitization sequence executes. Directory file integrity checks are completed, malicious files are quarantined, and transit API endpoints are re-baselined for the next operation."

---

## 🏥 Scenario 3: Hospital ER Ransomware Lock
**Focus**: Phishing vectors, SMB service vulnerabilities, privilege escalation, and ransomware/cryptolocker payloads.

### Phase 0: Baseline Operations (00:00 - 01:00)
* **Visual Cues on Screen**: 
  - Hospital Wing node is healthy **green**.
  - SIEM logs verify active patient ER database lookups.
* **Automated Voice Announcement**: *"System baseline established. Hospital ER patient database active."*
* **Demonstrator Script**:
  > "Our third campaign focuses on the Hospital Emergency Room database. In the baseline phase, medical databases, HVAC systems, and telemetry monitors are fully operational. Medical staff are querying patient records over SMB shares with minimal latency."

---

### Phase 1: Reconnaissance & Phishing (01:00 - 02:15)
* **Visual Cues on Screen**: 
  - Attacker terminal runs an SMB port 445 scan.
  - Attacker launches a phishing email command: `python3 send_phish.py --target staff@hospital.local`.
  - The script prints `Backdoor shell established` as a receptionist opens the macro.
* **Automated Voice Announcement**: *"Threat warning. Phishing entry backdoor detected on receptionist terminal."*
* **Demonstrator Script**:
  > "During Phase 1, the attacker identifies port `445` exposed. They coordinate a targeted spear-phishing attack against hospital reception staff. A receptionist opens the malicious email attachment, triggering a document macro that connects back to the attacker's server, establishing a user-level backdoor shell."

---

### Phase 2: Subsystem Exploitation (02:15 - 03:30)
* **Visual Cues on Screen**: 
  - Attacker uploads `locker.exe` and runs it with privilege escalation flags.
  - Terminal logs output: `ENCRYPTING C:\\Users\\*\\Documents...` and `LOCKING HVAC VENTILATION SYSTEM REGISTERS`.
  - Hospital Wing node flashes **red**.
  - The Threat Gauge fills to maximum.
  - Live SIEM alerts print cryptolocker warning tags.
* **Automated Voice Announcement**: *"Critical breach alert. Cryptolocker ransomware execution detected. Database files encrypted."*
* **Demonstrator Script**:
  > "We enter Phase 2: Exploitation. The attacker escalates privileges and deploys a ransomware binary named `locker.exe`. The malware begins encrypting patient records and HVAC control shares. As the encryption spreads, the Hospital Wing node turns red. A digital ransom note is left on the system desktop. Patient telemetry is completely compromised, halting emergency room intakes."

---

### Phase 3: Autonomous Isolation & Defense (03:30 - 04:30)
* **Visual Cues on Screen**: 
  - Hospital Wing node shifts to **blue** (`ISOLATED`).
  - Active SMB sessions are dropped by the directory controllers.
  - Backups begin restoring the corrupted medical data.
* **Automated Voice Announcement**: *"Mitigation active. Automated subnet quarantine deployed. Restoring patient records from backup."*
* **Demonstrator Script**:
  > "The IDS flags the bulk file modification signature of the ransomware. The SOAR framework instantly triggers a subnet quarantine, isolating the Hospital Wing. Uninfected network segments remain safe, and system administrators initiate recovery scripts, restoring encrypted SQL databases from air-gapped backups to resume medical operations."

---

### Phase 4: Sanitization & Campaign Reset (04:30 - 05:00)
* **Visual Cues on Screen**: 
  - Terminal registers clean-up of phishing logs and Tor circuit closures.
  - Dashboard reports full recovery.
* **Automated Voice Announcement**: *"Sanitization sequence completed. Subnet disinfected. Threat campaign complete."*
* **Demonstrator Script**:
  > "In the final phase, the hospital endpoints are disinfected, the phishing entry vector is patched, and network integrity is re-established. This completes the simulated campaign loop, showing how automated defense mechanisms protect critical municipal services."

---

## 💡 Pro Presentation Tips

* **Use the Speed Controls**: Keep the speed at **1X** when explaining baseline states, and jump to **5X** or **10X** when waiting for the phase timers to count down.
* **Pause on Exploits**: Just as the timeline transitions to Phase 2 (Exploit), click **PAUSE** to discuss the specific ICS/SCADA or Web API exploit payload before resuming.
* **Check the AI Co-Pilot**: If you connect the dashboard to a local Ollama model instance (e.g., `gemma` or `llama3`), click the **ANALYZE** button to generate live, intelligent incident response recommendations for the audience.
