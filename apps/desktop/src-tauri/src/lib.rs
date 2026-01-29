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

    let env_path = resolve_env_path();
    if env_path.exists() {
        let _ = dotenvy::from_filename(&env_path);
        if let Ok(vars) = read_env_file(&env_path) {
            for (key, value) in &vars {
                cmd.env(key, value);
            }
            log_missing_env_vars(app, &env_path, &vars);
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
        write_env_log(&env_path, "missing .env file\n");
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
fn log_missing_env_vars<R: tauri::Runtime>(
    app: &tauri::AppHandle<R>,
    env_path: &Path,
    vars: &[(String, String)],
) {
    use std::collections::{HashMap, HashSet};

    let map: HashMap<&str, &str> = vars.iter().map(|(k, v)| (k.as_str(), v.as_str())).collect();
    let present: HashSet<&str> = map.keys().copied().collect();
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
    let empty: Vec<&str> = required
        .iter()
        .copied()
        .filter(|key| {
            map.get(key)
                .map(|v| v.trim().is_empty())
                .unwrap_or(false)
        })
        .collect();

    let mut log = String::new();
    log.push_str("env path: ");
    log.push_str(&env_path.display().to_string());
    log.push('\n');
    log.push_str("present keys: ");
    log.push_str(&present.len().to_string());
    log.push('\n');

    if !missing.is_empty() {
        log.push_str("missing: ");
        log.push_str(&missing.join(", "));
        log.push('\n');
    }
    if !empty.is_empty() {
        log.push_str("empty: ");
        log.push_str(&empty.join(", "));
        log.push('\n');
    }

    log.push_str("values:\n");
    let mut sorted_vars: Vec<(&str, &str)> = map.into_iter().collect();
    sorted_vars.sort_by(|a, b| a.0.cmp(b.0));
    for (key, value) in sorted_vars {
        log.push_str("  ");
        log.push_str(key);
        log.push('=');
        log.push_str(value);
        log.push('\n');
    }

    if !missing.is_empty() || !empty.is_empty() {
        let msg = format!(
            "Invalid env vars in {}: missing [{}], empty [{}]",
            env_path.display(),
            missing.join(", "),
            empty.join(", ")
        );
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.eval(&format!("alert('{}')", escape_js_string(&msg)));
        } else {
            eprintln!("{msg}");
        }
    } else {
        log.push_str("status: ok\n");
        eprintln!("Loaded .env from {}", env_path.display());
    }

    write_env_log(env_path, &log);
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
fn resolve_env_path() -> std::path::PathBuf {
    use std::env;

    match env::consts::OS {
        "macos" => {
            let user = env::var("USER").unwrap_or_else(|_| "unknown".to_string());
            Path::new("/Users")
                .join(user)
                .join("Developer")
                .join("discolaire")
                .join(".env")
        }
        "linux" => {
            let home = env::var("HOME").unwrap_or_else(|_| "/home/unknown".to_string());
            Path::new(&home).join("discolaire").join(".env")
        }
        _ => Path::new(".env").to_path_buf(),
    }
}

#[cfg(not(debug_assertions))]
fn write_env_log(env_path: &Path, contents: &str) {
    if let Some(dir) = env_path.parent() {
        let _ = fs::create_dir_all(dir);
        let _ = fs::write(dir.join("env-check.log"), contents);
    }
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
