import Database from "@tauri-apps/plugin-sql";
import type { PageLoad } from "../$types";
import type { BarConfig } from '../../data/abilities';

export const load: PageLoad = async () => {
    try {
        const db = await Database.load("sqlite:rs3_mate_db.db");
        const barConfigs: BarConfig[] = await db.select("SELECT * FROM barConfigs");

        return {
            barConfigs
        }
    }
    catch (error) {
        console.error("Failed to load bar config page: ", error);
    }
}