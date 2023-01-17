import { shell } from 'electron'
import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'original-fs'
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

export async function findAvailableName(dir: string, name: string): Promise<string> {
    printMessage.printLog('In findAvailableName, dir is ' + dir + ' and name is ' + name)
    return new Promise((resolve, reject) => {
        readdir(dir, (err, files) => {
            if (err) {
                reject("Error while reading folder: " + err)
                return
            }

            let i = 1
            let newName = name
            stat(join(dir, newName), (err, stats) => {
                if (err) {
                    printMessage.printLog('Name found is ' + newName)
                    resolve(newName)
                } else {
                    while (files.includes(newName)) {
                        if (stats.isDirectory()) {
                            // if name ends with a number, increment it
                            if (name.match(/\(\d+\)$/)) {
                                newName = name.replace(/\(\d+\)$/, "(" + i + ")")
                            } else {
                                newName = name + " (" + i + ")"
                            }
                        } else {
                            let extension = name.split('.').pop()

                            if (name.match(/\(\d+\)\.\w+$/)) {
                                newName = name.replace(/\(\d+\)\.\w+$/, "(" + i + ")." + extension)
                            }
                            else {
                                newName = name.replace('.' + extension, " (" + i + ")." + extension)
                            }
                        }
                        i++
                    }
                    printMessage.printLog('Name found is ' + newName)
                    resolve(newName)
                }
            })
        })
    })
}

async function getFolderContentInner(folderPath: string, recursive: boolean = false): Promise<File[]> {
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
                            return
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
export async function getFolderContent(folderPath: string, recursive: boolean = false): Promise<File> {
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

/**
 * Get the info of a file or folder
 * @param path      The path of the file or folder
 * @param recursive If true, the function will get the content of the subfolders (default: false)
 * @returns A promise that resolves to a File object
 */
export async function getFileOrFolderInfo(path: string, recursive: boolean = false): Promise<File> {
    return new Promise((resolve, reject) => {
        stat(path, (err, stats) => {
            if (err) {
                reject("Error while getting file or folder info: " + err)
                return
            }

            let name = path.split('/').pop()
            let isDirectory = stats.isDirectory()

            if (isDirectory) {
                getFolderContentInner(path, recursive).then((children) => {
                    resolve(new File(name, isDirectory, stats.birthtimeMs, stats.mtimeMs, children, path))
                })
            }
            resolve(new File(name, isDirectory, stats.birthtimeMs, stats.mtimeMs, [], path))
        })
    })
}

export async function deleteFileOrFolder(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        rm(path, { recursive: true }, (err) => {
            if (err) {
                reject("Error while deleting file or folder: " + err)
                return
            }
            printMessage.printOK("File or folder deleted: " + path)
            resolve()
        })
    })
}

export async function createNote(dir: string): Promise<File> {
    return new Promise((resolve, reject) => {
        findAvailableName(dir, 'Untitled.md')
            .then((noteName) => {
                let noteFullPath = join(dir, noteName)

                try {
                    writeFile(noteFullPath, '', (err) => {
                        if (err) {
                            reject("Error while creating note: " + err)
                            return
                        }
                        printMessage.printOK("Note created: " + noteFullPath)
                        resolve(new File(noteName, false, Date.now(), Date.now(), [], noteFullPath))
                    })
                } catch (e) {
                    reject("Error while creating note: " + e)
                }
            })
            .catch((err) => {
                reject("Error while creating note: " + err)
            })
    })
}

export async function createFolder(dir: string, folderName: string): Promise<File> {
    return new Promise((resolve, reject) => {
        findAvailableName(dir, folderName)
            .then((folderName) => {
                let folderFullPath = join(dir, folderName)

                try {
                    mkdir(folderFullPath, (err) => {
                        if (err) {
                            reject("Error while creating folder: " + err)
                            return
                        }
                        printMessage.printOK("Folder created: " + folderFullPath)
                        resolve(new File(folderName, true, Date.now(), Date.now(), [], folderFullPath))
                    })
                } catch (e) {
                    reject("Error while creating folder: " + e)
                }
            })
            .catch((err) => {
                reject("Error while creating folder: " + err)
            })
    })
}

export async function renameFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            stat(oldPath, (err, stats) => {
                if (err) {
                    reject("Error while getting file or folder info: " + err)
                    return
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
                if (parts[parts.length - 1] == '') parts.pop()
                let name = parts[parts.length - 1]
                let dir = newPath.slice(0, -name.length - 1)
                printMessage.printLog('New name is ' + newPath)
                findAvailableName(dir, name).then((availableName) => {
                    newPath = join(dir, availableName)
                    rename(oldPath, newPath, (err) => {
                        if (err) {
                            reject("Error while renaming file or folder: " + err)
                            return
                        }
                        printMessage.printOK("File or folder renamed: " + oldPath + " -> " + newPath)
                        resolve()
                    })
                })
                    .catch((err) => {
                        reject("Error while renaming file or folder: " + err)
                    })
            })
        }
        catch (e) {
            reject("Error while renaming file or folder: " + e)
        }
    })
}

export async function moveFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            stat(oldPath, (err, stats) => {
                if (err) {
                    reject("Error while getting file or folder info: " + err)
                    return
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
                if (parts[parts.length - 1] == '') parts.pop()
                let name = parts[parts.length - 1]
                let dir = newPath.slice(0, -name.length - 1)
                printMessage.printLog('New name is ' + newPath)
                findAvailableName(dir, name).then((availableName) => {
                    newPath = join(dir, availableName)
                    rename(oldPath, newPath, (err) => {
                        if (err) {
                            reject("Error while moving file or folder: " + err)
                            return
                        }
                        printMessage.printOK("File or folder moved: " + oldPath + " -> " + newPath)
                        resolve()
                    })
                })
                    .catch((err) => {
                        reject("Error while moving file or folder: " + err)
                    })
            })
        }
        catch (e) {
            reject("Error while moving file or folder: " + e)
        }
    })
}

export async function copyFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            stat(oldPath, (err, stats) => {
                if (err) {
                    reject("Error while getting file or folder info: " + err)
                    return
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
                if (parts[parts.length - 1] == '') parts.pop()
                let name = parts[parts.length - 1]
                let dir = newPath.slice(0, -name.length - 1)
                printMessage.printLog('New name is ' + newPath)
                findAvailableName(dir, name).then((availableName) => {
                    newPath = join(dir, availableName)
                    cp(oldPath, newPath, { recursive: true }, (err) => {
                        if (err) {
                            reject("Error while copying file or folder: " + err)
                            return
                        }
                        printMessage.printOK("File or folder copied: " + oldPath + " -> " + newPath)
                        resolve()
                    })
                })
                    .catch((err) => {
                        reject("Error while copying file or folder: " + err)
                    })
            })
        }
        catch (e) {
            reject("Error while copying file or folder: " + e)
        }
    })
}

export async function openFileAndReadData(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            stat(filePath, (err, stats) => {
                if (err) {
                    reject("Error while getting file info: " + err)
                    return
                }

                if (stats.isDirectory()) {
                    reject("Error while getting file info: " + filePath + " is a folder")
                    return
                }

                readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        reject("Error while reading file: " + err)
                        return
                    }
                    resolve(data)
                })
            })
        }
        catch (e) {
            reject("Error while reading file: " + e)
        }
    })

}

export async function saveFile(filePath: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            stat(filePath, (err, stats) => {
                if (err) {
                    reject("Error while getting file info: " + err)
                    return
                }

                if (stats.isDirectory()) {
                    reject("Error while getting file info: " + filePath + " is a folder")
                    return
                }

                writeFile(filePath, data, (err) => {
                    if (err) {
                        reject("Error while writing file: " + err)
                        return
                    }
                    resolve()
                })
            })
        }
        catch (e) {
            reject("Error while writing file: " + e)
        }
    })
}

export function removeMD(file: File): File {
    if (file.name.endsWith('.md')) {
        file.name = file.name.slice(0, -3);
    }
    file.children = file.children.map((value:File) => {
        return removeMD(value)
    })
    return file
}
