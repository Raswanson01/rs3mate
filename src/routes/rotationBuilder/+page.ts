import type { AbilityMap } from '../../data/abilities';
import type { PageLoad } from './$types';
import { resourceDir, join, appLocalDataDir } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/api/fs';

export const load: PageLoad = async () => {
    // Specify the path to the JSON file you want to load
    //const filePath = '/categorizedAbilities.json';
    const resourcePath = await resourceDir();
    const localPath = await appLocalDataDir();
    const allAbilitiesPath = await join(resourcePath, "categorizedAbilities.json");
    const rotationPath = await join(localPath, "rotations.json");
    try {
        console.log("Beginning to read file")
        // Call the Tauri command to read the file
        const abilityData = await readTextFile(allAbilitiesPath);
        const rotationData = await readTextFile(rotationPath);
        // Parse the JSON data
        const abilities: AbilityMap = JSON.parse(abilityData);
        const rotations = JSON.parse(rotationData);

        return {
            abilities,
            rotations
        };
    } catch (error) {
        console.error('Failed to load JSON file:', error);
        return {
            abilities: {} as AbilityMap,
            rotations: []
        };
    }
};
