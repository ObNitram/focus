import { join } from 'path'
import { mkdirSync } from 'fs'
import { Dirent, readdirSync } from 'original-fs'

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

export function getFolderContent(folderPath: string, recursive: boolean = false) {
    let content = []
    let files: Dirent[]

    try {
        files = readdirSync(folderPath, { withFileTypes: true })
    }
    catch (e) {
        console.log("Error while reading folder: ", e)
        return content
    }
    for (const file of files) {
        let currIsDirectory = file.isDirectory()

        if (!currIsDirectory && !file.name.endsWith('.md')) {
            continue
        }

        content.push({
            name: file.name,
            isDirectory: currIsDirectory,
            children: currIsDirectory && recursive ? getFolderContent(join(folderPath, file.name), recursive) : []
        })
    }
    return content
}
