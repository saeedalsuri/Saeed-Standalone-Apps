import psutil
import json
from engine import KillSwitchEngine

def diagnose():
    engine = KillSwitchEngine()
    print(f"Config lang_servers: {engine.config.get('language_servers', [])}")
    print(f"Is Coding? {engine.is_coding()}")
    
    for proc in psutil.process_iter(['pid', 'name', 'username']):
        try:
            name = proc.info['name']
            if "language" in name.lower() or "server" in name.lower():
                print(f"Found related process: {name} (PID: {proc.pid})")
                is_sys = engine.is_system_process(proc)
                print(f"  Is System? {is_sys}")
                if not is_sys:
                    name_lower = name.lower()
                    lang_servers = [ls.lower() for ls in engine.config.get('language_servers', [])]
                    print(f"  Is in lang_servers? {name_lower in lang_servers}")
        except:
            pass

if __name__ == "__main__":
    diagnose()
