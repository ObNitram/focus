/**
 * @file pathManage.ts
 * @description Entry point of the pathManage module. Export all functions for manage cross-platform path
 */
import * as Path from 'path'
import {normalizeTrim, normalizeSafe} from 'upath'

/**
 * @description Get the name of a path, never mind the system
 * @param path: string - The path to get the name
 * @returns: string - The name of the file or directory
 */
export function getName(path:string):string{
    let transformedPath = normalizeTrim(path)
    let tableElem:string[] = transformedPath.split('/');
    return tableElem.at(-1) as string
}

/**
 * @description Get the parent path of a path, never mind the system
 * @param path: string - The path to get the parent path
 * @returns: string - The parent path
 */
export function getParentPath(path:string){
    let parentPath = Path.dirname(path)
    return parentPath.concat('/')
}

/**
 * @description Convert a path to a cross-platform path, replace all \ by /
 * @param path: string - The path to convert
 * @returns: string - The converted path
 */
export function convertCrossPath(path:string):string{
    return normalizeSafe(path)
}

/**
 * @description Get the separator of the system
 * @returns: string - The separator of the system, / for linux and mac, \ for windows
 */
export function getSeperatorOfSystem():string{
    return Path.sep
}

/**
 * @description Join two path, never mind the system
 * @param path1: string - The first path
 * @param path2: string - The second path
 * @returns: string - The joined path
 */
export function joinPath(path1:string, path2:string):string{
    return convertCrossPath(Path.join(path1, path2))
}

/**
 * @description Add a separator at the end of a path if is a directory and if is not already present. 
                Remove the separator if is not a directory and if is present.
 * @param path: string - The path to repair
 * @param isDirectory: boolean - If the path is a directory
 * @returns: string - The repaired path
 */
export function repairEndOfPath(path:string, isDirectory:boolean):string{
    if(isDirectory){
        if(!path.endsWith('/')){
            return path.concat('/')
        }else{
            return path
        }
    }else{
        if(path.endsWith('/')){
            return path.slice(0, -1)
        }else{
            return path
        }
    }
}

/**
 * @description Rename a path, never mind the system
 * @param path: string - The path to rename
 * @param newName: string - The new name of the path
 * @returns: string - The renamed path
 */
export function renamePath(path:string, newName:string):string{
    path = removeDuplicate(path)
    let parts = path.split('/')
    let newPath =''
    if(parts[parts.length - 1] == ''){
        parts[parts.length - 2] = newName
    }else{
        parts[parts.length - 1] = newName
    }
    return parts.join('/')
}

/**
 * @description Remove duplicate / in a path
 * @param path: string - The path to repair
 * @returns: string - The repaired path
 */
export function removeDuplicate(path:string):string{
    let newPath = '';
    let remove:boolean = false;
    for(let char of path){
        if(char == '/'){
            if(!remove){
                remove = true 
                 newPath = newPath.concat(char)  
            }
        }else{
            remove=false
            newPath = newPath.concat(char)  
        }

    }
    return newPath
}

