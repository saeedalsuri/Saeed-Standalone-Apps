use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use tauri::command;

#[command]
fn read_audio_file(path: String) -> Result<Vec<u8>, String> {
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;
    Ok(buffer)
}

#[command]
fn export_ringtone(audio_data: Vec<u8>, custom_name: String) -> Result<String, String> {
    // Use custom name or fallback
    let final_name = if custom_name.trim().is_empty() {
        "new_ringtone".to_string()
    } else {
        custom_name.trim().to_string()
    };
    
    // Create a 'Ringtones' folder on the Desktop
    let desktop_dir = dirs::desktop_dir().ok_or("Could not find Desktop")?;
    let export_dir = desktop_dir.join("ToneCraft_Ringtones");
    
    if !export_dir.exists() {
        std::fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;
    }
    
    // Save as .ogg (The browser will provide Opus/OGG data)
    let output_path = export_dir.join(format!("ringtone_{}.ogg", final_name));
    
    // Write the compressed bytes directly to disk
    std::fs::write(&output_path, audio_data).map_err(|e| e.to_string())?;

    println!("Saved compressed ringtone: {}", output_path.display());
    Ok(output_path.to_string_lossy().to_string())
}

#[command]
fn send_to_phone(path: String) -> Result<String, String> {
    use std::process::Command;
    
    // Attempt to push the file to the phone's Ringtones directory using ADB
    let output = Command::new("adb")
        .args(["push", &path, "/sdcard/Ringtones/"])
        .output()
        .map_err(|e| format!("Failed to run ADB: {}", e))?;

    if output.status.success() {
        Ok("Successfully sent to your phone! Check your Ringtones settings.".to_string())
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        if error.contains("no devices/emulators found") {
            Err("No phone detected. Please connect via USB and enable USB Debugging.".to_string())
        } else {
            Err(format!("ADB Error: {}", error))
        }
    }
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .invoke_handler(tauri::generate_handler![read_audio_file, export_ringtone, send_to_phone])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
