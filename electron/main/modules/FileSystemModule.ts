import { join } from 'path'
import { mkdirSync } from 'fs'

/**
 * Creates a folder in the given path
 * @param folderName The name of the folder to create
 * @param folderPath The path where the folder should be created
 * @returns The path of the created folder or null if an error occurred
 */
export function createFolder(folderName: string, folderPath: string): string | null {
    const folder = join(folderPath, folderName)

    try {
        mkdirSync(folder)
    }
    catch (e) {
        console.log("Error while creating folder: ", e)
        return null
    }
    return folder
}
