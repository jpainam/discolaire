// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg(not(debug_assertions))]
use tauri::Manager;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(not(debug_assertions))]
fn start_ssr_server<R: tauri::Runtime>(
    app: &tauri::AppHandle<R>,
) -> Result<(), Box<dyn std::error::Error>> {
    use std::process::Command;

    let resource_dir = app.path().resource_dir()?;
    let next_dir = resource_dir.join("next").join("server");
    let server_js = next_dir.join("server.js");

    if !server_js.exists() {
        return Ok(());
    }

    Command::new("node")
        .arg(server_js)
        .current_dir(&next_dir)
        .env("NODE_ENV", "production")
        .env("PORT", "1430")
        .spawn()?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            #[cfg(not(debug_assertions))]
            {
                start_ssr_server(app)?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
