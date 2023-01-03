import fs from 'fs'
import {app} from 'electron'
import * as outPut from './OutputModule'

const pathConfigFolder:string = app.getPath('appData')+ '/focus/'
const vaultConfigFileName:string = 'vaultConfig.json'

type vaultConfigFileNameType = {
    location:string;
}

let pathVault:string|null = null;

export function initConfig(){
    if(!fs.existsSync(pathConfigFolder)) {
        outPut.printINFO('Config folder not found in ' + pathConfigFolder)
        outPut.printINFO('Try to create ' + pathConfigFolder+ '...')
        try {
            fs.mkdirSync(pathConfigFolder)
            outPut.printOK('Setting folder created !')
        } catch (error) {
            outPut.printError('Failed to create the folder. Aborting.')
            console.log(error)
            return false
        }
    }
    if(! fs.existsSync(pathConfigFolder+vaultConfigFileName)){
        outPut.printINFO('Config file '+ pathConfigFolder+vaultConfigFileName + 'not found !')
        try{
            outPut.printINFO('Try to create ' + pathConfigFolder+vaultConfigFileName+ '...')
            fs.writeFileSync(pathConfigFolder+vaultConfigFileName, JSON.stringify({
                location: null
            }))
            outPut.printOK('File created !')
        }catch(error){
            outPut.printError('Failed to create the file. Aborting.')
            return false;
        }
        return true
    }
    let data;
    try{
        data = fs.readFileSync(pathConfigFolder+vaultConfigFileName, 'utf8');
    }catch(error){
        outPut.printError('Failed to read setting !')
        return false
    }
    if(data){
        try {
            let res:vaultConfigFileNameType = JSON.parse(data)
            pathVault = res.location
            outPut.printOK('Congig is OK!')
            return true
        } catch (error) {
            console.log(error)
            outPut.printError('Failed to get setting. Aborting...')
            return false
        }
    }else{
        outPut.printError('Failed to get setting. Aborting...')
        return false
    }
}



export function getPathVault(){
    return pathVault
}

export function setPathVault(path:string){
    pathVault = path
}

export function saveInSettingPathVault(path:string):boolean{
    if(initConfig() == false) return false
    if(! fs.existsSync(path)) return false
    try{
        let contentSettingFile:vaultConfigFileNameType = JSON.parse(fs.readFileSync(pathConfigFolder+vaultConfigFileName, 'utf8'))
        contentSettingFile.location = path
        fs.writeFileSync(pathConfigFolder+vaultConfigFileName, JSON.stringify(contentSettingFile))
    }catch(error){
        return false
    }
    return true
}