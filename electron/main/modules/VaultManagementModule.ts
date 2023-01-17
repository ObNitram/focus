import * as FileSystemModule from './FileSystemModule'

let pathVault:string|null = null;
let currentOpenedNotePath:string|null = null;

export function getPathVault(){
    return pathVault
}

export function setPath(path:string){
    pathVault = path
}

export async function createFolder(dir: string, folderName: string):Promise<FileSystemModule.File> {
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

    let newPath = oldPath.replace(/[^\/]*$/, newName)
    if (oldPath.endsWith('.md')) {
        newPath += '.md'
    }
    return FileSystemModule.renameFileOrFolder(oldPath, newPath)
}

export async function getVaultContent(): Promise<FileSystemModule.File> {
    return new Promise<FileSystemModule.File>((resolve, reject) => {
        FileSystemModule.getFolderContent(pathVault, true).then((value: FileSystemModule.File) => {
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

export function openFile(filePath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (currentOpenedNotePath) {
            // TODO: save current note
            currentOpenedNotePath = null
        }
        FileSystemModule.openFileAndReadData(filePath).then((value) => {
            currentOpenedNotePath = filePath
            resolve(value)
        }).catch((reason) => reject(reason))
    })
}

export function saveOpenedFile(data: string, closeFile: boolean = false): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        FileSystemModule.saveFile(currentOpenedNotePath, data).then(() => {
            if (closeFile) {
                currentOpenedNotePath = null
            }
            resolve()
        }).catch((reason) => reject(reason))
    })
}

export default FileSystemModule.File
