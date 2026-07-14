# Smart City Cyber Range: Interactive Presentation Guide & Script

Welcome to the interactive demonstration script for the **Smart City Cyber Range Simulation (Widescreen ICC Edition)**. This guide is tailored for presentations utilizing the **Interactive Prompts Mode**.

In this mode, the automated timeline is paused, allowing the presenter to guide the audience through a live, choose-your-own-adventure cybersecurity campaign. At each phase, the presenter polls the audience on what action to take next, enters their choice via a high-tech overlay modal, and shows the live visual and terminal updates.

---

## 🚀 Setup & Presentation Kick-Off

1. **Open the Cyber Range Dashboard** in your browser.
2. **Toggle ON the "INTERACTIVE PROMPTS" Checkbox** in the top HUD header.
   - *Presenter Note:* Verify that the "RESUME/PAUSE" button immediately locks to a greyed-out **PAUSED** state. This indicates that automatic timeline ticking is halted and manual operator intervention is now required.
3. **Introduce the Concept**:
   > "Welcome to the Integrated Command Center. Today, we are not just watching an automated simulation. You are the command operators. We have enabled Interactive Prompts, pausing the timeline. At each phase of our campaign, I will poll you—the audience—on our tactical decisions. Your choices will shape the attacker's path and our defense strategies in real-time."

---

## ⚡ Campaign 1: Power Grid Substation Compromise

### Phase 0: Baseline Operations
- **Action**: Click the **PHASE 0: BASELINE** button in the override panel.
- **Audience Poll**: *"Operators, which system baseline configuration should we establish for our power grid?"*
- **Choices**:
  1. **Option A: Standard SCADA Modbus Telemetry Loop**
     - *Visual Outcome:* The map lights up standard SCADA lines. Terminal monitors standard network pings to `192.168.42.50`.
     - *Presenter Script:* > "We've established standard Modbus loops. Telemetry is returning normal values of under 20 events per second."
  2. **Option B: High-Frequency Relay Status Monitoring**
     - *Visual Outcome:* Terminal runs rapid aggressive pings (`ping -i 0.2 -c 10`).
     - *Presenter Script:* > "We've initiated high-frequency relay polling. We are sampling telemetry at sub-second intervals to catch anomalous dips."
  3. **Option C: Encrypted VPN Tunnel Integrity Check**
     - *Visual Outcome:* Terminal audits TLS connections (`openssl s_client -connect 192.168.42.10:443`).
     - *Presenter Script:* > "We are verifying our cryptographical integrity, ensuring that telemetry routed to HQ is encrypted via safe TLS tunnels."

---

### Phase 1: Reconnaissance
- **Action**: Click the **PHASE 1: RECON** button in the override panel.
- **Audience Poll**: *"Our telemetry indicates pre-compromise activity. What type of attack vector should the adversary execute?"*
- **Choices**:
  1. **Option A: SSH Credential Brute-Force (Hydra)**
     - *Visual Outcome:* Terminal runs Nmap followed by a Hydra brute-force list sweep on port 22, finding credentials.
     - *Presenter Script:* > "The attacker targets the corporate gateway directly, running a credential stuffing attack. They've cracked the corporate SSH login."
  2. **Option B: Mass Port Sweep targeting Modbus Port 502**
     - *Visual Outcome:* Terminal runs `masscan -p502` to discover open SCADA controllers on the subnet.
     - *Presenter Script:* > "Instead of credentials, the attacker sweeps the IP block. They locate port 502 open, exposing the Modbus PLC relays directly."
  3. **Option C: Social Engineering Phishing to Corporate Staff**
     - *Visual Outcome:* Terminal starts a Gophish campaign targeting staff emails.
     - *Presenter Script:* > "The attacker bypasses firewalls using social engineering, harvesting credentials from a click on a spoofed update link."

---

### Phase 2: Subsystem Exploitation
- **Action**: Click the **PHASE 2: EXPLOIT** button in the override panel.
- **Audience Poll**: *"The perimeter is breached. Which exploit mechanism should be deployed to disrupt the grid?"*
- **Choices**:
  1. **Option A: PLC Modbus Relay Override (Trip Main Breaker)**
     - *Visual Outcome:* Terminal writes breaker registers using Metasploit. Substation Alpha turns RED, power lines stop flowing.
     - *Presenter Script:* > "The attacker overrides PLC coils directly. The residential district goes dark as the main breaker trips."
  2. **Option B: Buffer Overflow Exploit on Gateway Server**
     - *Visual Outcome:* Terminal executes gateway buffer overflow code (`exploit.py`), killing `modbus_server`.
     - *Presenter Script:* > "A memory corruption exploit kills the Modbus listening process, taking down grid synchronization utilities."
  3. **Option C: SCADA Registry Wipe & Config Deletion**
     - *Visual Outcome:* Terminal wipes local configurations. Map displays substation offline state.
     - *Presenter Script:* > "The attacker deletes configuration registries, leaving PLC components blind and unresponsive to command signals."

---

### Phase 3: Autonomous Isolation & Defense
- **Action**: Click the **PHASE 3: DEFENSE** button in the override panel.
- **Audience Poll**: *"We are experiencing a critical breach! How do we defend the system now?"*
- **Choices**:
  1. **Option A: SOAR Automated VLAN Isolation**
     - *Visual Outcome:* Telemetry link switches to blue. Attacker shell receives `Connection refused`. Map shows isolation status.
     - *Presenter Script:* > "The autonomous SOAR system has quarantined the SCADA VLAN, shutting off the threat vector while auxiliary power activates."
  2. **Option B: Deploy Decoy PLC Honeypots to Misdirect Traffic**
     - *Visual Outcome:* Terminal commands receive decoy responses. Map subtext displays `PLC_DECOY (HONEYPOT)`.
     - *Presenter Script:* > "We've spun up decoy PLC interfaces on the map. The attacker is writing fake registers on a honeypot while we patch the real system."
  3. **Option C: Revoke Corporate VPN Access & Rotate Keys**
     - *Visual Outcome:* Terminal session is severed. Map subtext displays `VPN_KEY_REVOKED`.
     - *Presenter Script:* > "We've revoked all active gateway certificates and rotated VPN tunnel keys, completely kicking the attacker out of the network."

---

### Phase 4: Sanitization & Campaign Reset
- **Action**: Click the **PHASE 4: CLEANSE** button in the override panel.
- **Audience Poll**: *"Threat contained. How should the security team conclude the incident response?"*
- **Choices**:
  1. **Option A: Clear Forensic Logs & Rotate Threat Indices**
     - *Visual Outcome:* Terminal clears system files. Map returns to green.
     - *Presenter Script:* > "We rotate system logs, clean active registry loops, and re-baseline telemetry for standard command center operations."
  2. **Option B: Restore PLC Firmware to Trusted Golden Image**
     - *Visual Outcome:* Terminal displays golden image firmware restoration logs.
     - *Presenter Script:* > "To ensure no persistent firmware backdoor exists, we re-flash the PLCs with our cryptographically signed golden image."
  3. **Option C: Ad-Hoc Firewall Hardening & Rule Audit**
     - *Visual Outcome:* Terminal locks outbound Modbus rules.
     - *Presenter Script:* > "We review access rules, add permanent firewall blocks on standard SCADA ports, and finalize our post-incident audit."

---

## 🚇 Campaign 2: Metro Transit Platform Signal Hijack

### Phase 0: Baseline Operations
- **Action**: Switch to Campaign 2, then click **PHASE 0: BASELINE**.
- **Audience Poll**: *"Operators, which Transit system baseline configuration should be initiated?"*
- **Choices**:
  1. **Option A: Metro Train Signaling Loop Status API**
     - *Visual Outcome:* Telemetry showing active train status API query checks.
  2. **Option B: Subway Rail Switch Status Telemetry Scan**
     - *Visual Outcome:* Scans verifying track switch hardware relays.
  3. **Option C: Central Platform CCTV Feed Integrity Audit**
     - *Visual Outcome:* Verifies platform video streams and storage networks.

---

### Phase 1: Reconnaissance
- **Action**: Click **PHASE 1: RECON**.
- **Audience Poll**: *"Adversary sweeps the transit network. What type of attack vector should be executed?"*
- **Choices**:
  1. **Option A: Web API Directory Discovery (Nikto Scan)**
     - *Visual Outcome:* Nikto scan probes HTTP directories, discovering insecure endpoint parameters.
  2. **Option B: Brute-force Transit Web Management Console**
     - *Visual Outcome:* Hydra brute-force targeting admin portal on port 80.
  3. **Option C: Phishing Transit Operator Credentials**
     - *Visual Outcome:* Phishing emails sent to train schedulers to harvest admin cookies.

---

### Phase 2: Subsystem Exploitation
- **Action**: Click **PHASE 2: EXPLOIT**.
- **Audience Poll**: *"Access gained. Which exploit mechanism should be deployed to freeze transit?"*
- **Choices**:
  1. **Option A: API Command Injection Shell (Lock Signals Red)**
     - *Visual Outcome:* Spawns reverse bash shell and executes signal lockout. Transit Hub node turns RED.
  2. **Option B: Reverse Shell Spawn via API Session Hijack**
     - *Visual Outcome:* Steals operator sessions and gains interactive command access.
  3. **Option C: Denial-of-Service Flood on Train Switch Relays**
     - *Visual Outcome:* HPing3 flooding signaling gateway, activating fail-safe emergency red signals.

---

### Phase 3: Autonomous Isolation & Defense
- **Action**: Click **PHASE 3: DEFENSE**.
- **Audience Poll**: *"Signals are frozen! How do we defend the system now?"*
- **Choices**:
  1. **Option A: Firewall Rules Quarantine of API Subnet**
     - *Visual Outcome:* Subnet isolated (blue). Attacker terminal shell connection drops.
  2. **Option B: Deploy Decoy API Endpoints (Honeypot Diversion)**
     - *Visual Outcome:* Diverts attacker shell scripts to fake sandbox backends.
  3. **Option C: Kill Session Tokens & Force Operator Logout**
     - *Visual Outcome:* Revokes administrative JWT tokens and terminates active remote sessions.

---

### Phase 4: Sanitization & Campaign Reset
- **Action**: Click **PHASE 4: CLEANSE**.
- **Audience Poll**: *"Incident resolved. How should the security team conclude the incident response?"*
- **Choices**:
  1. **Option A: Purge Web Shell History & Restart API Service**
     - *Visual Outcome:* Terminal sweeps history files and restarts web server nodes.
  2. **Option B: Restore API Servers from Backup Images**
     - *Visual Outcome:* Reverts signaling server VMs to clean system snapshots.
  3. **Option C: Patch API Endpoints & Enable JWT Verification**
     - *Visual Outcome:* Deploys patch code and activates validation filters.

---

## 🏥 Campaign 3: Hospital ER Ransomware Lock

### Phase 0: Baseline Operations
- **Action**: Switch to Campaign 3, then click **PHASE 0: BASELINE**.
- **Audience Poll**: *"Operators, which Hospital ER baseline configuration should be initiated?"*
- **Choices**:
  1. **Option A: Active Directory SMB Share Telemetry Loop**
     - *Visual Outcome:* Monitors ER database patient file shares.
  2. **Option B: Patient Telemetry Databases Health Scan**
     - *Visual Outcome:* Scans patient telemetry database response latencies.
  3. **Option C: HVAC System Environmental Registry Audit**
     - *Visual Outcome:* Reviews ventilation controls and server room temperature.

---

### Phase 1: Reconnaissance
- **Action**: Click **PHASE 1: RECON**.
- **Audience Poll**: *"Threat indicators alert us to active probes. What type of attack vector should be executed?"*
- **Choices**:
  1. **Option A: Spear-Phishing Attachment (Macro Delivery)**
     - *Visual Outcome:* Spoofed billing email sent to reception workstation, spawning macro shell.
  2. **Option B: Nmap SMB Vulnerability Discovery (EternalBlue Check)**
     - *Visual Outcome:* Scans subnet for MS17-010 EternalBlue vulnerability.
  3. **Option C: External Network Credential Stuffing Campaign**
     - *Visual Outcome:* Stuffing leaks against patient portal VPN interfaces.

---

### Phase 2: Subsystem Exploitation
- **Action**: Click **PHASE 2: EXPLOIT**.
- **Audience Poll**: *"Intruder has entered. Which exploit mechanism should be deployed to lock the facility?"*
- **Choices**:
  1. **Option A: Cryptolocker Ransomware (Encrypt Medical Databases)**
     - *Visual Outcome:* Uploads and runs `locker.exe`. Patient databases encrypted. Hospital node turns RED.
  2. **Option B: Privilege Escalation & Active Directory Takeover**
     - *Visual Outcome:* Bypasses local UAC controls to seize control of domain controller.
  3. **Option C: HVAC Ventilation Registers Shutdown & Lock**
     - *Visual Outcome:* Disables cooling loops to overheat server databases.

---

### Phase 3: Autonomous Isolation & Defense
- **Action**: Click **PHASE 3: DEFENSE**.
- **Audience Poll**: *"Systems encrypted! How do we defend the system now?"*
- **Choices**:
  1. **Option A: VLAN Isolation & SMB Firewall Quarantine**
     - *Visual Outcome:* Isolates ER network segment. Block port 445 globally.
  2. **Option B: Host Containment & Patient Database Isolation**
     - *Visual Outcome:* Shuts down database interface card and quarantines local endpoints.
  3. **Option C: AD Account Revocation & Access Policy Freeze**
     - *Visual Outcome:* Revokes credentials and freezes AD authentication loops.

---

### Phase 4: Sanitization & Campaign Reset
- **Action**: Click **PHASE 4: CLEANSE**.
- **Audience Poll**: *"Ransomware blocked. How should the security team conclude the incident response?"*
- **Choices**:
  1. **Option A: Wipe Ransomware residues & Harden SMB Ports**
     - *Visual Outcome:* Wipes executables, blocks ports, and returns map to operational green.
  2. **Option B: Restore Database Files from Offline Cold Storage**
     - *Visual Outcome:* Restores patient records from offline physical backups.
  3. **Option C: Patch MS17-010 Vulnerability on Workstations**
     - *Visual Outcome:* Installs security updates on all medical tablets.
