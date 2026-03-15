import customtkinter as ctk
import tkinter as tk
from tkinter import filedialog, messagebox
import subprocess
import threading
import os
import sys
import re

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class DemucsGUI(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Demucs Source Separation - AudioPromptAnalyzer")
        self.geometry("600x500")

        self.input_file = ""
        self.output_dir = ""
        self.is_processing = False

        self.setup_ui()

    def setup_ui(self):
        # Header
        self.header_label = ctk.CTkLabel(self, text="Demucs Source Separation", font=("Arial", 24, "bold"))
        self.header_label.pack(pady=20)

        # File Selection Frame
        self.selection_frame = ctk.CTkFrame(self)
        self.selection_frame.pack(padx=20, pady=10, fill="x")

        self.btn_select_file = ctk.CTkButton(self.selection_frame, text="Select Audio File", command=self.select_file)
        self.btn_select_file.pack(pady=10)

        self.label_file = ctk.CTkLabel(self.selection_frame, text="No file selected", text_color="gray")
        self.label_file.pack(pady=5)

        self.btn_select_output = ctk.CTkButton(self.selection_frame, text="Select Output Folder", command=self.select_output)
        self.btn_select_output.pack(pady=10)

        self.label_output = ctk.CTkLabel(self.selection_frame, text="Default: same as input", text_color="gray")
        self.label_output.pack(pady=5)

        # Model Selection
        self.model_frame = ctk.CTkFrame(self)
        self.model_frame.pack(padx=20, pady=10, fill="x")

        ctk.CTkLabel(self.model_frame, text="Demucs Model:").pack(side="left", padx=10)
        self.model_var = ctk.StringVar(value="htdemucs")
        self.model_menu = ctk.CTkOptionMenu(self.model_frame, values=["htdemucs", "htdemucs_ft", "mdx", "mdx_extra"], variable=self.model_var)
        self.model_menu.pack(side="left", padx=10, pady=10)

        # Control Buttons
        self.btn_start = ctk.CTkButton(self, text="Start Separation", fg_color="green", hover_color="darkgreen", command=self.start_processing)
        self.btn_start.pack(pady=20)

        # Progress Section
        self.progress_bar = ctk.CTkProgressBar(self, width=400)
        self.progress_bar.pack(pady=10)
        self.progress_bar.set(0)

        self.status_label = ctk.CTkLabel(self, text="Ready", text_color="gray")
        self.status_label.pack(pady=5)

    def select_file(self):
        file = filedialog.askopenfilename(filetypes=[("Audio Files", "*.mp3 *.wav *.flac *.m4a")])
        if file:
            self.input_file = os.path.normpath(file)
            self.label_file.configure(text=os.path.basename(self.input_file), text_color="white")
            if not self.output_dir:
                self.output_dir = os.path.join(os.path.dirname(self.input_file), "Separated_Stems")
                self.label_output.configure(text=f"Folder: {os.path.basename(self.output_dir)}", text_color="white")

    def select_output(self):
        folder = filedialog.askdirectory()
        if folder:
            self.output_dir = os.path.normpath(folder)
            self.label_output.configure(text=os.path.basename(self.output_dir), text_color="white")

    def start_processing(self):
        if not self.input_file:
            messagebox.showwarning("Warning", "Please select an input file first.")
            return
        
        if self.is_processing:
            return

        self.is_processing = True
        self.btn_start.configure(state="disabled", text="Processing...")
        self.progress_bar.set(0)
        self.status_label.configure(text="Initializing Demucs...", text_color="yellow")

        threading.Thread(target=self.run_demucs, daemon=True).start()

    def run_demucs(self):
        model = self.model_var.get()
        # Ensure output directory exists
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

        # Environment setup: Ensure FFmpeg is available if needed
        ffmpeg_dir = r"C:\Users\Saeed\Documents\AudVidMaker"
        env = os.environ.copy()
        if os.path.exists(os.path.join(ffmpeg_dir, "ffmpeg.exe")):
            env["PATH"] = ffmpeg_dir + os.pathsep + env["PATH"]

        # Command: Use native demucs separation (now resilient thanks to torchaudio patch)
        cmd = [sys.executable, "-m", "demucs.separate", "-n", model, "-o", self.output_dir, self.input_file]
        
        try:
            # We want to capture stderr because Demucs (and many ML tools) logs progress there
            process = subprocess.Popen(
                cmd, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.STDOUT, 
                text=True, 
                bufsize=1, 
                universal_newlines=True,
                env=env
            )

            # Demucs output is very chatty. We look for progress indicators.
            for line in process.stdout:
                print(line, end="") # Debug print to console
                
                match = re.search(r'(\d+)%', line)
                if match:
                    percent = int(match.group(1))
                    self.after(0, lambda p=percent: self.update_progress(p))
                
                if "Separating" in line:
                    self.after(0, lambda l=line.strip(): self.status_label.configure(text=l[:50] + "..."))

            process.wait()

            if process.returncode == 0:
                self.after(0, self.finish_success)
            else:
                self.after(0, lambda: self.finish_error(process.returncode))

        except Exception as e:
            self.after(0, lambda ex=e: self.finish_exception(ex))

    def update_progress(self, percent):
        self.progress_bar.set(percent / 100)
        self.status_label.configure(text=f"Separating Stems... {percent}%")

    def finish_success(self):
        self.is_processing = False
        self.btn_start.configure(state="normal", text="Start Separation")
        self.status_label.configure(text="Complete! Stems saved.", text_color="green")
        self.progress_bar.set(1.0)
        messagebox.showinfo("Success", f"Separation complete!\nFiles saved to: {self.output_dir}")

    def finish_error(self, code):
        self.is_processing = False
        self.btn_start.configure(state="normal", text="Start Separation")
        self.status_label.configure(text=f"Error: Return code {code}", text_color="red")
        messagebox.showerror("Error", f"Demucs failed with return code {code}.\nCheck console for details.")

    def finish_exception(self, e):
        self.is_processing = False
        self.btn_start.configure(state="normal", text="Start Separation")
        self.status_label.configure(text="Exception occurred", text_color="red")
        messagebox.showerror("Exception", f"An error occurred: {str(e)}")

if __name__ == "__main__":
    app = DemucsGUI()
    app.mainloop()
