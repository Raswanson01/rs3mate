// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs;
use tauri::command;
use tauri_plugin_sql::{Migration, MigrationKind};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {

    // let migrations = vec![
    //     // Define your migrations here
    //     Migration {
    //         version: 1,
    //         description: "create_initial_tables",
    //         sql: "
    //         CREATE TABLE rotations (id INTEGER PRIMARY KEY, name TEXT);
    //         CREATE TABLE abilities (id INTEGER PRIMARY KEY AUTO INCREMENT);
    //         ",
    //         kind: MigrationKind::Up,
    //     }
    // ];
    tauri::Builder::default()
        // .plugin(tauri_plugin_sql::Builder::default()
        //     .add_migrations("sqlite:rs3_mate_db.db", migrations)
        //     .build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())  // You usually pass context here for Tauri app initialization
        .expect("error while running tauri application");
}

#[command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}
