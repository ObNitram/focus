const upath = require ('upath')
const Path = require('path')

export function getName(path:string):string{
    let transformedPath = upath.normalizeTrim(path)
    let tableElem:string[] = transformedPath.split('/');
    return tableElem.at(-1) as string
}

export function getParentPath(path:string){
    let parentPath = Path.dirname(path)
    return parentPath.concat(getSeperatorOfSystem())
}

export function convertCrossPath(path:string):string{
    return upath.normalizeSafe(path)
}

export function getSeperatorOfSystem():string{
    return Path.sep
}

export function joinPath(path1:string, path2:string):string{
    return Path.join(path1, path2)
}

export function repairEndOfPath(path:string, isDirectory:boolean):string{
    if(isDirectory){
        if(!path.endsWith(getSeperatorOfSystem())){
            return path.concat(getSeperatorOfSystem())
        }else{
            return path
        }
    }else{
        if(path.endsWith(getSeperatorOfSystem())){
            return path.slice(0, -1)
        }else{
            return path
        }
    }
}

export function renamePath(path:string, newName:string):string{
    path = removeDuplicate(path)
    let parts = path.split(getSeperatorOfSystem())
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
        if(char == getSeperatorOfSystem()){
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

