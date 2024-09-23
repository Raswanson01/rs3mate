import type { AbilityMap } from '../../data/abilities';
import { appLocalDataDir, join, resourceDir } from '../../lib/tauri-wrapper';
import type { PageLoad } from './$types';
import { readTextFile } from '@tauri-apps/api/fs';

export const load: PageLoad = async () => {
    // Specify the path to the JSON file you want to load
    //const filePath = '/categorizedAbilities.json';
    const resourcePath = await resourceDir();
    const localPath = await appLocalDataDir();
    const allAbilitiesPath = await join(resourcePath, "categorizedAbilities.json");
    const barConfigPath = await join(localPath, "barConfig.json");
    try {
        console.log("Beginning to read file")
        // Call the Tauri command to read the file
        const abilityData = await readTextFile(allAbilitiesPath);
        const actionBarData = await readTextFile(barConfigPath);
        // Parse the JSON data
        const abilities: AbilityMap = JSON.parse(abilityData);
        const barConfig = JSON.parse(actionBarData);

        // Return the JSON data to the page
        console.log("Json data: ", abilities)
        console.log("Bar config: ", barConfig);
        return {
            abilities,
            barConfig
        };
    } catch (error) {
        console.error('Failed to load JSON file:', error);
        return {
            abilities: {} as AbilityMap,
            barConfig: []
        };
    }
};
