import fs from 'fs'
import {app} from 'electron'

const pathConfigFolder:string = app.getPath('appData')+ '/focus/'
const vaultConfigFileName:string = 'vaultConfig.json'

type vaultConfigFileNameType = {
    location:string;
}

let pathVault:string|null = null;

export function initConfig(){
    if(fs.existsSync(pathConfigFolder)) return true;
    try {
        fs.mkdirSync(pathConfigFolder)
    } catch (error) {
        console.log(error)
        return false
    }
    console.log(pathConfigFolder+vaultConfigFileName)
    if(! fs.existsSync(pathConfigFolder+vaultConfigFileName)){
        fs.writeFileSync(pathConfigFolder+vaultConfigFileName, JSON.stringify({
            location: null
        }))
        return true
    }
    let data = fs.readFileSync(pathConfigFolder+vaultConfigFileName, 'utf8');
    if(data){
        try {
            let res:vaultConfigFileNameType = JSON.parse(data)
            pathVault = res.location
            return true
        } catch (error) {
            return false
        }
    }else{
        return false
    }
}



export function getPathVault(){
    return pathVault
}

export function setPathVault(path:string){
    pathVault = path
}