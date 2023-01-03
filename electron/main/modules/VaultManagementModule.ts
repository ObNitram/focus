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

export function getFolderContent(folderPath: string, recursive: boolean = false) {
    return FileSystemModule.getFolderContent(folderPath, recursive)
}

export default FileSystemModule.File