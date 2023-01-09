import fs from 'fs'
import {app} from 'electron'
import * as outPut from './OutputModule'
import * as vaultManagement from './VaultManagementModule'

const pathConfigFolder:string = app.getPath('appData')+ '/focus/'
const vaultConfigFileName:string = 'vaultConfig.json'

type vaultConfigFileNameType = {
    location:string;
}


export function initConfig(){
    if(!fs.existsSync(pathConfigFolder)) {
        outPut.printINFO('Config folder not found in ' + pathConfigFolder)
        outPut.printINFO('Try to create ' + pathConfigFolder+ '...')
        try {
            fs.mkdirSync(pathConfigFolder)
            outPut.printOK('Setting folder created !')
        } catch (error) {
            outPut.printError('Failed to create the folder. Aborting.')
            return false
        }
    }
    if(! fs.existsSync(pathConfigFolder+vaultConfigFileName)){
        outPut.printINFO('Config file '+ pathConfigFolder+vaultConfigFileName + ' not found !')
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
            vaultManagement.setPath(res.location)
            outPut.printOK('Congig is OK!')
            return true
        } catch (error:any) {
            outPut.printError('Failed to get setting. Aborting...')
            return false
        }
    }else{
        outPut.printError('Failed to get setting. Aborting...')
        return false
    }
}





export function saveInSettingPathVault(path:string):boolean{
    outPut.printINFO("Try to save user's vault path...")
    if(initConfig() == false){
        outPut.printError('An error occur, the config is corrupted. User\'s path not saved!')
        return false
    }
    if(! fs.existsSync(path)){
        outPut.printError('An error occur, The require path doesn\'t exist !')
        return false
    }
    try{
        let contentSettingFile:vaultConfigFileNameType = JSON.parse(fs.readFileSync(pathConfigFolder+vaultConfigFileName, 'utf8'))
        contentSettingFile.location = path
        fs.writeFileSync(pathConfigFolder+vaultConfigFileName, JSON.stringify(contentSettingFile))
    }catch(error){
        outPut.printError('An error occured while trying to save the path in file system.')
        return false
    }
    vaultManagement.setPath(path)
    outPut.printOK('Path is saved !')
    return true
}