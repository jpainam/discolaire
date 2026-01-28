// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg(not(debug_assertions))]
use std::{fs, io, path::Path};
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
    let entry_path = next_dir.join("server-entry.txt");
    let entry = fs::read_to_string(entry_path).unwrap_or_else(|_| ".".into());
    let entry = entry.trim();
    let server_js = if entry.is_empty() || entry == "." {
        next_dir.join("server.js")
    } else {
        next_dir.join(entry).join("server.js")
    };

    if !server_js.exists() {
        return Ok(());
    }

    let mut cmd = Command::new("node");
    cmd
        .arg(server_js)
        .current_dir(&next_dir)
        .env("NODE_ENV", "production")
        .env("PORT", "1430")
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::null())
        .stderr(std::process::Stdio::null());

    let env_path = app.path().app_config_dir()?.join(".env");
    if env_path.exists() {
        if let Ok(vars) = read_env_file(&env_path) {
            for (key, value) in &vars {
                cmd.env(key, value);
            }
            log_missing_env_vars(&env_path, &vars);
        } else {
            eprintln!("Failed to read .env file at {}", env_path.display());
        }
    } else {
        let msg = format!("Missing .env file at {}", env_path.display());
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.eval(&format!("alert('{}')", escape_js_string(&msg)));
        } else {
            eprintln!("{msg}");
        }
    }

    cmd.spawn().map_err(|e| -> Box<dyn std::error::Error> {
        Box::new(io::Error::new(io::ErrorKind::Other, e))
    })?;

    Ok(())
}

#[cfg(not(debug_assertions))]
fn read_env_file(path: &Path) -> io::Result<Vec<(String, String)>> {
    let contents = fs::read_to_string(path)?;
    let mut vars = Vec::new();
    for raw_line in contents.lines() {
        let mut line = raw_line.trim();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        if let Some(rest) = line.strip_prefix("export ") {
            line = rest.trim();
        }
        let mut parts = line.splitn(2, '=');
        let key = parts.next().unwrap_or("").trim();
        if key.is_empty() {
            continue;
        }
        let value = parts.next().unwrap_or("").trim();
        let value = unquote_env_value(value);
        vars.push((key.to_string(), value));
    }
    Ok(vars)
}

#[cfg(not(debug_assertions))]
fn log_missing_env_vars(env_path: &Path, vars: &[(String, String)]) {
    use std::collections::HashSet;

    let present: HashSet<&str> = vars.iter().map(|(k, _)| k.as_str()).collect();
    let required = [
        "AUTH_SECRET",
        "DATABASE_URL",
        "DISCOLAIRE_API_KEY",
        "RESEND_API_KEY",
        "S3_ACCESS_KEY_ID",
        "S3_REGION",
        "S3_BUCKET_NAME",
        "S3_SECRET_ACCESS_KEY",
        "S3_AVATAR_BUCKET_NAME",
        "S3_IMAGE_BUCKET_NAME",
        "S3_DOCUMENT_BUCKET_NAME",
        "WHATSAPP_VERIFY_TOKEN",
        "WHATSAPP_API_TOKEN",
        "REDIS_URL",
        "SUPER_ADMIN_USERNAME",
        "NEXT_PUBLIC_MINIO_URL",
        "NEXT_PUBLIC_DEPLOYMENT_ENV",
    ];

    let missing: Vec<&str> = required
        .iter()
        .copied()
        .filter(|key| !present.contains(key))
        .collect();

    if !missing.is_empty() {
        eprintln!(
            "Missing required env vars in {}: {}",
            env_path.display(),
            missing.join(", ")
        );
    } else {
        eprintln!("Loaded .env from {}", env_path.display());
    }
}

#[cfg(not(debug_assertions))]
fn unquote_env_value(value: &str) -> String {
    let bytes = value.as_bytes();
    if bytes.len() >= 2 {
        let first = bytes[0];
        let last = bytes[bytes.len() - 1];
        if (first == b'"' && last == b'"') || (first == b'\'' && last == b'\'') {
            return value[1..value.len() - 1].to_string();
        }
    }
    value.to_string()
}

#[cfg(not(debug_assertions))]
fn escape_js_string(value: &str) -> String {
    value
        .replace('\\', "\\\\")
        .replace('\'', "\\'")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
}

#[cfg(not(debug_assertions))]
fn start_ssr_server_from_app<R: tauri::Runtime>(
    app: &tauri::App<R>,
) -> Result<(), Box<dyn std::error::Error>> {
    start_ssr_server(&app.handle())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            #[cfg(not(debug_assertions))]
            {
                start_ssr_server_from_app(app)?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
