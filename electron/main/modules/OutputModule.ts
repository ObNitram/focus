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

export function printLog(msg:string){
    if(process.env.VITE_DEV_SERVER_URL) console.log(colors.yellow('[LOG] '+ msg))
}