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
    currSortOrder = sortOrder
    switch (currSortOrder) {
        case 'name-asc':
            files.sort((a: any, b: any) => a.name.localeCompare(b.name))
            break
        case 'name-desc':
            files.sort((a: any, b: any) => b.name.localeCompare(a.name))
            break
        case 'modified-desc':
            files.sort((a: any, b: any) => b.modifiedTime - a.modifiedTime)
            break
        case 'modified-asc':
            files.sort((a: any, b: any) => a.modifiedTime - b.modifiedTime)
            break
        case 'created-desc':
            files.sort((a: any, b: any) => b.createdTime - a.createdTime)
            break
        case 'created-asc':
            files.sort((a: any, b: any) => a.createdTime - b.createdTime)
            break
    }
    files.forEach((file: any) => {
        if (file.isDirectory) {
            changeSortOrderRecursive(file.children)
        }
    })
}


/**
 * Get the parent folder of a note or folder
 * @param path           the path of the note or folder
 * @param files          the tree of files and folders
 * @returns              the parent folder of the note or folder
 */
function getParentFolder(path: string, files: any): any|null {
    let parentFolder: File|null = null
    let parentFolderPath: string = path.substring(0, path.lastIndexOf('/'))

    files.forEach((file: any) => {
        if (file.path === parentFolderPath) {
            parentFolder = file
        }
        else if (file.isDirectory) {
            let folder = getParentFolder(path, file.children)
            if (folder) {
                parentFolder = folder
            }
        }
    })
    return parentFolder
}


/**
 * Add a new note or folder in the right place in the tree of files and folders
 * @param newNoteOrFolder the new note or folder to add
 * @param files           the tree of files and folders
 * @returns               the tree of files and folders with the new note or folder added
 */
export function addNoteOrFolder(newNoteOrFolder: any, files: any) {
    if (files.length === 0) {
        files.push(newNoteOrFolder)
        return files
    }

    let folderWhereToInsert = getParentFolder(newNoteOrFolder.path, files)
    if (!folderWhereToInsert) {
        files.push(newNoteOrFolder)
        changeSortOrderRecursive(files)
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
 * @returns              the tree of files and folders with the note or folder modified
 */
export function modifyNoteOrFolder(noteOrFolder: any, files: any) {
    let folderContainingNoteOrFolder = getParentFolder(noteOrFolder.path, files)
    if (!folderContainingNoteOrFolder) {
        return;
    }

    let noteOrFolderIndex = folderContainingNoteOrFolder.findIndex((file: any) => file.path === noteOrFolder.path)
    folderContainingNoteOrFolder[noteOrFolderIndex] = { ...noteOrFolder }

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
    let filesCopy = [...theFiles]
    filesCopy.forEach((file: any, index: number) => {
        if (file.path === path) {
            filesCopy.splice(index, 1)
        } else if (file.isDirectory) {
            file.children = deleteNoteOrFolder(file.children, path)
        }
    })
    return filesCopy
}
