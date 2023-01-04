import { join } from 'path'
import { mkdirSync } from 'fs'
import { Dirent, readdirSync, rmSync, statSync, unlinkSync, writeFileSync, existsSync } from 'original-fs'
import * as printMessage from './OutputModule'

export class File {
    name: string
    isDirectory: boolean
    createdTime: number
    modifiedTime: number
    children: File[]
    path: string

    constructor(name: string, isDirectory: boolean, createdTime: number, modifiedTime: number, children: File[], path: string) {
        this.name = name
        this.isDirectory = isDirectory
        this.createdTime = createdTime
        this.modifiedTime = modifiedTime
        this.children = children
        this.path = path
    }
}

export function findAvailableName(dir: string, name: string) {
    // if the note already exists, we append a number to the name
    let i = 0
    let fullPath
    let modifiedName = name

    try {
        while (true) {
            if (i > 0) {
                if (name.endsWith('.md')) {
                    modifiedName = `${name.slice(0, -3)}(${i}).md`
                }
                else {
                    modifiedName = `${name}(${i})`
                }
            }
            fullPath = join(dir, modifiedName)
            statSync(fullPath)
            i++
        }
    } catch (e) {
        return modifiedName
    }
}

export function createFolder(dir: string, folderName: string) {
    folderName = findAvailableName(dir, folderName)
    let folderFullPath = join(dir, folderName)

    try {
        mkdirSync(folderFullPath)
    }
    catch (e) {
        printMessage.printError("Error while creating folder: "+ e)
    }
    printMessage.printOK("Folder created: " + folderFullPath)
    return new File(folderName, true, Date.now(), Date.now(), [], folderFullPath)
}

export function createNote(dir: string) {
    let noteName = findAvailableName(dir, 'Untitled.md')
    let noteFullPath = join(dir, noteName)

    try {
        writeFileSync(noteFullPath, '')
    } catch (e) {
        printMessage.printError("Error while creating note: " + e)
    }
    printMessage.printOK("Note created: " + noteFullPath)
    return new File(noteName, false, Date.now(), Date.now(), [], noteFullPath)
}

export function deleteFileOrFolder(path: string): boolean {
    try {
        let stats = statSync(path)
        if (stats.isDirectory()) {
            rmSync(path, { recursive: true })
            if(existsSync(path)){
                throw new Error("Impossible to delete element. Please check permission.")
            }
        }
        else {
            unlinkSync(path)
        }
    }
    catch (e) {
        printMessage.printError("Error while deleting file or folder: "+ e)
        return false
    }
    printMessage.printOK("File or folder deleted: "+ path)
    return true
}

function getFolderContentRecursively(folderPath: string, recursive: boolean = false) {
    let files: Dirent[]
    let content = []


    try {
        files = readdirSync(folderPath, { withFileTypes: true })
    }
    catch (e) {
        printMessage.printError("Error while reading folder: " + e)
        return content
    }

    for (const file of files) {
        if (file.name.startsWith('.')) { // ignore hidden files and folders
            continue
        }

        let currIsDirectory = file.isDirectory()
        if (!currIsDirectory) {
            if (!file.name.endsWith('.md')) {
                continue
            }
        }
        const fileStats = statSync(join(folderPath, file.name))

        content.push(new File(
            file.name,
            currIsDirectory,
            fileStats.birthtimeMs,
            fileStats.mtimeMs,
            currIsDirectory && recursive ? getFolderContentRecursively(join(folderPath, file.name), recursive) : [],
            join(folderPath, file.name)
        ))
    }

    return content
}

export function getFolderContent(folderPath: string, recursive: boolean = false) {
    let content = []
    let mainFolderChildren = getFolderContentRecursively(folderPath, recursive)

    const fileStats = statSync(folderPath)
    const folderName = folderPath.split('/').pop()

    content.push(new File(folderName, true, fileStats.birthtimeMs, fileStats.mtimeMs, mainFolderChildren, folderPath))
    return content
}
