import tkinter as tk
from tkinter import ttk, messagebox
import threading
import time
import json
from engine import KillSwitchEngine
import os

class KillSwitchGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("KillSwitch - Advanced Resource Manager")
        self.root.geometry("750x450")
        self.root.minsize(700, 400)
        self.root.configure(bg="#1e1e1e")
        
        self.engine = KillSwitchEngine()
        self.setup_styles()
        self.create_widgets()
        
        self.running = False
        self.update_stats()

    def setup_styles(self):
        self.style = ttk.Style()
        self.style.theme_use('clam')
        self.style.configure("Treeview", background="#2d2d2d", foreground="white", fieldbackground="#2d2d2d", borderwidth=0)
        self.style.map("Treeview", background=[('selected', '#3d3d3d')])
        self.style.configure("TButton", padding=6, relief="flat", background="#007acc", foreground="white")
        self.style.configure("TLabel", background="#1e1e1e", foreground="white", font=("Segoe UI", 10))
        self.style.configure("Header.TLabel", font=("Segoe UI", 14, "bold"))

    def create_widgets(self):
        # Header
        header_frame = tk.Frame(self.root, bg="#1e1e1e", padx=20, pady=10)
        header_frame.pack(fill="x")
        
        ttk.Label(header_frame, text="KillSwitch Dashboard", style="Header.TLabel").pack(side="left")
        
        self.status_label = ttk.Label(header_frame, text="Status: Idle", foreground="#aaaaaa")
        self.status_label.pack(side="right")

        # Controls
        controls_frame = tk.Frame(self.root, bg="#1e1e1e", padx=20, pady=10)
        controls_frame.pack(fill="x")
        
        # Left side buttons
        btn_frame = tk.Frame(controls_frame, bg="#1e1e1e")
        btn_frame.pack(side="left", fill="x", expand=True)
        
        self.scan_btn = ttk.Button(btn_frame, text="Scan", command=self.start_scan, width=10)
        self.scan_btn.pack(side="left", padx=2)
        
        self.kill_btn = ttk.Button(btn_frame, text="Kill", command=self.kill_selected, width=10)
        self.kill_btn.pack(side="left", padx=2)
        
        self.black_btn = ttk.Button(btn_frame, text="Blacklist", command=self.add_selected_to_blacklist, width=10)
        self.black_btn.pack(side="left", padx=2)

        self.taskmgr_btn = ttk.Button(btn_frame, text="TaskMgr", command=self.open_taskmgr, width=10)
        self.taskmgr_btn.pack(side="left", padx=2)
        
        self.kill_ls_btn = ttk.Button(btn_frame, text="Kill LS", command=self.kill_lang_servers, width=10)
        self.kill_ls_btn.pack(side="left", padx=2)
        
        self.auto_toggle = tk.BooleanVar(value=self.engine.config.get("auto_kill", False))
        tk.Checkbutton(controls_frame, text="Auto-Kill Mode", variable=self.auto_toggle, 
                       command=self.toggle_auto, bg="#1e1e1e", fg="white", selectcolor="#2d2d2d", activebackground="#1e1e1e", activeforeground="white").pack(side="right")

        # Stats Frame
        stats_frame = tk.Frame(self.root, bg="#252526", padx=20, pady=10)
        stats_frame.pack(fill="x", padx=10, pady=5)
        
        self.ram_freed_label = ttk.Label(stats_frame, text="RAM Freed: 0 MB")
        self.ram_freed_label.pack(side="left", padx=10)
        
        self.killed_label = ttk.Label(stats_frame, text="Processes Killed: 0")
        self.killed_label.pack(side="left", padx=10)

        # Main Paned Window for List and Log
        self.paned = ttk.PanedWindow(self.root, orient=tk.VERTICAL)
        self.paned.pack(fill="both", expand=True, padx=10, pady=5)

        # Process List (Targets)
        list_frame = tk.Frame(self.paned, bg="#1e1e1e")
        self.paned.add(list_frame, weight=3)
        
        ttk.Label(list_frame, text="Active Targets (Detected)", font=("Segoe UI", 9, "bold")).pack(anchor="w")
        self.tree = ttk.Treeview(list_frame, columns=("Name", "Type", "CPU %", "RAM (MB)"), show='headings')
        self.tree.heading("Name", text="Process Name")
        self.tree.heading("Type", text="Identification")
        self.tree.heading("CPU %", text="CPU Usage %")
        self.tree.heading("RAM (MB)", text="Memory Usage")
        self.tree.column("Type", width=120)
        self.tree.pack(fill="both", expand=True)
        
        # Tags for coloring
        self.tree.tag_configure('Blacklisted', foreground='#ff5555')
        self.tree.tag_configure('High Resource', foreground='#f1fa8c')

        # Activity Log (History)
        log_frame = tk.Frame(self.paned, bg="#1e1e1e")
        self.paned.add(log_frame, weight=1)
        
        ttk.Label(log_frame, text="Activity Log (Recent Kills)", font=("Segoe UI", 9, "bold")).pack(anchor="w")
        self.log_tree = ttk.Treeview(log_frame, columns=("Time", "Name", "Memory", "Status"), show='headings')
        self.log_tree.heading("Time", text="Time")
        self.log_tree.heading("Name", text="Process")
        self.log_tree.heading("Memory", text="RAM Freed")
        self.log_tree.heading("Status", text="Status")
        self.log_tree.column("Time", width=80)
        self.log_tree.column("Status", width=100)
        self.log_tree.pack(fill="both", expand=True)

    def open_taskmgr(self):
        import subprocess
        subprocess.Popen("taskmgr", shell=True)
        
    def kill_lang_servers(self):
        if self.engine.force_kill_language_servers():
            messagebox.showinfo("Success", "Language servers have been forcefully terminated.")
            self.start_scan() # Refresh the view
        else:
            messagebox.showinfo("Status", "No language servers were found running.")

    def toggle_auto(self):
        self.engine.config["auto_kill"] = self.auto_toggle.get()
        with open("config.json", 'w') as f:
            json.dump(self.engine.config, f, indent=2)
        messagebox.showinfo("Auto-Kill", f"Auto-Kill mode is now {'On' if self.auto_toggle.get() else 'Off'}")

    def update_stats(self):
        self.ram_freed_label.config(text=f"RAM Freed: {self.engine.stats['ram_freed_mb']:.1f} MB")
        self.killed_label.config(text=f"Processes Killed: {self.engine.stats['killed_count']}")
        
        # Sync Activity Log
        current_log_items = [self.log_tree.item(i)['values'] for i in self.log_tree.get_children()]
        for entry in self.engine.termination_log:
            entry_vals = [entry['time'], entry['name'], entry['mem'], entry['status']]
            if entry_vals not in current_log_items:
                self.log_tree.insert("", 0, values=entry_vals)
                # Keep log clean
                if len(self.log_tree.get_children()) > 20:
                    self.log_tree.delete(self.log_tree.get_children()[-1])

        # Background Auto-Kill Logic
        if self.auto_toggle.get():
            current_time = time.time()
            interval = self.engine.config.get("check_interval_seconds", 60)
            if current_time - self.engine.last_check_time > interval:
                self.engine.last_check_time = current_time
                self.start_auto_cycle()

        self.root.after(1000, self.update_stats)

    def start_auto_cycle(self):
        self.status_label.config(text="Status: Detecting...", foreground="#ffcb6b")
        threading.Thread(target=self.run_auto_sequence, daemon=True).start()

    def run_auto_sequence(self):
        # 1. Detect (Scan without killing)
        targets = self.engine.run_sweep(execute_kills=False)
        self.root.after(0, lambda: self.update_tree(targets))
        
        if targets:
            # 2. Display them for a moment (the "Before")
            self.root.after(0, lambda: self.status_label.config(text=f"Status: Found {len(targets)} targets. Killing...", foreground="#ff5555"))
            time.sleep(3) # Wait 3 seconds so user sees them
            
            # 3. Kill them
            self.engine.run_sweep(execute_kills=True)
            
            # 4. Clear list (the "After")
            self.root.after(0, lambda: self.update_tree([]))
            self.root.after(0, lambda: self.status_label.config(text="Status: Cleaned!", foreground="#50fa7b"))
        else:
            self.root.after(2000, lambda: self.status_label.config(text="Status: Idle (Safe)", foreground="#50fa7b"))

    def start_scan(self):
        self.status_label.config(text="Status: Scanning...", foreground="#ffcb6b")
        self.scan_btn.config(state="disabled")
        threading.Thread(target=self.run_engine_scan, daemon=True).start()

    def run_engine_scan(self):
        targets = self.engine.run_sweep(execute_kills=False)
        self.root.after(0, lambda: self.update_tree(targets))

    def update_tree(self, targets):
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        for t in targets:
            tag = t.get('type', 'High Resource')
            self.tree.insert("", "end", values=(t['name'], tag, f"{t['cpu']:.1f}%", f"{t['mem']:.1f} MB"), tags=(t['pid'], tag))
        
        self.status_label.config(text="Status: Idle", foreground="#89ddff")
        self.scan_btn.config(state="normal")

    def add_selected_to_blacklist(self):
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showwarning("Selection", "Please select a process to blacklist.")
            return
        
        for item in selected_item:
            name = self.tree.item(item, "values")[0]
            if self.engine.add_to_blacklist(name):
                messagebox.showinfo("Blacklist", f"Added {name} to blacklist.")
                self.start_scan() # Refresh list

    def kill_selected(self):
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showwarning("Selection", "Please select a process to kill.")
            return
        
        for item in selected_item:
            pid = self.tree.item(item, "tags")[0]
            if self.engine.kill_process(int(pid)):
                self.tree.delete(item)

if __name__ == "__main__":
    try:
        root = tk.Tk()
        app = KillSwitchGUI(root)
        root.mainloop()
    except Exception as e:
        import traceback
        with open("crash.log", "w") as f:
            f.write(traceback.format_exc())
        messagebox.showerror("Fatal Error", f"KillSwitch crashed. Check crash.log for details.\n\n{e}")
