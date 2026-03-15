from engine import KillSwitchEngine
import psutil

engine = KillSwitchEngine()

blacklist = [b.lower() for b in engine.config.get('blacklist', [])]
whitelist = [w.lower() for w in engine.config.get('whitelist', [])]
lang_servers = [ls.lower() for ls in engine.config.get('language_servers', [])]
is_coding = engine.is_coding()

print(f"Blacklist: {len(blacklist)}")
print(f"Whitelist: {len(whitelist)}")
print(f"Is Coding: {is_coding}")

targets = engine.get_processes_to_kill()
print(f"Targets found: len={len(targets)}")
print(targets)

for proc in psutil.process_iter(['pid', 'name']):
    try:
        p_name = proc.info.get("name", "").lower()
        if p_name in blacklist:
            print(f"Found blacklisted: {p_name} (PID: {proc.info['pid']})")
            if engine.is_system_process(proc):
                print(f"  -> But is_system_process returned True!")
            else:
                print(f"  -> is_system_process returned False. Why wasn't it in targets?")
    except:
        pass
