/**
 * @file FileSystemModule.ts
 * @description This module contains functions to manage the file system
 */

import { shell } from 'electron'
import { cp, mkdir, readdir, readFile, rename, rm, stat, writeFile, existsSync } from 'original-fs'
import { join } from 'path'
import * as printMessage from './OutputModule'

const pathManage = require('pathmanage')

/**
 * Class representing a file or folder
 * @property name The name of the file or folder
 * @property isDirectory True if the file is a folder, false otherwise
 * @property createdTime The creation time of the file or folder
 * @property modifiedTime The last modification time of the file or folder
 * @property children The children of the folder (empty if the file is not a folder)
 * @property path The path of the file or folder
 */
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

/**
 * Finds the next available file name for a new file or folder.
 * @param dir:string The directory to search for a file name
 * @param name:string The name of the file or folder 
 * @returns:Promise<string> A promise that resolves to the next available file name
 */
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

/**
 * This function will return a promise that will resolve to an array of files. 
 * It will get the content of the folder * at the specified path. 
 * If the recursive flag is set to true, it will also get the content of all subfolders.
 * @param folderPath:string The path of the folder to get the content of
 * @param recursive:boolean If true, the function will get the content of the subfolders
 * @returns:Promise<File[]> A promise that resolves to an array of File objects
 */
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

/**
 * This function will delete a file or a folder
 * @param path:string The path of the file or folder to delete
 * @returns:Promise<void> A promise that resolves when the file or folder is deleted
 */
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

/**
 * This function will create a new note in the specified folder
 * @param dir:string The path of the folder where to create the note
 * @returns:string A promise that resolves to the path of the created note
 */
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

/**
 * This function will create a new folder in the specified folder
 * @param dir:string The path of the folder where to create the folder
 * @param folderName:string The name of the folder to create
 * @returns:string A promise that resolves to the File object of the created folder
 */
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

/**
 * Try to rename a file or a folder. If the new name is already taken, it will add a number at the end of the name to make it available
 * @param oldPath:string The path of the file or folder to rename
 * @param newPath:string The new path of the file or folder
 * @returns:Promise<void> A promise that resolves when the file or folder is renamed or rejected if an error occurs
 */
export async function renameFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    printMessage.printLog('In rename File or folder, oldPath is ' + oldPath + ' And new Path is ' + newPath)
    return new Promise((resolve, reject) => {
        if(oldPath == newPath){
            resolve()
            return
        } 
        try {
            stat(oldPath, (err, stats) => {
                if (err) {
                    reject("Error while getting file or folder info: " + err)
                    return
                }
                newPath =  pathManage.repairEndOfPath(newPath, stats.isDirectory())
                if (!stats.isDirectory()) {
                    if (!newPath.endsWith('.md')) {
                        newPath += '.md'
                    }
                }
                let name = pathManage.getName(newPath)
                let dir = pathManage.getParentPath(newPath)
                printMessage.printLog('New name is ' + newPath)
                findAvailableName(dir, name).then((availableName) => {
                    newPath = pathManage.joinPath(dir, availableName)
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

/**
 * Try to move a file or a folder. If the new path is already taken, it will add a number at the end of the name to make it available
 * @param oldPath:string The path of the file or folder to move
 * @param newPath:string The new path of the file or folder
 * @returns:Promise<void> A promise that resolves when the file or folder is moved or rejected if an error occurs
 */
export async function moveFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    printMessage.printLog('Enter in moveFileorFolder, oldpath is ' + oldPath + ' and newPath is ' + newPath)
    return new Promise((resolve, reject) => {
        try {
            stat(oldPath, (err, stats) => {
                if (err) {
                    reject("Error while getting file or folder info: " + err)
                    return
                }

                printMessage.printLog('in moveFileorFolder, newPath is ' + newPath)
                newPath =  pathManage.repairEndOfPath(newPath, stats.isDirectory())
                printMessage.printLog('in moveFileorFolder, after modify,  newPath is ' + newPath)
                if (!stats.isDirectory()) {
                    if (!newPath.endsWith('.md')) {
                        newPath += '.md'
                    }
                }
                let name = pathManage.getName(newPath)
                let dir = pathManage.getParentPath(newPath)
                printMessage.printLog('in moveFileorFolder, name is ' + name + ' and dir is ' + dir)
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

/**
 * Try to copy a file or a folder. If the new path is already taken, it will add a number at the end of the name to make it available
 * @param oldPath:string The path of the file or folder to copy
 * @param newPath:string The new path of the file or folder
 * @returns 
 */
export async function copyFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            stat(oldPath, (err, stats) => {
                if (err) {
                    reject("Error while getting file or folder info: " + err)
                    return
                }

                newPath =  pathManage.repairEndOfPath(newPath, stats.isDirectory())
                if (!stats.isDirectory()) {
                    if (!newPath.endsWith('.md')) {
                        newPath += '.md'
                    }
                }
                let name = pathManage.getName(newPath)
                let dir = pathManage.getParentPath(newPath)
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

/**
 * The function takes a file path and returns a promise that resolves to the file contents. The file contents are read as a string and  * the promise is rejected if the file path is a directory or if there is an error.
 * @param filePath:string The path of the file to read
 * @returns:Promise<string> A promise that resolves to the file contents or rejects if an error occurs or if the file path is a directory
 */
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

/**
 * Writes the file to the specified file path.
 * @param filePath:string The path of the file to write
 * @param data:string The data to write in the file
 * @returns:Promise<void> A promise that resolves when the file is written or rejected if an error occurs
 */
export async function saveFile(filePath: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            writeFile(filePath, data, (err) => {
                if (err) {
                    reject("Error while writing file: " + err)
                    return
                }
                resolve()
                })
        }
        catch (e) {
            reject("Error while writing file: " + e)
        }
    })
}

/**
 * Remove the .md extension from a file name. Also Remove the .md extension from all the children of the file.
 * @param file:File The file to remove the .md extension from
 * @returns:File The file without the .md extension and without the .md extension from all the children
 */
export function removeMD(file: File): File {
    if (file.name.endsWith('.md')) {
        file.name = file.name.slice(0, -3);
    }
    file.children = file.children.map((value:File) => {
        return removeMD(value)
    })
    return file
}

/**
 * Replace all the '\' by '/' in a file path. Also replace all the '\' by '/' in all the children of the file.
 * @param file:File The file to replace the '\' by '/' in
 * @returns:File The file with all the '\' replaced by '/' and with all the '\' replaced by '/' in all the children
 */
export function convertAllCrossPath(file:File){
    file.path = pathManage.convertCrossPath(file.path)
    file.children = file.children.map((value:File) => {
        return convertAllCrossPath(value)
    })
    return file
}

/**
 * Takes an array of strings and returns a new array with the non-existent paths removed.
 * @param paths:string[] The array of paths to check
 * @returns:string[] The array of paths without the non-existent paths
 */
export function removeNonExistentPath(paths: string[]): string[] {
    return paths.filter((path) => {
        return existsSync(path)
    })
}
