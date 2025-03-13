import Database from "@tauri-apps/plugin-sql";
import type { BarConfig } from "../data/abilities";

const db = await Database.load("sqlite:rs3_mate_db.db");

export async function createNewBarConfig() {
    await db.execute(`
        INSERT INTO barConfigs 
        (
            name,
            mainBarSetupId,
            barSetup1Id,
            barSetup2Id,
            barSetup3Id,
            barSetup4Id
        )
        VALUES ($1, $2, $3, $4, $5, $6);`,
            ["New config", null, null, null, null, null]
    );
}

export async function fetchBarConfigs(): Promise<BarConfig[]> {
    return await db.select("SELECT * FROM barConfigs;") ?? [];
}

export async function deleteBarConfig(barConfigId: number) {
    const result = await db.execute("DELETE FROM barConfigs WHERE id=$1", [barConfigId]);
    return result;
}

