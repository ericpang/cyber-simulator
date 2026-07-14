# Enterprise IT Cyber Range: Capture the Flag (CTF) Presentation Guide & Script

Welcome to the CTF demonstration script for the **Enterprise IT Cyber Range Simulation (Widescreen ICC Edition)**. This guide is tailored for presenters who want to host a live, gamified audience hacking challenge.

In this mode, the presenter or selected audience operators must locate clues from the terminal, logs, or map interfaces and submit the correct flags to progress the simulation phases.

---

## 🚀 Setup & Launch

1. **Open the Cyber Range Dashboard** in your browser (`http://localhost:8000`).
2. **Toggle ON the "CTF MODE" Checkbox** in the top HUD header.
   * *Presenter Note:* Verify that the "PLAY/PAUSE" button immediately locks to **LOCKED** and the AI Co-Pilot block turns into the red **CTF CHALLENGE CONSOLE**.
3. **Orient the Audience**:
   > "Welcome to the Corporate Command Center. Today, our telemetry grid is under threat, and standard automatic monitoring is locked down. We have transitioned into CTF Mode. To defend our enterprise networks and neutralize the hackers, we must analyze active exploits, decrypt indicators of compromise, and submit key security flags to reclaim network stability."

---

## ⚡ Campaign 1: Active Directory Domain Ransomware
**Focus**: Windows Directory Services, Kerberos ticket extraction, and SOAR subnet quarantine.

### 🚩 Challenge 1: AD Scan Discovery
* **Question Text**: *"The adversary has launched an initial scan targeting the Domain Controller. Check the threat warning or network details. Identify the target IP address of the Domain Controller to establish connection details."*
* **Where to find clue**: Look at the header of Panel 1 (Attacker Terminal) displaying scope metadata, or check the logs.
* **Flag**: `192.168.20.100`
* **Score value**: 50 pts
* **Audience Script**:
  > "Operators, our firewalls have intercepted scanning packets. Look at the attacker terminal header or the network logs. What is the target IP address of the Domain Controller? Once we submit the IP as a flag, we will trigger telemetry alerts."

---

### 🚩 Challenge 2: AD Database Encryption
* **Question Text**: *"The attacker has pivoted into the AD network and triggered a ransomware macro script. Identify the target Active Directory database file name being encrypted."*
* **Where to find clue**: Read Challenge 2 description or click the **HINT** button to check directory database file name guidelines.
* **Flag**: `NTDS.dit`
* **Score value**: 100 pts
* **Audience Script**:
  > "The scan succeeded, and the attacker has bypassed the perimeter. They cracked credentials and logged into the Domain Controller. They are deleting shadow copies and encrypting the Active Directory database. Look at the exploit description or think about Windows AD files. What is the database file name? Correct. Encrypting NTDS.dit locks down all domain logins."

---

### 🚩 Challenge 3: VLAN Containment & Isolation
* **Question Text**: *"Find the VLAN identifier that has been isolated to contain the threat."*
* **Where to find clue**: Once the lockout triggers, look at the isolated telemetry link on the map or read the defender isolation scripts.
* **Flag**: `VLAN_20`
* **Score value**: 150 pts
* **Audience Script**:
  > "The AD server is down! We must isolate the compromised segments. Look at the network link connecting Corp-HQ and the Domain Controller on our map. It has changed to blue. What is the isolated VLAN ID? Entering VLAN_20 triggers the VLAN lock, quarantines the controller, and recovers auxiliary systems."

---

## 🚇 Campaign 2: Cloud E-Commerce Database Exfiltration
**Focus**: Web vulnerability scanning, SQL Injections, and WAF containment rules.

### 🚩 Challenge 4: SQL Scanner Discovery
* **Question Text**: *"Identify the scanning tool name used to discover SQL injection flaws."*
* **Where to find clue**: Read the threat warning alerts or check the attacker's terminal scanning software name.
* **Flag**: `sqlmap`
* **Score value**: 50 pts
* **Audience Script**:
  > "We've toggled to the E-Commerce campaign. The attacker is scanning dynamic query parameters. Which automated SQL injection scanner is printing logs on the attacker terminal? Yes, Sqlmap is probing our database endpoints."

---

### 🚩 Challenge 5: SQLi Target Endpoint
* **Question Text**: *"Identify the vulnerable endpoint path being targeted."*
* **Where to find clue**: Examine the console command or check the live logs showing target API paths.
* **Flag**: `/api/v1/users`
* **Score value**: 100 pts
* **Audience Script**:
  > "The attacker has discovered a vulnerability. They are sending SQL exfiltration parameters. Look at the live log feed or the terminal command. What URL path are they sending requests to? Correct, /api/v1/users."

---

### 🚩 Challenge 6: WAF Response Action
* **Question Text**: *"What is the firewall status keyword applied to the attacker session?"*
* **Where to find clue**: Once mitigation engages in Phase 3, check the WAF rule logs and session blocking outputs.
* **Flag**: `BLOCKED`
* **Score value**: 150 pts
* **Audience Script**:
  > "Customer records are leaking! Our security team has updated Web Application Firewall policies. What status has been assigned to the attacker's IP? It displays as BLOCKED. Submitting this flag cuts off the attack pipeline."

---

## 🏥 Campaign 3: Corporate BEC Financial Fraud Campaign
**Focus**: Spearfishing RCEs, email credentials theft, and account revocations.

### 🚩 Challenge 7: MS HTML Vulnerability Scan
* **Question Text**: *"Identify the CVE identifier of this exploit."*
* **Where to find clue**: Check the terminal scan for MSHTML browser vulnerability tags or read the hint.
* **Flag**: `CVE-2021-40444`
* **Score value**: 50 pts
* **Audience Script**:
  > "Adversaries are targeting our executive staff. The CFO opened a phishing email containing a docx attachment. Which CVE identifier matches this MSHTML vulnerability? It is CVE-2021-40444."

---

### 🚩 Challenge 8: Phishing Payload Extension
* **Question Text**: *"What is the extension appended to the encrypted accounting document copies?"*
* **Where to find clue**: Read the encryption alert logs in the SIEM feed or check the terminal output for locked files.
* **Flag**: `.cryptolocker`
* **Score value**: 100 pts
* **Audience Script**:
  > "Workstations are infected and files are locked. What extension is appended to the encrypted accounting spreadsheets on the attacker's terminal? That's right, it is .cryptolocker."

---

### 🚩 Challenge 9: Account Revocation & Freeze
* **Question Text**: *"What is the active directory credential status applied to the executive session?"*
* **Where to find clue**: Check the restoration logs or status indicators in Phase 3.
* **Flag**: `REVOKED`
* **Score value**: 150 pts
* **Audience Script**:
  > "The hacker has hijacked email sessions and sent a fraudulent invoice. Our security team has disabled the CFO credentials. What active directory status is displayed? Yes, it is REVOKED. Submitting this flag finishes the recovery sequence!"
