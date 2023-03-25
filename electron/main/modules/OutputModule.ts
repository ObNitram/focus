/**
 * @file OutputModule.ts
 * @description Contains function for print colored messages in the console
 */
var colors = require('colors/safe');

/**
 * @description Print a red error message in the console
 * @param msg:string The message to print
 */
export function printError(msg:string){
    console.log(colors.red('[ERROR] '+ msg))
}

/**
 * @description Print a green validation message in the console
 * @param msg:string The message to print
 */
export function printOK(msg:string){
    console.log(colors.green('[OK] '+ msg))
}

/**
 * @description Print a blue information message in the console
 * @param msg:string The message to print
 */
export function printINFO(msg:string){
    console.log(colors.blue('[INFO] '+ msg))
}

/**
 * @description Print a yellow log message in the console if the app is in dev mode
 * @param msg:string The message to print
 */
export function printLog(msg:string){
    if(process.env.VITE_DEV_SERVER_URL) console.log(colors.yellow('[LOG] '+ msg))
}