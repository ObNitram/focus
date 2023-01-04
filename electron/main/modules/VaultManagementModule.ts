import * as FileSystemModule from './FileSystemModule'

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

export function getFolderContent(folderPath: string, recursive: boolean = false) {
    return FileSystemModule.getFolderContent(folderPath, recursive)
}

export function showInExplorer(folderPath: string) {
    return FileSystemModule.showInExplorer(folderPath)
}

export default FileSystemModule.File
