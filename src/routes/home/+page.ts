import type { AbilityMap } from '../../data/abilities';
import type { PageLoad } from './$types';
import { invoke } from '@tauri-apps/api/tauri';

export const load: PageLoad = async () => {
    // Specify the path to the JSON file you want to load
    //const filePath = '/categorizedAbilities.json';
    const filePath = 'F:\\Projects\\rs3mate\\categorizedAbilities.json';

    try {
        console.log("Beginning to read file")
        // Call the Tauri command to read the file
        const fileContent = await invoke<string>('read_file', { path: filePath });

        // Parse the JSON data
        const abilities: AbilityMap = JSON.parse(fileContent);

        // Return the JSON data to the page
        console.log("Json data: ", abilities)
        return abilities;
    } catch (error) {
        console.error('Failed to load JSON file:', error);
        return {
            abilities: {} as AbilityMap
        };
    }
};
