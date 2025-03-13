import Database from '@tauri-apps/plugin-sql';
import type { AbilityMap, BarConfig } from '../../data/abilities';
import { appLocalDataDir, join, resourceDir } from '../../lib/tauri-wrapper';
import type { PageLoad } from './$types';
import { readTextFile } from '@tauri-apps/plugin-fs';

export const load: PageLoad = async () => {
    const db = await Database.load("sqlite:rs3_mate_db.db");
    const bars: BarConfig[] = await db.select("SELECT * from barConfigs");
    try {
        if (bars && bars.length > 0) {

        }
        
    } catch (error) {
        console.error('Failed to load JSON file:', error);
        return {
            abilities: {} as AbilityMap,
            barConfig: []
        };
    }
};
