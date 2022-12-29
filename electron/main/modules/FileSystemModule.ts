import { join } from 'path'
import { mkdirSync } from 'fs'
import { Dirent, readdirSync, statSync, writeFileSync } from 'original-fs'

class File {
    name: string
    isDirectory: boolean
    createdTime: number
    modifiedTime: number
    children: File[]

    constructor(name: string, isDirectory: boolean, createdTime: number, modifiedTime: number, children: File[]) {
        this.name = name
        this.isDirectory = isDirectory
        this.createdTime = createdTime
        this.modifiedTime = modifiedTime
        this.children = children
    }
}

function findAvailableName(name: string, dir: string) {
    // if the note already exists, we append a number to the name
    let i = 0
    let fullPath

    try {
        while (true) {
            if (i > 0) {
                name = `${name} (${i})`
            }
            fullPath = join(dir, name)
            statSync(fullPath)
            i++
        }
    } catch (e) {
        return name
    }
}

export function createFolder(dir: string, folderName: string) {
    folderName = findAvailableName(folderName, dir)
    let folderFullPath = join(dir, folderName)

    try {
        mkdirSync(folderFullPath)
    }
    catch (e) {
        console.log("Error while creating folder: ", e)
    }
    console.log("Folder created: ", folderFullPath)
    return new File(folderName, true, Date.now(), Date.now(), [])
}

export function createNote(dir: string) {
    let noteName = findAvailableName('Untitled', dir) + '.md'
    let noteFullPath = join(dir, noteName)

    try {
        writeFileSync(noteFullPath, '')
    } catch (e) {
        console.log("Error while creating note: ", e)
    }
    console.log("Note created: ", noteFullPath)
    return new File(noteName, false, Date.now(), Date.now(), [])
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

        const fileStats = statSync(join(folderPath, file.name))

        content.push(new File(
            file.name,
            currIsDirectory,
            fileStats.birthtimeMs,
            fileStats.mtimeMs,
            currIsDirectory && recursive ? getFolderContent(join(folderPath, file.name), recursive) : []
        ))
    }
    return content
}
