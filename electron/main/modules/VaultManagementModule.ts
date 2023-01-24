import { dialog } from 'electron';
import * as FileSystemModule from './FileSystemModule'
import { printLog } from './OutputModule';

import * as pathManage from 'pathmanage'

let pathVault: string | null = null;
let currentOpenedNotePath: string | null = null;

export function getPathVault() {
    return pathVault
}

export function setPath(path: string) {
    pathVault = path
}

export async function createFolder(dir: string, folderName: string): Promise<FileSystemModule.File> {
    return FileSystemModule.createFolder(dir, folderName)
}

export async function createNote(dir: string): Promise<FileSystemModule.File> {
    return FileSystemModule.createNote(dir)
}

export async function deleteFileOrFolder(path: string): Promise<void> {
    return FileSystemModule.deleteFileOrFolder(path)
}

export async function moveFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    return FileSystemModule.moveFileOrFolder(oldPath, newPath)
}

export async function copyFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    return FileSystemModule.copyFileOrFolder(oldPath, newPath)
}

export async function renameFileOrFolder(oldPath: string, newName: string): Promise<void> {
    if (!oldPath || !newName) {
        return Promise.reject('Invalid parameters')
    }
    if (oldPath === newName) {
        return Promise.resolve()
    }

    let newPath = pathManage.joinPath(pathManage.getParentPath(oldPath), newName)
    if (oldPath.endsWith('.md')) {
        newPath += '.md'
    }
    return FileSystemModule.renameFileOrFolder(oldPath, newPath)
}

export async function getVaultContent(): Promise<FileSystemModule.File> {
    return new Promise<FileSystemModule.File>((resolve, reject) => {
        FileSystemModule.getFolderContent(pathVault, true).then((value: FileSystemModule.File) => {
            value = FileSystemModule.convertAllCrossPath(value)
            resolve(FileSystemModule.removeMD(value))
        }).catch((reason) => reject(reason))
    })
}

export async function getNoteOrFolderInfo(path: string, recursive: boolean = false): Promise<FileSystemModule.File> {
    return FileSystemModule.getFileOrFolderInfo(path, recursive)
}

export function showInExplorer(folderPath: string): void {
    return FileSystemModule.showInExplorer(folderPath)
}

export function openFile(filePath: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        FileSystemModule.openFileAndReadData(filePath).then((value) => {
            resolve([value, filePath])
        }).catch((reason) => reject(reason))
    })
}

export function saveFile(data: string, path:string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        FileSystemModule.saveFile(path, data).then(() => {
            resolve()
        }).catch((reason) => reject(reason))
    })
}

export function getOpenedFilePath(): string | null {
    return currentOpenedNotePath
}

/**
 * Show a dialog to the user to confirm if he wants to continue without saving the current note
 * @returns {boolean} true if the user wants to continue, false otherwise
 */
export function alertUserNoteNotSaved(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        if (currentOpenedNotePath) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Note not saved',
                message: 'You have unsaved changes in your note. Do you really want to continue?\nIf you continue, your changes will be lost.',
                buttons: ['Cancel', 'Continue']
            }).then((value) => {
                if (value.response === 1) {
                    currentOpenedNotePath = null
                    resolve(true)
                }
                resolve(false)
            })
        }
        else {
            resolve(false)
        }
    })
}

export default FileSystemModule.File
