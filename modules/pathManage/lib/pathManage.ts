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

