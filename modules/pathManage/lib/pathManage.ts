
import * as Path from 'path'
import {normalizeTrim, normalizeSafe} from 'upath'

export function getName(path:string):string{
    let transformedPath = normalizeTrim(path)
    let tableElem:string[] = transformedPath.split('/');
    return tableElem.at(-1) as string
}

export function getParentPath(path:string){
    let parentPath = Path.dirname(path)
    return parentPath.concat('/')
}

export function convertCrossPath(path:string):string{
    return normalizeSafe(path)
}

export function getSeperatorOfSystem():string{
    return Path.sep
}

export function joinPath(path1:string, path2:string):string{
    return convertCrossPath(Path.join(path1, path2))
}

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
