import psutil
import json
import time
import os
import logging
import subprocess

# Critical system processes that should never be killed under any circumstances
INTERNAL_WHITELIST = {
    "explorer.exe", "wininit.exe", "services.exe", "lsass.exe", "winlogon.exe", 
    "csrss.exe", "smss.exe", "dwm.exe", "svchost.exe", "lsass.exe", 
    "csrss.exe", "smss.exe", "dwm.exe", "svchost.exe",
    "shellhost.exe", "searchhost.exe", "startmenuexperiencehost.exe",
    "taskmgr.exe", "systemsettings.exe", "python.exe", "antigravity.exe",
    "ctfmon.exe", "taskhostw.exe", "msmpeng.exe", "memcompression",
    "registry", "memory compression", "killswitch.exe", "killswitchdebug.exe"
}

class KillSwitchEngine:
    def __init__(self, config_path="config.json"):
        self.config_path = config_path
        self.load_config()
        self.logger = self.setup_logging()
        self.running = False
        self.stats = {"killed_count": 0, "ram_freed_mb": 0}
        self.last_check_time = 0
        self.termination_log = [] 

    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler("killswitch.log"),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger("KillSwitch")

    def load_config(self):
        try:
            with open(self.config_path, 'r') as f:
                self.config = json.load(f)
        except Exception as e:
            if hasattr(self, 'logger'):
                self.logger.error(f"Error loading config: {e}")
            self.config = {
                "cpu_threshold": 5.0,
                "ram_threshold_mb": 300,
                "whitelist": ["explorer.exe", "python.exe"],
                "blacklist": [],
                "auto_kill": False
            }

    def add_to_blacklist(self, proc_name):
        self.load_config() # Sync first
        if proc_name.lower() not in [b.lower() for b in self.config.get('blacklist', [])]:
            if 'blacklist' not in self.config:
                self.config['blacklist'] = []
            self.config['blacklist'].append(proc_name.lower())
            with open(self.config_path, 'w') as f:
                json.dump(self.config, f, indent=2)
            return True
        return False

    def is_coding(self):
        """Checks if any IDE process is currently running."""
        ide_list = [i.lower() for i in self.config.get('ide_processes', [])]
        if not ide_list:
            return False # Default to not coding if list is empty
            
        for proc in psutil.process_iter(['name']):
            try:
                if proc.info['name'].lower() in ide_list:
                    return True
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return False

    def is_system_process(self, proc):
        """Checks if a process is likely a system-level process that should be avoided."""
        try:
            # PID check first
            if proc.pid <= 4: # PIDs 0 and 4 are System/Idle
                return True
            
            # Username check (System or Service accounts)
            try:
                user = proc.username().lower()
            except psutil.AccessDenied:
                user = ""
                
            if "system" in user or "local service" in user or "network service" in user:
                return True
            
            # Name check against internal whitelist
            name = proc.name().lower()
            if name in INTERNAL_WHITELIST:
                return True
                
            return False
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            # If we don't have permission to query, we check the name anyway
            try:
                name = proc.name().lower()
                if name in INTERNAL_WHITELIST:
                    return True
            except:
                pass
            # ONLY return True if we really suspect it's system, otherwise let it pass for blacklisting/threshold checks
            return False 

    def get_processes_to_kill(self):
        targets = []
        blacklist = [b.lower() for b in self.config.get('blacklist', [])]
        whitelist = [w.lower() for w in self.config.get('whitelist', [])]
        lang_servers = [ls.lower() for ls in self.config.get('language_servers', [])]
        is_coding = self.is_coding()
        
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'username']):
            try:
                if self.is_system_process(proc):
                    continue
                    
                name = proc.info['name']
                name_lower = name.lower()
                
                if name_lower in whitelist:
                    continue
                
                cpu = proc.info.get('cpu_percent', 0.0)
                mem_info = proc.info.get('memory_info')
                if not mem_info:
                    continue
                mem_mb = mem_info.rss / (1024 * 1024)
                
                is_blacklisted = name_lower in blacklist or any(b in name_lower for b in blacklist if "." not in b)
                is_lang_server = name_lower in lang_servers
                
                if is_lang_server and not is_coding:
                    targets.append({"pid": proc.info['pid'], "name": name, "cpu": cpu, "mem": mem_mb, "type": "Language Server (Not Coding)"})
                elif is_blacklisted:
                    targets.append({"pid": proc.info['pid'], "name": name, "cpu": cpu, "mem": mem_mb, "type": "Blacklisted"})
                elif cpu > self.config['cpu_threshold'] or mem_mb > self.config['ram_threshold_mb']:
                    targets.append({"pid": proc.info['pid'], "name": name, "cpu": cpu, "mem": mem_mb, "type": "High Resource"})
                    
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return targets

    def kill_process(self, pid):
        try:
            proc = psutil.Process(pid)
            if self.is_system_process(proc):
                # Extra layer of safety
                return False

            mem = proc.memory_info().rss / (1024 * 1024)
            name = proc.name()
            
            result = subprocess.run(["taskkill", "/F", "/PID", str(pid), "/T"], capture_output=True, text=True)
            
            if result.returncode == 0:
                log_entry = {
                    "time": time.strftime("%H:%M:%S"),
                    "name": name,
                    "mem": f"{mem:.1f} MB",
                    "status": "Terminated"
                }
                self.termination_log.append(log_entry)
                if len(self.termination_log) > 50: self.termination_log.pop(0)

                self.stats["killed_count"] += 1
                self.stats["ram_freed_mb"] += mem
                self.logger.info(f"Terminated {name} (PID: {pid}) - Freed {mem:.1f} MB")
                return True
            else:
                # Silently fail for protected processes to avoid log spam
                if "Access is denied" in result.stderr:
                    return False
                self.logger.error(f"Taskkill failed for {name} ({pid}): {result.stderr}")
                return False
                
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            return False
        except Exception as e:
            self.logger.error(f"Failed to kill {pid}: {e}")
            return False

    def force_kill_language_servers(self):
        self.load_config()
        lang_servers = [ls.lower() for ls in self.config.get('language_servers', [])]
        # Many users whitelist the main Windows LS but still want manual control over it
        lang_servers.append("language_server_windows_x64.exe")
        
        killed_any = False
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                name = proc.info.get('name', '').lower()
                if name in lang_servers:
                    self.kill_process(proc.info['pid'])
                    killed_any = True
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return killed_any

    def run_sweep(self, execute_kills=None):
        self.load_config() 
        targets = self.get_processes_to_kill()
        
        do_kill = execute_kills if execute_kills is not None else self.config.get("auto_kill", False)
        
        if do_kill and targets:
            for target in targets:
                self.kill_process(target['pid'])
            return targets
        
        return targets
