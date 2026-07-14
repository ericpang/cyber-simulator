# Enterprise IT Cyber Range: Interactive Presentation Guide & Script

Welcome to the interactive demonstration script for the **Enterprise IT Cyber Range Simulation (Widescreen ICC Edition)**. This guide is tailored for presentations utilizing the **Interactive Prompts Mode**.

In this mode, the automated timeline is paused, allowing the presenter to guide the audience through a live, choose-your-own-adventure cybersecurity campaign. At each phase, the presenter polls the audience on what action to take next, enters their choice via a high-tech overlay modal, and shows the live visual and terminal updates.

---

## 🚀 Setup & Presentation Kick-Off

1. **Open the Cyber Range Dashboard** in your browser.
2. **Toggle ON the "INTERACTIVE PROMPTS" Checkbox** in the top HUD header.
   - *Presenter Note:* Verify that the "RESUME/PAUSE" button immediately locks to a greyed-out **PAUSED** state. This indicates that automatic timeline ticking is halted and manual operator intervention is now required.
3. **Introduce the Concept**:
   > "Welcome to the Integrated Command Center. Today, we are not just watching an automated simulation. You are the command operators. We have enabled Interactive Prompts, pausing the timeline. At each phase of our campaign, I will poll you—the audience—on our tactical decisions. Your choices will shape the attacker's path and our defense strategies in real-time."

---

## ⚡ Campaign 1: Active Directory Domain Ransomware

### Phase 0: Baseline Operations
- **Action**: Click the **PHASE 0: BASELINE** button in the override panel.
- **Audience Poll**: *"Operators, which system baseline configuration should we establish for our Active Directory?"*
- **Choices**:
  1. **Option A: Standard Active Directory Domain Telemetry**
     - *Visual Outcome:* The map lights up standard AD lines. Terminal monitors standard network pings to `192.168.20.100`.
     - *Presenter Script:* > "We've established standard AD LDAP loops. Telemetry is returning normal values of under 20 events per second."
  2. **Option B: High-Frequency RDP/SMB Logging Audit**
     - *Visual Outcome:* Terminal runs rapid aggressive pings (`ping -i 0.2 -c 10 192.168.20.100`).
     - *Presenter Script:* > "We've initiated high-frequency RDP logging. We are sampling telemetry at sub-second intervals to catch credentials brute-force attempts."
  3. **Option C: Internal Kerberos Ticket Auditing Check**
     - *Visual Outcome:* Terminal audits tickets status (`klist`).
     - *Presenter Script:* > "We are verifying our ticket-granting tickets, ensuring that Kerberos authentication tokens are valid and secure."

---

### Phase 1: Reconnaissance
- **Action**: Click the **PHASE 1: RECON** button in the override panel.
- **Audience Poll**: *"Our security alerts indicate pre-compromise activity. What type of attack vector should the adversary execute?"*
- **Choices**:
  1. **Option A: Domain Controller SMB Port Scan (445)**
     - *Visual Outcome:* Terminal runs masscan to discover open SMB ports on the domain subnet.
     - *Presenter Script:* > "The attacker targets port 445 directly, looking for active directories and SMB shares open to the WAN."
  2. **Option B: Kerberoasting & Ticket Harvesting**
     - *Visual Outcome:* Terminal extracts and cracks Service Account ticket hashes from memory using Hashcat.
     - *Presenter Script:* > "Instead of port scanning, the attacker runs a Kerberoasting script to harvest service ticket hashes for offline cracking."
  3. **Option C: Spear-Phishing to IT Admin Staff**
     - *Visual Outcome:* Terminal starts a Gophish campaign targeting sysadmin email addresses.
     - *Presenter Script:* > "The attacker sends a crafted administrator update request, harvesting login credentials directly from a clicked link."

---

### Phase 2: Subsystem Exploitation
- **Action**: Click the **PHASE 2: EXPLOIT** button in the override panel.
- **Audience Poll**: *"The domain administrator credentials are cracked. Which exploit mechanism should be deployed to lock down the directory?"*
- **Choices**:
  1. **Option A: Cryptolocker Ransomware (Lock AD Database)**
     - *Visual Outcome:* Terminal logs into DC via PSExec, deletes volume shadows, and encrypts NTDS.dit. DC turns RED, internal logins fail.
     - *Presenter Script:* > "The attacker runs locker.exe. The entire corporate directory goes dark as the NTDS database is encrypted."
  2. **Option B: Pass-the-Hash Domain Admin Compromise**
     - *Visual Outcome:* Terminal logs in using hijacked hashes (`psexec.py administrator`).
     - *Presenter Script:* > "The attacker authenticates directly to the Domain Controller using admin hashes, seizing root directory control."
  3. **Option C: Domain Controller GPO Policy Hijack**
     - *Visual Outcome:* Terminal overwrites group policies. Map displays locked state.
     - *Presenter Script:* > "The attacker modifies group policies, pushing rogue scripts to block internal logins and lockout IT admin terminals."

---

### Phase 3: Autonomous Isolation & Defense
- **Action**: Click the **PHASE 3: DEFENSE** button in the override panel.
- **Audience Poll**: *"Active Directory is compromised! How do we defend the system now?"*
- **Choices**:
  1. **Option A: SOAR Automated Domain Controller VLAN Isolation**
     - *Visual Outcome:* Telemetry link switches to blue. Attacker shell receives `Connection refused`. Map shows VLAN isolated status.
     - *Presenter Script:* > "The autonomous SOAR system has quarantined the primary Domain Controller VLAN 20, cutting off the attacker's shell."
  2. **Option B: Deploy AD Honeypot Decoys & Sinkhole Traffic**
     - *Visual Outcome:* Terminal commands receive decoy responses. Map subtext displays `DOMAIN_DECOY (HONEYPOT)`.
     - *Presenter Script:* > "We've spun up decoy directory servers on the map. The attacker is interacting with a honeypot while we restore the real database."
  3. **Option C: Revoke Compromised Domain Admin Accounts**
     - *Visual Outcome:* Terminal session is severed. Map subtext displays `AD_KEY_REVOKED`.
     - *Presenter Script:* > "We've disabled compromised administrator logins and rotated Kerberos keys, kicking the attacker out of our directories."

---

### Phase 4: Sanitization & Campaign Reset
- **Action**: Click the **PHASE 4: CLEANSE** button in the override panel.
- **Audience Poll**: *"Threat contained. How should the security team conclude the incident response?"*
- **Choices**:
  1. **Option A: Clear Forensic Logs & Rotate Threat Indices**
     - *Visual Outcome:* Terminal clears temporary directory logs. Map returns to green.
     - *Presenter Script:* > "We rotate logs, purge temporary memory artifacts, and restore directory services baseline settings."
  2. **Option B: Restore NTDS Database from Offline Backup**
     - *Visual Outcome:* Terminal displays offline NTDS backup restoration logs.
     - *Presenter Script:* > "We restore the Active Directory database from a secure, clean offline backup copy to ensure data integrity."
  3. **Option C: Enforce Multi-Factor Authentication (MFA)**
     - *Visual Outcome:* Terminal disables NTLM and enforces strict MFA controls.
     - *Presenter Script:* > "We harden access rules, disable insecure legacy NTLM protocols, and enforce MFA for all domain administrators."

---

## 🚇 Campaign 2: Cloud E-Commerce Database Exfiltration

### Phase 0: Baseline Operations
- **Action**: Click the **PHASE 0: BASELINE** button in the override panel.
- **Audience Poll**: *"Operators, which E-Commerce baseline configuration should we establish?"*
- **Choices**:
  1. **Option A: E-Commerce Web Portal Traffic Monitor**
     - *Visual Outcome:* Map shows healthy API calls. Terminal monitors web portal access.
  2. **Option B: Cloud Database Query Latency Scan**
     - *Visual Outcome:* Terminal runs SQL latency checks.
  3. **Option C: Edge Content Delivery Network (CDN) Audit**
     - *Visual Outcome:* Terminal verifies TLS edge caches.

---

### Phase 1: Reconnaissance
- **Action**: Click the **PHASE 1: RECON** button in the override panel.
- **Audience Poll**: *"Traffic audits show scanning. What tool should the hacker run to locate vulnerabilities?"*
- **Choices**:
  1. **Option A: SQL Injection Vulnerability Scanner (sqlmap)**
     - *Visual Outcome:* Terminal scans endpoints with Sqlmap, finding an injectable parameter.
  2. **Option B: Web Directory Brute-Force (dirb)**
     - *Visual Outcome:* Terminal runs Dirb to map unauthenticated API folders.
  3. **Option C: Credential Stuffing on Customer Login**
     - *Visual Outcome:* Terminal runs credential stuffing tools against login forms.

---

### Phase 2: Subsystem Exploitation
- **Action**: Click the **PHASE 2: EXPLOIT** button in the override panel.
- **Audience Poll**: *"A SQL vulnerability is confirmed. What mechanism should be used to compromise the server?"*
- **Choices**:
  1. **Option A: SQL Injection Schema Exfiltration (UNION Select)**
     - *Visual Outcome:* Sqlmap dumps customer data tables. Portal and Database turn RED.
  2. **Option B: Remote Command Execution (RCE) via File Upload**
     - *Visual Outcome:* Attacker uploads PHP web shell and runs command shells.
  3. **Option C: API Query Denial of Service (Database Lockout)**
     - *Visual Outcome:* Complex sleeping queries saturate connection pools, locking database.

---

### Phase 3: Autonomous Isolation & Defense
- **Action**: Click the **PHASE 3: DEFENSE** button in the override panel.
- **Audience Poll**: *"Customer records are leaking! How do we contain the breach?"*
- **Choices**:
  1. **Option A: WAF Rule Block & API Subnet Quarantine**
     - *Visual Outcome:* Connection to attacker drops. Map link turns blue.
  2. **Option B: Deploy Decoy SQL API Endpoint Honeypot**
     - *Visual Outcome:* Payloads redirected to a simulated mock container.
  3. **Option C: Invalidate Session JWTs & Enable API Rate Limits**
     - *Visual Outcome:* Compromised session tokens are revoked and rate limits enabled.

---

### Phase 4: Sanitization & Campaign Reset
- **Action**: Click the **PHASE 4: CLEANSE** button in the override panel.
- **Audience Poll**: *"Threat blocked. What post-incident response action should we run?"*
- **Choices**:
  1. **Option A: Purge Web Shell Registry & Audit WAF Logs**
     - *Visual Outcome:* Deletes shell files, rotates secrets, and audits logs.
  2. **Option B: Restore SQL Database from AWS Cloud Backup**
     - *Visual Outcome:* Spins up clean snapshot copies of database.
  3. **Option C: Patch SQL Injection & Implement Parameterized Queries**
     - *Visual Outcome:* Rewrites SQL queries to parameterize input variables.

---

## 🏥 Campaign 3: Corporate BEC Financial Fraud Campaign

### Phase 0: Baseline Operations
- **Action**: Click the **PHASE 0: BASELINE** button in the override panel.
- **Audience Poll**: *"Operators, which Mail Gateway baseline checks should we start?"*
- **Choices**:
  1. **Option A: Corporate Mail Server Telemetry Loop**
     - *Visual Outcome:* Monitors SMTP logs.
  2. **Option B: Executive Workstation Endpoint Audit**
     - *Visual Outcome:* Verifies CFO workstation status.
  3. **Option C: External Secure Email Gateway Integrity Scan**
     - *Visual Outcome:* Audits SPF/DKIM filter records.

---

### Phase 1: Reconnaissance
- **Action**: Click the **PHASE 1: RECON** button in the override panel.
- **Audience Poll**: *"The threat gateway is sending mail. What attack path should be executed?"*
- **Choices**:
  1. **Option A: Spear-Phishing Campaign (Macro Attachment)**
     - *Visual Outcome:* Delivers an invoice email. Recipient triggers MSHTML exploit (`CVE-2021-40444`), spawning shell.
  2. **Option B: OAuth Session Hijack & Token Exfiltration**
     - *Visual Outcome:* Prompts user to authorize a rogue third-party O365 API application.
  3. **Option C: Credential Stuffing targeting OWA Portal**
     - *Visual Outcome:* Sweeps the Outlook Web Access login forms using employee credential leaks.

---

### Phase 2: Subsystem Exploitation
- **Action**: Click the **PHASE 2: EXPLOIT** button in the override panel.
- **Audience Poll**: *"workstation access is achieved. What action should be executed to commit fraud?"*
- **Choices**:
  1. **Option A: Ransomware Delivery & Executive Lockout**
     - *Visual Outcome:* Executes locker.exe on executive PC, locking files with `.cryptolocker`.
  2. **Option B: Session Hijack & Invoice Fraud Execution**
     - *Visual Outcome:* Dumps OWA session cookies and sends an unauthorized bank transfer request.
  3. **Option C: Mail Forwarding Rules Setup & Exfiltration**
     - *Visual Outcome:* Creates forwarding rules to send CFO mail folders to hacker inbox.

---

### Phase 3: Autonomous Isolation & Defense
- **Action**: Click the **PHASE 3: DEFENSE** button in the override panel.
- **Audience Poll**: *"Financial data is compromised! How do we isolate the threat?"*
- **Choices**:
  1. **Option A: Workstation Endpoint Containment & SMB Block**
     - *Visual Outcome:* Quarantines workstation PC on map. Link turns blue.
  2. **Option B: Host Quarantine & Session Invalidation**
     - *Visual Outcome:* CFO session JWT credentials invalidated immediately.
  3. **Option C: Revoke Email Session Certificates & Account Freeze**
     - *Visual Outcome:* Revokes AD session, blocking outbound OWA SMTP queries.

---

### Phase 4: Sanitization & Campaign Reset
- **Action**: Click the **PHASE 4: CLEANSE** button in the override panel.
- **Audience Poll**: *"Incident resolved. How should we conclude the incident cleanup?"*
- **Choices**:
  1. **Option A: Purge Malicious Forwarding Rules & Harden Email Ports**
     - *Visual Outcome:* Cleans OWA rules, rotates passwords, and audits SMTP.
  2. **Option B: Restore Executive Workstation from Clean Image**
     - *Visual Outcome:* Re-images workstation operating system using golden images.
  3. **Option C: Implement Phishing Filtering & SPF/DKIM Updates**
     - *Visual Outcome:* Hardens spam filters and registers new SPF/DKIM keys in DNS.
