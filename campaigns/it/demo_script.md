# Enterprise IT Cyber Range Simulation: Demonstration Guide & Script

Welcome to the official demonstration guide and script for the **Enterprise IT Cyber Range Simulation (Widescreen ICC Edition)**. This document provides a step-by-step presentation script designed for student presenters. It covers the user interface layout, interaction controls, and a detailed walkthrough of all three simulation scenarios.

---

## 🖥️ Layout of the Integrated Command Center (ICC)

When presenting, orient the audience to the widescreen layout of the dashboard:
1. **Top HUD Header**: Contains the running status indicator, the currently active simulation phase, a real-time campaign cycle counter, cycle time elapsed, and phase countdown.
2. **Demonstration Controls (Header Right)**: 
   - **VOICE narration toggle & dropdown**: Selects the active voice engine (featuring high-quality sweet/natural voices).
   - **PAUSE / RESUME button**: Pauses the timeline to allow for detailed explanations.
   - **Speed controls (1X, 5X, 10X)**: Accelerates or slows down the timeline.
3. **Active Campaign Selector**: Located above Panel 1, allowing instant toggling between **Active Directory**, **Cloud Database**, and **Email Phishing** scenarios.
4. **Panel 1 // Threat Propagation System (Attacker Terminal)**: Displays the real-time execution of the attacker's CLI tools, scans, payloads, and terminal feedbacks.
5. **Panel 2 // Enterprise Network Topology (Map)**: An interactive SVG-based network topology showing node statuses (Green = operational, Orange = warning/recon, Red = compromised, Blue = isolated) and telemetry flows.
6. **Panel 3 // SIEM Events & Threat Deep Instrumentation**:
   - **Phase Override buttons**: Force-jumps the simulation to any of the 5 phases.
   - **Metrics panel**: Shows Events Per Second (EPS), Firewall Status, and Threat Level.
   - **Threat Gauge**: A radial meter showing real-time danger level.
   - **EPS History Chart**: A live line chart mapping the log stream intensity.
   - **Live SIEM Event Stream**: Scrollable feed showing raw IDS/IPS and firewall logs.
   - **AI Co-Pilot**: Interactive panel generating real-time tactical advice.

---

## ⚡ Scenario 1: Active Directory Domain Ransomware
**Focus**: Windows Enterprise Networks, Active Directory infrastructure, Kerberos Ticket Harvesting, and Domain Controller encryption.

### Phase 0: Baseline Operations (00:00 - 01:00)
* **Visual Cues on Screen**: 
  - Domain Controller and all network nodes are glowing **green** on the map.
  - Telemetry EPS is steady at 15–20.
  - Threat Level displays `NORMAL`.
  - Attacker terminal is idle, running ping sweeps to verify connection.
* **Automated Voice Announcement**: *"System baseline established. Enterprise Directory Services operating within normal parameters."*
* **Demonstrator Script**:
  > "Welcome to the Integrated Command Center. We are currently observing Campaign 1: Active Directory Domain Ransomware. In this baseline phase, the enterprise's corporate network and Active Directory domain are operating normally. Our telemetry indicators show a normal log rate of under twenty events per second, with firewall state showing active and secure. The central node, Domain Controller, is servicing logins and LDAP queries for workstation and server subnets, as shown by the flowing green lines on our telemetry grid map."

---

### Phase 1: Reconnaissance & Phishing (01:00 - 02:15)
* **Visual Cues on Screen**: 
  - Attacker terminal begins execution of `nmap` port scanning and `masscan` targeting directory shares port 445.
  - The path between `EXT_GATEWAY` and `CORP_HQ` turns **orange**, with animated flow pulses.
  - SIEM EPS spikes up to 40–50.
  - SIEM Live stream prints alerts like `IDS ALERT: TCP SYN Portscan detected targeting Domain Controller`.
* **Automated Voice Announcement**: *"Threat warning. Reconnaissance activity detected targeting primary Domain Controller."*
* **Demonstrator Script**:
  > "As we transition into Phase 1, our Threat Propagation System detects active reconnaissance. On the attacker terminal, we see an Nmap scan targeting Active Directory LDAP and SMB ports. The attacker locates port `445` open on the Domain Controller. They then execute a credential stuffing scan or ticket harvesting campaign. On the network grid, the link between the external gateway and Corporate HQ lights up orange, representing the threat vector. In the SIEM panel below, the log rate has climbed to 45 events per second, and alerts are flagging anomalous Kerberos TGT requests."

---

### Phase 2: Subsystem Exploitation (02:15 - 03:30)
* **Visual Cues on Screen**: 
  - The attacker terminal screen changes to **red** text, showing Kerberos ticket cracking and execution of Impacket PSExec.
  - Domain Controller node flashes red. The lines feeding logins to the Workstation LAN and Finance servers turn **red** and stop flowing.
  - The Threat Gauge fills to red (`CRITICAL`), and EPS jumps to 120+.
  - The SIEM feed overflows with NTDS.dit file lock alerts and domain authentication failures.
* **Automated Voice Announcement**: *"Critical breach alert. Active Directory database compromised. Enterprise network locked."*
* **Demonstrator Script**:
  > "We have reached Phase 2: Exploitation. The attacker has successfully cracked the harvested domain admin credentials and pivoted into the core Domain Controller. Using PSExec, they execute a malicious ransomware binary called locker.exe. The physical consequences are visible on our map: the Domain Controller has turned red, internal logins have stopped, and workstations are experiencing a complete AD lockout. The threat level is now critical, with event logs exceeding 120 per second as system-wide directory replication fails."

---

### Phase 3: Autonomous Isolation & Defense (03:30 - 04:30)
* **Visual Cues on Screen**: 
  - The link between `CORP_HQ` and `DOMAIN_CONTROLLER` turns **blue**, showing automated network containment.
  - Domain Controller's icon changes to blue (`ISOLATED`).
  - Attacker terminal prints `CONNECTION REFUSED - Active Directory subnet quarantined`.
  - Login telemetry slowly recovers back to green as auxiliary validation servers engage.
  - EPS starts dropping back to normal ranges.
* **Automated Voice Announcement**: *"Mitigation active. Automated domain containment triggered. Restoring directory databases."*
* **Demonstrator Script**:
  > "In response to the exploit, the Blue Team's autonomous SOAR orchestrator triggers. Within milliseconds of NTDS.dit lock detection, firewall rules are updated to quarantine the Active Directory subnet. The map shows the telemetry link switching to blue, indicating the infected Domain Controller is completely isolated. With the threat vector blocked, secondary controllers restore domain validation, bringing user logins back online while security teams prepare to restore the directory database."

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

## 🚇 Scenario 2: Cloud E-Commerce Database Exfiltration
**Focus**: Web Application vulnerabilities, SQL Injection queries, WAF rule containment, and data exfiltration.

### Phase 0: Baseline Operations (00:00 - 01:00)
* **Visual Cues on Screen**: 
  - API Gateway and Web Portal nodes are glowing **green**.
  - Event logs show normal customer transaction and database access telemetry.
* **Automated Voice Announcement**: *"System baseline established. E-Commerce API portal online."*
* **Demonstrator Script**:
  > "We are now viewing Campaign 2: Cloud E-Commerce Database Exfiltration. The web store and catalog APIs are operating normally. Customers are connecting, making search queries, and database query latencies are healthy."

---

### Phase 1: Reconnaissance & Scanning (01:00 - 02:15)
* **Visual Cues on Screen**: 
  - Attacker terminal runs `dirb` directory brute-forcing and `sqlmap` query parameters scans.
  - The path between `EXT_GATEWAY` and `API_GATEWAY` turns **orange**.
  - SIEM EPS spikes up to 40–50.
* **Automated Voice Announcement**: *"Threat warning. SQL scan activity detected targeting database API endpoints."*
* **Demonstrator Script**:
  > "In Phase 1, our monitoring detects database vulnerability scans. The attacker uses Sqlmap to locate injectable parameters on the web app. They identify `/api/v1/users` as vulnerable to SQL Injection, generating warnings in our SIEM log stream."

---

### Phase 2: SQLi Exfiltration (02:15 - 03:30)
* **Visual Cues on Screen**: 
  - Attacker terminal flashes red and prints database table dumps (emails, passwords, credit card rows).
  - Web Portal and Cloud Database nodes turn **red**.
  - Threat Gauge rises to `CRITICAL` (120+ EPS).
* **Automated Voice Announcement**: *"Critical breach alert. SQL Injection exploit successful. Customer databases compromised."*
* **Demonstrator Script**:
  > "Exploitation has occurred. The attacker injects SQL payloads to execute a schema dump. We see customer table columns (including email addresses and hashed passwords) streaming in plaintext on the attacker's console. The Web Portal and Cloud Database nodes glow red, indicating a major security breach and service disruption."

---

### Phase 3: WAF Block & Rate Limits (03:30 - 04:30)
* **Visual Cues on Screen**: 
  - The database connection link turns **blue** (`ISOLATED`).
  - Attacker terminal shows `CONNECTION BLOCKED - WAF active`.
  - Database access recovers as WAF rules drop bad queries.
* **Automated Voice Announcement**: *"Mitigation active. Automated WAF rules deployed. Restoring database services."*
* **Demonstrator Script**:
  > "Our WAF detects the SQL Injection patterns and triggers a SOAR response. The attacker's IP is blocked at the gateway level, severing the data stream. Automated parameterized code rules isolate bad queries, restoring database CPU loads and database services back to normal operation."

---

### Phase 4: Reset & Patch (04:30 - 05:00)
* **Visual Cues on Screen**: 
  - Attacker terminal cleans up its session caches.
  - Map nodes return to baseline green.
* **Automated Voice Announcement**: *"Sanitization sequence initiated. Request logs rotated. Next campaign standby."*
* **Demonstrator Script**:
  > "The incident is closed. Web APIs are patched to enforce parameterized queries, logs are archived, and threat index variables are reset. Let's move to Campaign 3."

---

## 🏥 Scenario 3: Corporate BEC Financial Fraud Campaign
**Focus**: Phishing attachments, MSHTML vulnerabilities, Outlook session cookie hijacking, and invoice fraud.

### Phase 0: Baseline Operations (00:00 - 01:00)
* **Visual Cues on Screen**: 
  - Mail Server and executive workstation nodes glow **green**.
  - Logs show secure SMTP email exchanges.
* **Automated Voice Announcement**: *"System baseline established. Corporate mail server SMTP gateway active."*
* **Demonstrator Script**:
  > "We are now viewing Campaign 3: Corporate BEC Financial Fraud. All corporate email servers, inbox routing policies, and executive consoles are operating securely."

---

### Phase 1: Phishing & Payload Run (01:00 - 02:15)
* **Visual Cues on Screen**: 
  - Attacker terminal runs phishing scripts and harvests session tokens.
  - The path between threat source and mail gateway turns **orange**.
* **Automated Voice Announcement**: *"Threat warning. Spear phishing attachment detected on executive terminal."*
* **Demonstrator Script**:
  > "The attacker executes a spear-phishing campaign. An email containing a malicious invoice attachment is opened by the CFO, triggering a remote code execution vulnerability (CVE-2021-40444). The attacker successfully establishes a shell connection back to their external command server."

---

### Phase 2: Session Hijack & Wire Fraud (02:15 - 03:30)
* **Visual Cues on Screen**: 
  - Attacker terminal runs Mimikatz and executes OWA session cookie injection.
  - Executive PC node turns **red**.
  - Threat Gauge hits `CRITICAL` (120+ EPS).
* **Automated Voice Announcement**: *"Critical breach alert. Session hijacking invoice fraud executed. Financial records exfiltrated."*
* **Demonstrator Script**:
  > "Exploitation is active. The attacker uses Mimikatz to extract Outlook Web Access session cookies, bypassing multi-factor authentication. They log in as the CFO, configure silent mail redirection rules, and send a fraudulent wire transfer request of $180,000 to the accounts payable team."

---

### Phase 3: Session Invalidation & AD Freeze (03:30 - 04:30)
* **Visual Cues on Screen**: 
  - The workstation link turns **blue** (`ISOLATED`).
  - Attacker terminal prints `SESSION TERMINATED - Account Revoked`.
  - Vitals stabilize.
* **Automated Voice Announcement**: *"Mitigation active. Automated session revocation deployed. Restoring backup systems."*
* **Demonstrator Script**:
  > "The anomalous mail forwarding and massive file exfiltration trigger a SOAR block. The CFO's Active Directory session credentials are instantly invalidated (REVOKED). The workstation is quarantined, severing the hacker's connection, while accounting teams are alerted to freeze the payment request."

---

### Phase 4: Re-imaging & Hardening (04:30 - 05:00)
* **Visual Cues on Screen**: 
  - Attacker terminal exits.
  - Dashboard nodes return to baseline green.
* **Automated Voice Announcement**: *"Sanitization sequence completed. Workstations disinfected. Threat campaign complete."*
* **Demonstrator Script**:
  > "In the recovery phase, the compromised workstation is re-imaged, MFA configurations are audited, SPF/DMARC filters are hardened, and logs are archived. The simulation loop is completed. Thank you for your attention."
