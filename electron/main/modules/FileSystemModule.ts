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
    return new Promise((resolve, reject) => {
        readdir(dir, (err, files) => {
            if (err) {
                printMessage.printError("Error while reading folder: " + err)
                reject(err)
            }

            let i = 1
            let newName = name
            while (files.includes(newName)) {
                newName = name + ' (' + i + ')'
                i++
            }

            resolve(newName)
        })
    })
}

function getFolderContentInner(folderPath: string, recursive: boolean = false): Promise<File[]> {
    return new Promise((resolve, reject) => {
        readdir(folderPath, (err, files) => {
            if (err) {
                printMessage.printError("Error while reading folder: " + err)
                reject([])
            }

            let promises: Promise<File>[] = []
            files.forEach((file) => {
                let filePath = join(folderPath, file)
                promises.push(getFileOrFolderInfo(filePath))
            })

            Promise.all(promises).then((files) => {
                if (recursive) {
                    let promises: Promise<File[]>[] = []
                    files.forEach((file) => {
                        if (file.isDirectory) {
                            promises.push(getFolderContentInner(file.path, true))
                        }
                    })

                    Promise.all(promises).then((subFolders) => {
                        subFolders.forEach((subFolder) => {
                            files = files.concat(subFolder)
                        })
                        resolve(files)
                    })
                } else {
                    resolve(files)
                }
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
        getFileOrFolderInfo(folderPath).then((folder) => {
            getFolderContentInner(folderPath, recursive).then((children) => {
                folder.children = children
                resolve(folder)
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
                printMessage.printError("Error while getting file or folder info: " + err)
                reject(null)
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
                printMessage.printError("Error while deleting file or folder: " + err)
                reject(false)
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
                            printMessage.printError("Error while creating note: " + err)
                            reject(null)
                        }
                        printMessage.printOK("Note created: " + noteFullPath)
                        resolve(new File(noteName, false, Date.now(), Date.now(), [], noteFullPath))
                    })
                } catch (e) {
                    printMessage.printError("Error while creating note: " + e)
                    reject(null)
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
                            printMessage.printError("Error while creating folder: " + err)
                            reject(null)
                        }
                        printMessage.printOK("Folder created: " + folderFullPath)
                        resolve(new File(folderName, true, Date.now(), Date.now(), [], folderFullPath))
                    })
                } catch (e) {
                    printMessage.printError("Error while creating folder: " + e)
                    reject(null)
                }
            })
    })
}

export function renameFileOrFolder(oldPath: string, newPath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            stat(oldPath, (err, stats) => {
                if (err) {
                    printMessage.printError("Error while renaming file or folder: " + err)
                    reject(false)
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
                rename(oldPath, newPath, (err) => {
                    if (err) {
                        printMessage.printError("Error while renaming file or folder: " + err)
                        reject(false)
                    }
                    printMessage.printOK("File or folder renamed: " + oldPath + " -> " + newPath)
                    resolve(true)
                })
            })
        }
        catch (e) {
            printMessage.printError("Error while renaming file or folder: " + e)
            reject(false)
        }
    })
}
