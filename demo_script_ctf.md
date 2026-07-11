# Smart City Cyber Range: Capture the Flag (CTF) Presentation Guide & Script

Welcome to the CTF demonstration script for the **Smart City Cyber Range Simulation (Widescreen ICC Edition)**. This guide is tailored for presenters who want to host a live, gamified audience hacking challenge.

In this mode, the presenter or selected audience operators must locate clues from the terminal, logs, or map interfaces and submit the correct flags to progress the simulation phases.

---

## 🚀 Setup & Launch

1. **Open the Cyber Range Dashboard** in your browser (`http://localhost:8000`).
2. **Toggle ON the "CTF MODE" Checkbox** in the top HUD header.
   * *Presenter Note:* Verify that the "PLAY/PAUSE" button immediately locks to **LOCKED** and the AI Co-Pilot block turns into the red **CTF CHALLENGE CONSOLE**.
3. **Orient the Audience**:
   > "Welcome to the Smart City Command Center. Today, our telemetry grid is under threat, and standard automatic monitoring is locked down. We have transitioned into CTF Mode. To defend the city and neutralize the adversaries, we must analyze active exploits, decrypt indicators of compromise, and submit key security flags to reclaim grid stability."

---

## ⚡ Campaign 1: Power Grid Substation Compromise
**Focus**: SCADA Telemetry, Modbus TCP exploitation, and SOAR VLAN quarantine.

### 🚩 Challenge 1: Network Port Scan Recon
* **Question Text**: *"The adversary has launched an initial scan targeting Substation Alpha. Identify the target IP address of Substation Alpha to proceed."*
* **Where to find clue**: Look at the header of Panel 1 (Attacker Terminal) displaying scope metadata, or check the logs.
* **Flag**: `192.168.42.50`
* **Score value**: 50 pts
* **Audience Script**:
  > "Operators, our firewalls have intercepted scanning packets. Look at the attacker terminal header or the network logs. What is the target IP address of Substation Alpha? Once we submit the IP as a flag, we will trigger telemetry alerts."

---

### 🚩 Challenge 2: PLC Breaker Override Exploit
* **Question Text**: *"Identify the Modbus register coil address tripped to shut down the power grid."*
* **Where to find clue**: Read Challenge 2 description or click the **HINT** button to reveal SCADA register guidelines.
* **Flag**: `40001`
* **Score value**: 100 pts
* **Audience Script**:
  > "The scan succeeded, and the attacker has bypassed the perimeter. They are overriding PLC registers using Metasploit. Look at the exploit description or think about SCADA Modbus coil layouts. What is the tripped registry address? Correct. Tripping register 40001 takes Substation Alpha offline."

---

### 🚩 Challenge 3: VLAN Containment & Isolation
* **Question Text**: *"Find the VLAN identifier that has been isolated to contain the threat."*
* **Where to find clue**: Once the blackout triggers, look at the isolated telemetry link on the map or read the defender isolation scripts.
* **Flag**: `VLAN_10`
* **Score value**: 150 pts
* **Audience Script**:
  > "The grid is down! We must isolate the compromised segments. Look at the network link connecting Corp-HQ and Substation Alpha on our telemetry grid map. It has changed to blue. What is the isolated VLAN ID? Entering VLAN_10 triggers the VLAN lock, sanitizes our grid, and recovers the sectors."

---

## 🚇 Campaign 2: Metro Transit Platform Signal Hijack
**Focus**: Web API discovery, JSON parameter injections, and session revocations.

### 🚩 Challenge 4: API Endpoint Discovery
* **Question Text**: *"Identify the scanning tool name used to discover unauthenticated REST API endpoints."*
* **Where to find clue**: Read the threat warning alerts or check the attacker's terminal scanning software name.
* **Flag**: `nikto`
* **Score value**: 50 pts
* **Audience Script**:
  > "We've toggled to the Transit campaign. The attacker is mapping platform API endpoints. Which automated web vulnerability scanner is printing logs on the attacker terminal? Yes, Nikto is probing our directory paths."

---

### 🚩 Challenge 5: Signal Hijack Command Injection
* **Question Text**: *"Identify the vulnerable endpoint base path (URL path) being targeted."*
* **Where to find clue**: Examine the console command or check the live logs showing target API paths.
* **Flag**: `/api/v1/signal`
* **Score value**: 100 pts
* **Audience Script**:
  > "The attacker has discovered a vulnerability. They are injecting signal override variables. Look at the live log feed or the terminal command. What URL path are they sending POST requests to? Correct, /api/v1/signal."

---

### 🚩 Challenge 6: VPN Certificate Revocation
* **Question Text**: *"What is the firewall certification status keyword applied to the attacker session?"*
* **Where to find clue**: Once mitigation engages in Phase 3, check the firewall rotate keys and certificate status output logs.
* **Flag**: `REVOKED`
* **Score value**: 150 pts
* **Audience Script**:
  > "The signals are locked to red! Our security team has rotated keys. What status has been assigned to the attacker's TLS/VPN session? It displays as REVOKED. Submitting this flag cuts off the attack pipeline."

---

## 🏥 Campaign 3: Hospital ER Ransomware Lock
**Focus**: SMB EternalBlue CVEs, Ransomware lock forensics, and backup recovery.

### 🚩 Challenge 7: ER SMB Vulnerability Scan
* **Question Text**: *"Identify the Microsoft security bulletin identifier or CVE ID of the EternalBlue SMB vulnerability exploited."*
* **Where to find clue**: Check the terminal scan for legacy SMB port leaks or read the hint.
* **Flag**: `CVE-2017-0144`
* **Score value**: 50 pts
* **Audience Script**:
  > "Adversaries are targeting the Hospital ER network. They locate port 445 open. Which CVE identifier matches the infamous EternalBlue vulnerability? It is CVE-2017-0144."

---

### 🚩 Challenge 8: Cryptolocker Ransomware Extension
* **Question Text**: *"What is the extension appended to the encrypted telemetry files?"*
* **Where to find clue**: Read the encryption alert logs in the SIEM feed or check the terminal output for locked files.
* **Flag**: `.cryptolocker`
* **Score value**: 100 pts
* **Audience Script**:
  > "The exploit payload has executed, locking our patient database. Look at the terminal file output list. What file extension is appended to the locked databases? The answer is .cryptolocker."

---

### 🚩 Challenge 9: Golden Image Firmware Recovery
* **Question Text**: *"Find the recovery target profile name used to re-flash compromised consoles."*
* **Where to find clue**: Watch the Phase 3 forensic restoration logs and identify the restore image key.
* **Flag**: `GOLDEN_IMAGE`
* **Score value**: 150 pts
* **Audience Script**:
  > "Our final task is to restore the hospital from backup shares. What target file image profile is incident response installing to reset console parameters? We are pulling the GOLDEN_IMAGE."

---

## 🏆 Campaign Completion & Victory
Once all three challenges in a campaign are solved:
1. The CTF Console will display: **🏆 CAMPAIGN SECURED!**
2. The simulation automatically transitions to Phase 4 (Sanitization & Campaign Reset).
3. The presenter can click `CAMP-02: TRANSIT SYSTEM` or `CAMP-03: HOSPITAL ER` at the top to select the next scenario and reset the challenge loop.
