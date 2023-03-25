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

export function pathIsInFiles(files:any, path:string) {
    if (files.path === path) {
        return true;
    }
    if (files.children) {
        for (let i = 0; i < files.children.length; i++) {
            if (pathIsInFiles(files.children[i], path)) {
                return true;
            }
        }
    }
    return false;
}

export function setRealName(theFiles:any){
    theFiles.name = pathManage.getName(theFiles.name)
    theFiles.children.forEach((child:any) => {
        setRealName(child)
    })
}
