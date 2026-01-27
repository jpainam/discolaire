fn main() {
    use std::fs;
    use std::path::PathBuf;

    if let Ok(manifest_dir) = std::env::var("CARGO_MANIFEST_DIR") {
        let base = PathBuf::from(manifest_dir).join("next");
        let server_dir = base.join("server");
        let loader_dir = base.join("loader");
        let _ = fs::create_dir_all(&server_dir);
        let _ = fs::create_dir_all(&loader_dir);

        let placeholder = server_dir.join("placeholder.txt");
        if !placeholder.exists() {
            let _ = fs::write(&placeholder, b"placeholder");
        }

        let loader = loader_dir.join("index.html");
        if !loader.exists() {
            let _ = fs::write(&loader, b"<!doctype html><html><body>Loading...</body></html>");
        }
    }

    tauri_build::build()
}
