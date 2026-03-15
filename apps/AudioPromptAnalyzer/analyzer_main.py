import customtkinter as ctk
import subprocess
import os
import sys

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# --- Windows 11 Environment Resilience ---
ffmpeg_dir = r"C:\Users\Saeed\Documents\AudVidMaker"
if os.path.exists(ffmpeg_dir):
    os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")

class AnalyzerMain(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        # Ensure working directory is the script's directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))

        self.title("AudioPromptAnalyzer - Windows 11 Resilient Hub")
        self.geometry("600x600")

        self.setup_ui()

    def setup_ui(self):
        ctk.CTkLabel(self, text="AudioPromptAnalyzer", font=("Arial", 28, "bold")).pack(pady=20)
        
        self.btn_structure = ctk.CTkButton(
            self, 
            text="Analyze Song Structure & BPM", 
            height=50,
            command=self.launch_structure
        )
        self.btn_structure.pack(pady=10, padx=20, fill="x")

        self.btn_demucs = ctk.CTkButton(
            self, 
            text="Separate Vocals & Instruments", 
            height=50,
            fg_color="#6366f1",
            hover_color="#4f46e5",
            command=self.launch_demucs
        )
        self.btn_demucs.pack(pady=10, padx=20, fill="x")

        # Results Console
        self.console_label = ctk.CTkLabel(self, text="Analysis Results:", font=("Arial", 14, "bold"))
        self.console_label.pack(pady=(20, 5), padx=20, anchor="w")
        
        self.result_box = ctk.CTkTextbox(self, height=150, font=("Consolas", 12))
        self.result_box.pack(pady=5, padx=20, fill="both", expand=True)
        self.result_box.insert("0.0", "Select a file to begin...")

    def update_console(self, text):
        self.result_box.delete("0.0", "end")
        self.result_box.insert("0.0", text)

    def launch_structure(self):
        try:
            from tkinter import filedialog
            file = filedialog.askopenfilename(filetypes=[("Audio Files", "*.mp3 *.wav *.flac")])
            if file:
                self.update_console("Analyzing... please wait.")
                # Run structure_analyzer.py and capture output
                # Using a thread to keep GUI responsive
                import threading
                def run():
                    try:
                        cmd = [sys.executable, "structure_analyzer.py", file]
                        result = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
                        self.after(0, lambda: self.update_console(result))
                    except subprocess.CalledProcessError as e:
                        self.after(0, lambda: self.update_console(f"Error:\n{e.output}"))
                    except Exception as e:
                        self.after(0, lambda: self.update_console(f"Fatal Error:\n{str(e)}"))
                
                threading.Thread(target=run, daemon=True).start()
        except Exception as e:
            self.update_console(f"Launch Error: {e}")

    def launch_demucs(self):
        try:
            self.update_console("Launching Source Separation Tool...")
            subprocess.Popen([sys.executable, "demucs_gui_app.py"])
        except Exception as e:
            self.update_console(f"Error launching Demucs GUI: {e}")

if __name__ == "__main__":
    try:
        app = AnalyzerMain()
        app.title("AudioPromptAnalyzer Hub")
        app.geometry("600x600")
        app.mainloop()
    except Exception as e:
        import traceback
        with open("crash_log.txt", "w") as f:
            f.write(traceback.format_exc())
