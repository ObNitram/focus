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

export function createNote(dir: string) {
    let noteName = 'Untitled.md'
    let noteFullPath = join(dir, noteName)

    try {
        // if the note already exists, we append a number to the name
        let i = 0

        try {
            while (true) {
                noteName = i === 0 ? 'Untitled.md' : `Untitled (${i}).md`
                noteFullPath = join(dir, noteName)
                statSync(noteFullPath)
                i++
            }
        } catch (e) {
            // if the file doesn't exist, we create it
            writeFileSync(noteFullPath, '')
        }
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
