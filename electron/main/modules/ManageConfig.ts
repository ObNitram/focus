import fs from 'fs'
import {app} from 'electron'
import * as outPut from './OutputModule'
import * as vaultManagement from './VaultManagementModule'
import * as FileSystemModule from './FileSystemModule'
import { convertCrossPath } from 'pathmanage'
import { Theme } from './themes/ThemeType'

export const pathConfigFolder:string = convertCrossPath(app.getPath('appData')+ '/focus/')
export const vaultConfigFileName:string = convertCrossPath('vaultConfig.json')
export const generalConfigFileName: string = convertCrossPath('generalConfig.json')
export const pathThemeConfigFileName:string = convertCrossPath('themes.json')


type vaultConfigFileNameType = {
    location:string;
}

type generalConfigType = {
    size_sidebar: number,
    openedFiles: string[]
}

type themeConfigFileType = Theme[]

let generalConfig:generalConfigType|null = null

let themeConfig:themeConfigFileType|null = null

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
                location: null,
            }))
            outPut.printOK('File created !')
        }catch(error){
            outPut.printError('Failed to create the file. Aborting.')
            return false;
        }
        return true
    }
    if(! fs.existsSync(pathConfigFolder+pathThemeConfigFileName)){
        outPut.printINFO('Config file '+ pathConfigFolder+pathThemeConfigFileName + ' not found !')
        try{
            outPut.printINFO('Try to create ' + pathConfigFolder+pathThemeConfigFileName+ '...')
            fs.writeFileSync(pathConfigFolder+pathThemeConfigFileName, JSON.stringify({
                themes: [],
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
                size_sidebar: 300,
                openedFiles: []
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
            res.openedFiles = FileSystemModule.removeNonExistentPath(res.openedFiles)
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

export function initThemeConfig():boolean{
    if(! fs.existsSync(pathConfigFolder+pathThemeConfigFileName)){
        outPut.printINFO('Config file '+ pathConfigFolder+pathThemeConfigFileName + ' not found !')
        try{
            outPut.printINFO('Try to create ' + pathConfigFolder+pathThemeConfigFileName+ '...')
            fs.writeFileSync(pathConfigFolder+pathThemeConfigFileName, JSON.stringify([]))
            outPut.printOK('File created !')
        }catch(error){
            outPut.printError('Failed to create the file. Aborting.')
            return false;
        }
    }
    let data;
    try{
        data = fs.readFileSync(pathConfigFolder+pathThemeConfigFileName, 'utf8');
    }catch(error){
        outPut.printError('Failed to read setting !')
        return false
    }
    if(data){
        try {
            let res:themeConfigFileType = JSON.parse(data)
            themeConfig = res
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

export async function saveOpenedFiles(paths:string[]):Promise<string>{
    return new Promise((resolve, reject) => {
        outPut.printINFO('Try to save user\'s opened files.')
        if(paths.length == 0){
            resolve('There is no file path to save!')
        }
        if(initGeneralConfig() == false){
            reject('An error occur, the config is corrupted. User\'s size of sidebar not saved!')
        }
        generalConfig.openedFiles = paths
        try{
            fs.writeFileSync(pathConfigFolder+generalConfigFileName, JSON.stringify(generalConfig))
        }catch(error){
            reject('An error occured while trying to save general config in file system.')
        }
        resolve('Opened files is saved in setting!')
    })
}

export function getSavedOpenedFiles():string[]{
    return FileSystemModule.removeNonExistentPath(generalConfig.openedFiles)
}

export function getThemes():themeConfigFileType{
    if(themeConfig != null) return themeConfig
    return []
}