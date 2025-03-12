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

    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "
            CREATE TABLE rotations
            (
                id INTEGER PRIMARY KEY,
                name TEXT,
                style TEXT
            );
            CREATE TABLE abilities 
            (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                cooldown NUMERIC NOT NULL,
                image TEXT NOT NULL
            );
            CREATE TABLE bars
            (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            );
            CREATE TABLE bars_abilities
            (
                id INTEGER NOT NULL PRIMARY KEY,
                abilityId INTEGER NOT NULL,
                barId INTEGER NOT NULL
            );
            CREATE TABLE rotations_abilities 
            (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                abilityId INTEGER NOT NULL,
                rotationId INTEGER NOT NULL,
                orderNum INTEGER NOT NULL,
                CONSTRAINT rotations_abilities_abilities_FK FOREIGN KEY (abilityId) REFERENCES abilities(id),
                CONSTRAINT rotations_abilities_rotations_FK FOREIGN KEY (rotationId) REFERENCES rotations(id)
            );
            CREATE TABLE barConfigs 
            (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
            );
            CREATE TABLE barConfigs_keybinds 
            (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                barConfigId INTEGER NOT NULL,
                keybind INTEGER,
                position INTEGER NOT NULL
            );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_test_data",
            sql: "INSERT INTO abilities VALUES (1, \"Greater Concentrated Blast\", 3.6, \"gconc.png\");",
            kind: MigrationKind::Up
        }
    ];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default()
            .add_migrations("sqlite:rs3_mate_db.db", migrations)
            .build())
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
