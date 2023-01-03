var colors = require('colors/safe');


export function printError(msg:string){
    console.log(colors.red('[ERROR] '+ msg))
}

export function printOK(msg:string){
    console.log(colors.green('[OK] '+ msg))
}

export function printINFO(msg:string){
    console.log(colors.blue('[INFO] '+ msg))
}