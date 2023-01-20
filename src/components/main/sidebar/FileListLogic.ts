const pathManage = require('pathmanage')


export enum SORT_ORDER {
    NAME_ASC = 'name-asc',
    NAME_DESC = 'name-desc',
    MODIFIED_ASC = 'modified-asc',
    MODIFIED_DESC = 'modified-desc',
    CREATED_ASC = 'created-asc',
    CREATED_DESC = 'created-desc',
}
let currSortOrder: SORT_ORDER = SORT_ORDER.NAME_ASC


/**
 * change sort order of files and folders recursively
 * @param files     the tree of files and folders to sort
 * @param sortOrder the sort order to use
 */
export function changeSortOrderRecursive(files: any, sortOrder: SORT_ORDER = currSortOrder) {
    if (!files || !files.children) {
        return
    }
    currSortOrder = sortOrder
    switch (currSortOrder) {
        case 'name-asc':
            files.children.sort((a: any, b: any) => a.name.localeCompare(b.name))
            break
        case 'name-desc':
            files.children.sort((a: any, b: any) => b.name.localeCompare(a.name))
            break
        case 'modified-desc':
            files.children.sort((a: any, b: any) => b.modifiedTime - a.modifiedTime)
            break
        case 'modified-asc':
            files.children.sort((a: any, b: any) => a.modifiedTime - b.modifiedTime)
            break
        case 'created-desc':
            files.children.sort((a: any, b: any) => b.createdTime - a.createdTime)
            break
        case 'created-asc':
            files.children.sort((a: any, b: any) => a.createdTime - b.createdTime)
            break
    }
    files.children.forEach((file: any) => {
        if (file.isDirectory) {
            changeSortOrderRecursive(file.children)
        }
    })
}


/**
 * Get the parent folder of a note or folder
 * @param path           the path of the note or folder
 * @param files          the tree of files and folders
 * @param mainFolderPath the path of the main folder
 * @returns              the parent folder of the note or folder
 */
function getParentFolder(path: string, files: any, mainFolderPath: string): any | null {
    if (path === mainFolderPath) {
        return null
    }

    let parentFolderPath = path.substring(0, path.lastIndexOf(pathManage.getSeperatorOfSystem()))
    if (parentFolderPath === mainFolderPath) {
        return files
    }

    let parentFolder = getParentFolder(parentFolderPath, files, mainFolderPath)
    if (!parentFolder) {
        return null
    }

    let folder = parentFolder.children.find((file: any) => file.path === parentFolderPath)
    if (!folder) {
        return null
    }

    return folder
}


/**
 * Add a new note or folder in the right place in the tree of files and folders
 * @param newNoteOrFolder the new note or folder to add
 * @param files           the tree of files and folders
 * @param mainFolderPath  the path of the main folder
 * @returns               the tree of files and folders with the new note or folder added
 */
export function addNoteOrFolder(newNoteOrFolder: any, files: any, mainFolderPath: string) {
    newNoteOrFolder.name = pathManage.getName(newNoteOrFolder.name)
    let folderWhereToInsert = getParentFolder(newNoteOrFolder.path, files, mainFolderPath)
    if (!folderWhereToInsert) {
        return files
    }

    folderWhereToInsert.children.push(newNoteOrFolder)
    changeSortOrderRecursive(files)
    return files
}


/**
 * Modify a note or folder in the tree of files and folders
 * @param noteOrFolder   the note or folder to modify
 * @param files          the tree of files and folders
 * @param mainFolderPath the path of the main folder
 * @returns              the tree of files and folders with the note or folder modified
 */
export function modifyNoteOrFolder(noteOrFolder: any, files: any, mainFolderPath: string) {
    let folderContainingNoteOrFolder = getParentFolder(noteOrFolder.path, files, mainFolderPath)
    if (!folderContainingNoteOrFolder) {
        return files
    }

    let noteOrFolderIndex = folderContainingNoteOrFolder.children.findIndex((file: any) => file.path === noteOrFolder.path)
    folderContainingNoteOrFolder.children[noteOrFolderIndex] = { ...noteOrFolder }

    changeSortOrderRecursive(files)
    return files
}


/**
 * Delete a note or folder in the tree of files and folders
 * @param theFiles the tree of files and folders
 * @param path     the path of the note or folder to delete
 * @returns        the tree of files and folders with the note or folder deleted
 */
export function deleteNoteOrFolder(theFiles: any, path: string) {
    let folderContainingNoteOrFolder = getParentFolder(path, theFiles, theFiles.path)
    if (!folderContainingNoteOrFolder) {
        return theFiles
    }

    let noteOrFolderIndex = folderContainingNoteOrFolder.children.findIndex((file: any) => file.path === path)
    folderContainingNoteOrFolder.children.splice(noteOrFolderIndex, 1)

    return theFiles
}

export function setRealName(theFiles:any){
    theFiles.name = pathManage.getName(theFiles.name)
    theFiles.children.forEach((child:any) => {
        setRealName(child)
    })
}
