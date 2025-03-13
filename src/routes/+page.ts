import Database from "@tauri-apps/plugin-sql";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    const db = await Database.load("sqlite:rs3_mate_db.db");
    const result = await db.select("SELECT * from abilities");
    console.log("Result: ", result);
}