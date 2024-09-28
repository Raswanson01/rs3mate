
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{api::path::{ app_local_data_dir}, command};
use tauri_plugin_sql::{Migration, MigrationKind};
use std::fs;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() { //TODO add setup to copy default bar config

    let migrations = vec![
      Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "
          CREATE TABLE rotations (id INTEGER PRIMARY KEY, name TEXT);
          CREATE TABLE barConfigs (id INTEGER PRIMARY KEY, name TEXT);",
        kind: MigrationKind::Up,
      }
    ];
    tauri::Builder::default()
    .setup(|app| {
        let config = app.config();
        let resource_path = app.path_resolver()
          .resolve_resource("defaultBarConfig.json")
          .expect("failed to resolve resource");

        let app_data_path = app_local_data_dir(&config).unwrap();
        println!("App data directory: {:?}", app_data_path);
        let bar_config_file_path = app_data_path.join("barConfig.json");
        let rotations_file_path = app_data_path.join("rotations.json");
        if !bar_config_file_path.exists() {
          println!("File path: {:?}", bar_config_file_path);
          fs::copy(resource_path, bar_config_file_path).expect("Failed to copy data file");
        } else {
          println!("Bar config path exists. Skipping copy")
        }
        if !rotations_file_path.exists() {
          fs::write(rotations_file_path, "[]").expect("Could not write file");
        }

    
        Ok(())
      })
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}
