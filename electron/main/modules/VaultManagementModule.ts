import { dialog } from 'electron';
import * as FileSystemModule from './FileSystemModule'

import * as pathManage from 'pathmanage'
import { printError, printINFO } from './OutputModule';
import { copyEditorExtraFeaturesNoteToNewPath, deleteEditorExtraFeaturesPath, updateEditorExtraFeaturesPath } from './ManageConfig';

let pathVault: string | null = null;

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
    deleteEditorExtraFeaturesPath(path).then((result) => {
        printINFO(result)
    }).catch((reason) => {
        printError(reason)
    })
    return FileSystemModule.deleteFileOrFolder(path)
}

export async function moveFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    updateEditorExtraFeaturesPath(oldPath, newPath).then((result) => {
        printINFO(result)
    }).catch((reason) => {
        printError(reason)
    })
    return FileSystemModule.moveFileOrFolder(oldPath, newPath)
}

export async function copyFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    copyEditorExtraFeaturesNoteToNewPath(oldPath, newPath).then((result) => {
        printINFO(result)
    }).catch((reason) => {
        printError(reason)
    })

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
    updateEditorExtraFeaturesPath(oldPath, newPath).then((result) => {
        printINFO(result)
    }).catch((reason) => {
        printError(reason)
    })
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


export default FileSystemModule.File
