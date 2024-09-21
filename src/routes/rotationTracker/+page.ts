// import { join, appLocalDataDir } from '@tauri-apps/api/path';
// import { readTextFile, exists } from '@tauri-apps/api/fs';
// import type { PageLoad } from './$types';

// export const load: PageLoad = async () => {
//     let barConfig = null;
//     let rotation = null;
//     try {
//         // const localPath = await appLocalDataDir();
//         // const trackerConfigPath = await join(localPath, "trackerConfig.json");
//         // const fileExists = await exists(trackerConfigPath);
//         // console.log("File exists: ", fileExists);
//         // console.log("Tracker config path: ", trackerConfigPath)
//         // // Call the Tauri command to read the file
//         // const trackerData = await readTextFile(trackerConfigPath);
//         // // Parse the JSON data
//         // const { barConfig, rotation } = JSON.parse(trackerData);

//         return {
//             barConfig,
//             rotation
//         };
//     } catch (error) {
//         console.error('Failed to load tracker file:', error);
//         return {};
//     }
// };