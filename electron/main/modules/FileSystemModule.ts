import { shell } from 'electron'
import { mkdir, readdir, rename, rm, stat, writeFile } from 'original-fs'
import { join } from 'path'
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

export function findAvailableName(dir: string, name: string): Promise<string> {
    console.log("findAvailableName")
    console.log(dir)
    console.log(name)
    return new Promise((resolve, reject) => {
        readdir(dir, (err, files) => {
            if (err) {
                reject("Error while reading folder: " + err)
            }

            let i = 1
            let newName = name
            stat(join(dir, newName), (err, stats) => {
                if (err) {
                    resolve(newName)
                } else {
                    while (files.includes(newName)) {
                        if (stats.isDirectory()) {
                            newName = name + " (" + i + ")"
                        } else {
                            let extension = name.split('.').pop()
                            newName = name.replace('.' + extension, " (" + i + ")." + extension)
                        }
                        i++
                    }
                    resolve(newName)
                }
            })
        })
    })
}

function getFolderContentInner(folderPath: string, recursive: boolean = false): Promise<File[]> {
    return new Promise((resolve) => {
        readdir(folderPath, { withFileTypes: true }, (err, files) => {

            if (err) {
                printMessage.printError("Error while reading folder: " + err)
                resolve([])
            }

            let Promises: Promise<File>[] = []

            for (const file of files) {
                if (file.name.startsWith('.')) {
                    continue
                }

                let currIsDirectory = file.isDirectory()
                if (!currIsDirectory && !file.name.endsWith('.md')) {
                    continue
                }

                let promise = new Promise<File>((resolve, reject) => {
                    stat(join(folderPath, file.name), (err, stats) => {
                        if (err) {
                            reject("Error while getting file or folder info: " + err)
                        }

                        if (currIsDirectory && recursive) {
                            getFolderContentInner(join(folderPath, file.name), true).then((children) => {
                                resolve(new File(file.name, currIsDirectory, stats.birthtimeMs, stats.mtimeMs, children, join(folderPath, file.name)))
                            })
                        }
                        else {
                            resolve(new File(file.name, currIsDirectory, stats.birthtimeMs, stats.mtimeMs, [], join(folderPath, file.name)))
                        }
                    })
                })
                Promises.push(promise)
            }

            Promise.all(Promises).then((files) => {
                resolve(files)
            })
        })
    })
}

/**
 * Get recursively the content of a folder (the root folder is included)
 * @param folderPath The path of the folder to get the content of
 * @param recursive If true, the function will get the content of the subfolders
 * @returns A promise that resolves to an array of File objects
 */
export function getFolderContent(folderPath: string, recursive: boolean = false): Promise<File> {
    return new Promise((resolve) => {
        stat(folderPath, (err, stats) => {
            if (err) {
                printMessage.printError("Error while getting file or folder info: " + err)
                resolve(null)
            }

            getFolderContentInner(folderPath, recursive).then((children) => {
                resolve(new File(folderPath.split('/').pop(), true, stats.birthtimeMs, stats.mtimeMs, children, folderPath))
            })
        })
    })
}


export function showInExplorer(folderPath: string) {
    shell.showItemInFolder(folderPath)
}

export function getFileOrFolderInfo(path: string): Promise<File> {
    return new Promise((resolve, reject) => {
        stat(path, (err, stats) => {
            if (err) {
                reject("Error while getting file or folder info: " + err)
            }

            let name = path.split('/').pop()
            let isDirectory = stats.isDirectory()

            if (isDirectory) {
                getFolderContentInner(path).then((children) => {
                    resolve(new File(name, isDirectory, stats.birthtimeMs, stats.mtimeMs, children, path))
                })
            }
            resolve(new File(name, isDirectory, stats.birthtimeMs, stats.mtimeMs, [], path))
        })
    })
}

export function deleteFileOrFolder(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        rm(path, { recursive: true }, (err) => {
            if (err) {
                reject("Error while deleting file or folder: " + err)
            }
            printMessage.printOK("File or folder deleted: " + path)
            resolve(true)
        })
    })
}

export function createNote(dir: string): Promise<File> {
    return new Promise((resolve, reject) => {
        findAvailableName(dir, 'New Note.md')
            .then((noteName) => {
                let noteFullPath = join(dir, noteName)

                try {
                    writeFile(noteFullPath, '', (err) => {
                        if (err) {
                            reject("Error while creating note: " + err)
                        }
                        printMessage.printOK("Note created: " + noteFullPath)
                        resolve(new File(noteName, false, Date.now(), Date.now(), [], noteFullPath))
                    })
                } catch (e) {
                    reject("Error while creating note: " + e)
                }
            })
    })
}

export function createFolder(dir: string, folderName: string): Promise<File> {
    return new Promise((resolve, reject) => {
        findAvailableName(dir, folderName)
            .then((folderName) => {
                let folderFullPath = join(dir, folderName)

                try {
                    mkdir(folderFullPath, (err) => {
                        if (err) {
                            reject("Error while creating folder: " + err)
                        }
                        printMessage.printOK("Folder created: " + folderFullPath)
                        resolve(new File(folderName, true, Date.now(), Date.now(), [], folderFullPath))
                    })
                } catch (e) {
                    reject("Error while creating folder: " + e)
                }
            })
    })
}

export function renameFileOrFolder(oldPath: string, newPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            stat(oldPath, (err, stats) => {
                if (err) {
                    reject("Error while getting file or folder info: " + err)
                }

                if (stats.isDirectory()) {
                    if (!newPath.endsWith('/')) {
                        newPath += '/'
                    }
                }
                else {
                    if (newPath.endsWith('/')) {
                        newPath = newPath.slice(0, -1)
                    }
                    if (!newPath.endsWith('.md')) {
                        newPath += '.md'
                    }
                }
                let parts = newPath.split('/')
                let name = parts[parts.length - 2]
                let dir = newPath.slice(0, -name.length-1)

                findAvailableName(dir, name).then((availableName) => {
                    newPath = join(dir, availableName)
                    rename(oldPath, newPath, (err) => {
                        if (err) {
                            reject("Error while renaming file or folder: " + err)
                        }
                        printMessage.printOK("File or folder renamed: " + oldPath + " -> " + newPath)
                        resolve(true)
                    })
                })
            })
        }
        catch (e) {
            reject("Error while renaming file or folder: " + e)
        }
    })
}
