import { readTextFile } from '@tauri-apps/api/fs';
import type { PageLoad } from './$types';
import { appLocalDataDir, join } from '$lib/tauri-wrapper';

export const load: PageLoad = async () => {

    try {
        const localPath = await appLocalDataDir();
        const rotationPath = await join(localPath, "rotations.json");
        const barConfigPath = await join(localPath, "barConfig.json");
        console.log("Beginning to read file")
        // Call the Tauri command to read the file
        const rotationData = await readTextFile(rotationPath);
        const actionBarData = await readTextFile(barConfigPath);
        // Parse the JSON data
        const rotations = JSON.parse(rotationData);
        const barConfigs = JSON.parse(actionBarData);
        console.log("Rotations", rotations);
        console.log("Bar config: ", barConfigs);

        return {
            rotations,
            barConfigs
        };
    } catch (error) {
        console.error('Failed to load JSON file:', error);
        return {
            barConfigs: [],
            rotations: []
        };
    }
};