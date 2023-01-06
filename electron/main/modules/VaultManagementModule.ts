import * as FileSystemModule from './FileSystemModule'

export function createFolder(dir: string, folderName: string): Promise<FileSystemModule.File> {
    return FileSystemModule.createFolder(dir, folderName)
}

export function createNote(dir: string): Promise<FileSystemModule.File> {
    return FileSystemModule.createNote(dir)
}

export function deleteFileOrFolder(path: string): Promise<boolean> {
    return FileSystemModule.deleteFileOrFolder(path)
}

export function renameFileOrFolder(oldPath: string, newName: string): Promise<boolean> {
    let newPath = oldPath.replace(/[^\/]*$/, newName)
    return FileSystemModule.renameFileOrFolder(oldPath, newPath)
}

export function getFolderContent(folderPath: string, recursive: boolean = false): Promise<FileSystemModule.File> {
    return FileSystemModule.getFolderContent(folderPath, recursive)
}

export function showInExplorer(folderPath: string): void {
    return FileSystemModule.showInExplorer(folderPath)
}

export function getNoteOrFolderInfo(path: string): Promise<FileSystemModule.File> {
    return FileSystemModule.getFileOrFolderInfo(path)
}

export default FileSystemModule.File
