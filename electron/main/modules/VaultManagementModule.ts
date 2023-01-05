import * as FileSystemModule from './FileSystemModule'

let pathVault:string|null = null;

export function getPathVault(){
    return pathVault
}

export function setPath(path:string){
    pathVault = path
}

export function createFolder(dir: string, folderName: string) {
    return FileSystemModule.createFolder(dir, folderName)
}

export function createNote(dir: string) {
    return FileSystemModule.createNote(dir)
}

export function deleteFileOrFolder(path: string): boolean {
    return FileSystemModule.deleteFileOrFolder(path)
}

export function renameFileOrFolder(oldPath: string, newName: string): boolean {
    let newPath = oldPath.replace(/[^\/]*$/, newName)
    return FileSystemModule.renameFileOrFolder(oldPath, newPath)
}

export function getVaultContent() {
    return FileSystemModule.getFolderContent(pathVault, true)
}

export function showInExplorer(folderPath: string) {
    return FileSystemModule.showInExplorer(folderPath)
}

export default FileSystemModule.File
