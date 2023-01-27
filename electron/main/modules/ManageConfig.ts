import fs from 'fs'
import {app} from 'electron'
import * as outPut from './OutputModule'
import * as vaultManagement from './VaultManagementModule'

const pathConfigFolder:string = app.getPath('appData')+ '/focus/'
const vaultConfigFileName:string = 'vaultConfig.json'
const generalConfigFileName: string = 'generalConfig.json'
const editorExtraFeaturesConfigFileName:string = 'editorExtraFeaturesConfig.json'

type vaultConfigFileNameType = {
    location:string;
}

type generalConfigType = {
    size_sidebar: number
}

let generalConfig:generalConfigType|null = null

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
            outPut.printOK('Config is OK!')
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

export function initGeneralConfig():boolean{
    if(! fs.existsSync(pathConfigFolder+generalConfigFileName)){
        outPut.printINFO('Config file '+ pathConfigFolder+generalConfigFileName + ' not found !')
        try{
            outPut.printINFO('Try to create ' + pathConfigFolder+generalConfigFileName+ '...')
            fs.writeFileSync(pathConfigFolder+generalConfigFileName, JSON.stringify({
                size_sidebar: 300
            }))
            outPut.printOK('File created !')
        }catch(error){
            outPut.printError('Failed to create the file. Aborting.')
            return false;
        }
    }
    let data;
    try{
        data = fs.readFileSync(pathConfigFolder+generalConfigFileName, 'utf8');
    }catch(error){
        outPut.printError('Failed to read setting !')
        return false
    }
    if(data){
        try {
            let res:generalConfigType = JSON.parse(data)
            generalConfig = res
            outPut.printOK('Config is OK!')
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

export function initConfigEditorExtraFeature(): boolean {
    outPut.printINFO('Try to init config editor extra feature...')
    if(! fs.existsSync(pathConfigFolder+editorExtraFeaturesConfigFileName)){
        outPut.printINFO('Config file '+ pathConfigFolder+editorExtraFeaturesConfigFileName + ' not found !')
        try{
            outPut.printINFO('Try to create ' + pathConfigFolder+editorExtraFeaturesConfigFileName+ '...')
            fs.writeFileSync(pathConfigFolder+editorExtraFeaturesConfigFileName, '{}')
            outPut.printOK('File created !')
        }catch(error){
            outPut.printError('Failed to create the file. Aborting.')
            return false;
        }
    }
    return true;
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

export function getSizeSidebar():number{
    return generalConfig.size_sidebar
}

export async function saveSizeSideBar(newSize:number):Promise<string>{
    return new Promise((resolve, reject) => {
        outPut.printINFO('Try to save user\'s size of sidebar')
        if(initGeneralConfig() == false){
            reject('An error occur, the config is corrupted. User\'s size of sidebar not saved!')
        }
        if(newSize < 0){
            reject('An error occur, the data is invalid. User\'s size of sidebar not saved!')
        }
        generalConfig.size_sidebar = newSize
        try{
            fs.writeFileSync(pathConfigFolder+generalConfigFileName, JSON.stringify(generalConfig))
        }catch(error){
            reject('An error occured while trying to save general config in file system.')
        }
        resolve('Size of sidebar is saved')
    })
}

export function saveEditorExtraFeature(notePath: string, nodePath: string, key: string, value: any) {
    outPut.printINFO('Try to save editor extra feature...')
    fs.readFile(pathConfigFolder+editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
        if(err){
            outPut.printError('Failed to read editor extra feature config file !')
            return
        }
        let content: JSON = JSON.parse(data);
        if(!content[notePath]){
            content[notePath] = {}
        }
        content[notePath][nodePath + '.' + key] = value
        fs.writeFile(pathConfigFolder+editorExtraFeaturesConfigFileName, JSON.stringify(content), (err) => {
            if(err){
                outPut.printError('Failed to save editor extra feature config file !')
                return
            }
            outPut.printOK('Editor extra feature saved !')
        })
    })
}

export function extraFeaturesExtistForNote(notePath: string): Promise<boolean> {
    outPut.printINFO('Try to check if extra features exist for note...')

    return new Promise((resolve, reject) => {
        fs.readFile(pathConfigFolder+editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if(err){
                outPut.printError('Failed to read editor extra feature config file !')
                reject(false)
            }
            let content: JSON = JSON.parse(data);
            if(!content[notePath]){
                resolve(false)
            }
            resolve(true)
        })
    })
}

export function getEditorExtraFeature(notePath: string, nodePath: string, key: string): any {
    outPut.printINFO('Try to get editor extra feature...')

    let content: JSON = JSON.parse(fs.readFileSync(pathConfigFolder+editorExtraFeaturesConfigFileName, 'utf8'));
    if(!content[notePath]){
        return null
    }
    return content[notePath][nodePath + '.' + key]
}

export function updateEditorExtraFeaturesPath(oldPath: string, newPath: string): Promise<string> {
    outPut.printINFO('Try to update editor extra features path...')

    return new Promise((resolve, reject) => {
        fs.readFile(pathConfigFolder+editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if(err){
                reject('Failed to read editor extra feature config file !')
            }
            let content: JSON = JSON.parse(data);
            if(!content[oldPath]){
                resolve('No extra features for this note')
            }
            content[newPath] = content[oldPath]
            delete content[oldPath]
            fs.writeFile(pathConfigFolder+editorExtraFeaturesConfigFileName, JSON.stringify(content), (err) => {
                if(err){
                    reject('Failed to save editor extra feature config file !')
                }
                resolve('Editor extra feature saved !')
            })
        })
    })
}

export function deleteEditorExtraFeaturesPath(notePath: string): Promise<string> {
    outPut.printINFO('Try to delete editor extra features path...')

    return new Promise((resolve, reject) => {
        fs.readFile(pathConfigFolder+editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if(err){
                reject('Failed to read editor extra feature config file !')
            }
            let content: JSON = JSON.parse(data);
            if(!content[notePath]){
                resolve('No extra features for this note')
            }
            delete content[notePath]
            fs.writeFile(pathConfigFolder+editorExtraFeaturesConfigFileName, JSON.stringify(content), (err) => {
                if(err){
                    reject('Failed to save editor extra feature config file !')
                }
                resolve('Editor extra feature saved !')
            })
        })
    })
}

export function copyEditorExtraFeaturesNoteToNewPath(path: string, newPath: string): Promise<string> {
    outPut.printINFO('Try to copy editor extra features note to new path...')

    return new Promise((resolve, reject) => {
        fs.readFile(pathConfigFolder+editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if(err){
                reject('Failed to read editor extra feature config file !')
            }
            let content: JSON = JSON.parse(data);
            if(!content[path]){
                resolve('No extra features for this note')
            }
            content[newPath] = content[path]
            fs.writeFile(pathConfigFolder+editorExtraFeaturesConfigFileName, JSON.stringify(content), (err) => {
                if(err){
                    reject('Failed to save editor extra feature config file !')
                }
                resolve('Editor extra feature saved !')
            })
        })
    })
}
