import fs from 'fs'
import { app } from 'electron'
import * as outPut from './OutputModule'
import * as vaultManagement from './VaultManagementModule'
import * as FileSystemModule from './FileSystemModule'
import { convertCrossPath } from 'pathmanage'
import { Theme } from 'themetypes'

export const pathConfigFolder: string = convertCrossPath(app.getPath('appData') + '/focus/')
export const vaultConfigFileName: string = convertCrossPath('vaultConfig.json')
export const generalConfigFileName: string = convertCrossPath('generalConfig.json')
export const pathThemeConfigFileName: string = convertCrossPath('themes.json')

import { NodesSave } from './editorExtraFeaturesManagementModule/SaveEditorExtraFeatures'
const editorExtraFeaturesConfigFileName: string = 'editorExtraFeaturesConfig.json'

type vaultConfigFileNameType = {
    location: string;
}

type generalConfigType = {
    size_sidebar: number,
    openedFiles: string[]
}

type themeConfigFileType = Theme[]

let generalConfig: generalConfigType | null = null

let themeConfig: themeConfigFileType | null = null

function createConfigFileIfNeeded(path: string, initConfig: string = '{}'): boolean {
    if (!fs.existsSync(path)) {
        outPut.printINFO('Config folder not found in ' + path)
        outPut.printINFO('Try to create ' + path + '...')
        try {
            fs.writeFileSync(path, initConfig)
        } catch (error) {
            outPut.printError('Failed to create the folder. Aborting.')
            return false
        }
    }
    return true
}

function createConfigFolderIfNeeded(path: string): boolean {
    if (!fs.existsSync(path)) {
        outPut.printINFO('Config folder not found in ' + path)
        outPut.printINFO('Try to create ' + path + '...')
        try {
            fs.mkdirSync(path)
        } catch (error) {
            outPut.printError('Failed to create the folder. Aborting.')
            return false
        }
    }
    return true
}

function createConfigFilesIfNeeded(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if (!createConfigFolderIfNeeded(pathConfigFolder)
            || !createConfigFileIfNeeded(pathConfigFolder + vaultConfigFileName, JSON.stringify({ location: null }))
            || !createConfigFileIfNeeded(pathConfigFolder + pathThemeConfigFileName, JSON.stringify([]))
            || !createConfigFileIfNeeded(pathConfigFolder + generalConfigFileName, JSON.stringify({ size_sidebar: 300, openedFiles: [] }))
            || !createConfigFileIfNeeded(pathConfigFolder + editorExtraFeaturesConfigFileName)) {
            reject(false)
        }
        resolve(true)
    })
}

function initDataFromConfigFiles() {
    let data;

    try {
        data = fs.readFileSync(pathConfigFolder + vaultConfigFileName, 'utf8');
    } catch (error) {
        outPut.printError('Failed to read setting !')
        return false
    }
    if (data) {
        try {
            let res: vaultConfigFileNameType = JSON.parse(data)
            vaultManagement.setPath(res.location)
            outPut.printOK('Config is OK!')
        } catch (error: any) {
            outPut.printError('Failed to get setting. Aborting...')
            return false
        }
    }
    else {
        outPut.printError('Failed to get setting. Aborting...')
        return false
    }


    try {
        data = fs.readFileSync(pathConfigFolder + generalConfigFileName, 'utf8');
    } catch (error) {
        outPut.printError('Failed to read setting !')
        return false
    }
    if (data) {
        try {
            let res: generalConfigType = JSON.parse(data)
            res.openedFiles = FileSystemModule.removeNonExistentPath(res.openedFiles)
            generalConfig = res
            outPut.printOK('Config is OK!')
        } catch (error: any) {
            outPut.printError('Failed to get setting. Aborting...')
            return false
        }
    }
    else {
        outPut.printError('Failed to get setting. Aborting...')
        return false
    }


    try {
        data = fs.readFileSync(pathConfigFolder + pathThemeConfigFileName, 'utf8');
    } catch (error) {
        outPut.printError('Failed to read setting !')
        return false
    }
    if (data) {
        try {
            let res: themeConfigFileType = JSON.parse(data)
            themeConfig = res
            outPut.printOK('Config is OK!')
        } catch (error: any) {
            outPut.printError('Failed to get setting. Aborting...')
            return false
        }
    }
    else {
        outPut.printError('Failed to get setting. Aborting...')
        return false
    }


    outPut.printOK('Config is OK!')
    return true
}

export function initConfig() {
    createConfigFilesIfNeeded().then(() => {
        if (!initDataFromConfigFiles()) {
            outPut.printError('An error occur, the config is corrupted. Aborting...')

            // TODO: Ask the user if he want to reset the config
            return false
        }
        return true

    }).catch((e) => {
        outPut.printError('Failed to create config files: ' + e)
    })
}

export function saveInSettingPathVault(path: string): boolean {
    outPut.printINFO("Try to save user's vault path...")
    if (!fs.existsSync(path)) {
        outPut.printError('An error occur, The require path doesn\'t exist !')
        return false
    }
    try {
        let contentSettingFile: vaultConfigFileNameType = JSON.parse(fs.readFileSync(pathConfigFolder + vaultConfigFileName, 'utf8'))
        contentSettingFile.location = path
        fs.writeFileSync(pathConfigFolder + vaultConfigFileName, JSON.stringify(contentSettingFile))
    } catch (error) {
        outPut.printError('An error occured while trying to save the path in file system.')
        return false
    }
    vaultManagement.setPath(path)
    outPut.printOK('Path is saved !')
    return true
}

export function getSizeSidebar(): number {
    return generalConfig.size_sidebar
}

export async function saveSizeSideBar(newSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
        outPut.printINFO('Try to save user\'s size of sidebar')
        if (newSize < 0) {
            reject('An error occur, the data is invalid. User\'s size of sidebar not saved!')
        }
        generalConfig.size_sidebar = newSize
        try {
            fs.writeFileSync(pathConfigFolder + generalConfigFileName, JSON.stringify(generalConfig))
        } catch (error) {
            reject('An error occured while trying to save general config in file system.')
        }
        resolve('Size of sidebar is saved')
    })
}

export async function saveOpenedFiles(paths: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        outPut.printINFO('Try to save user\'s opened files.')
        if (paths.length == 0) {
            resolve('There is no file path to save!')
        }
        generalConfig.openedFiles = paths
        try {
            fs.writeFileSync(pathConfigFolder + generalConfigFileName, JSON.stringify(generalConfig))
        } catch (error) {
            reject('An error occured while trying to save general config in file system.')
        }
        resolve('Opened files is saved in setting!')
    })
}

export function getSavedOpenedFiles(): string[] {
    return FileSystemModule.removeNonExistentPath(generalConfig.openedFiles)
}

export function getThemes(): themeConfigFileType {
    if (themeConfig != null) return themeConfig
    return []
}

export async function saveThemes(themes: themeConfigFileType): Promise<string> {
    return new Promise((resolve, reject) => {
        outPut.printINFO('Try to save user\'s themes.')
        try {
            fs.writeFileSync(pathConfigFolder + pathThemeConfigFileName, JSON.stringify(themes))
            themeConfig = themes
        } catch (error) {
            reject('An error occured while trying to save general config in file system.')
        }
        resolve('Themes is saved in setting!')
    })
}
export function saveEditorExtraFeatures(notePath: string, nodes: Array<NodesSave>) {
    outPut.printINFO('Try to save editor extra features...')
    let content: JSON = JSON.parse(fs.readFileSync(pathConfigFolder + editorExtraFeaturesConfigFileName, 'utf8'));
    content[notePath] = {}

    for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].value) {
            continue
        }

        if (!content[notePath][nodes[i].nodePath]) {
            content[notePath][nodes[i].nodePath] = {}
        }
        if (!content[notePath][nodes[i].nodePath][nodes[i].key]) {
            content[notePath][nodes[i].nodePath][nodes[i].key] = {}
        }
        content[notePath][nodes[i].nodePath][nodes[i].key] = nodes[i].value
    }

    try {
        fs.writeFileSync(pathConfigFolder + editorExtraFeaturesConfigFileName, JSON.stringify(content))
    }
    catch (error) {
        outPut.printError('Failed to save editor extra features !')
    }
}

export function extraFeaturesExtistForNote(notePath: string): Promise<boolean> {
    outPut.printINFO('Try to check if extra features exist for note...')

    return new Promise((resolve, reject) => {
        fs.readFile(pathConfigFolder + editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if (err) {
                outPut.printError('Failed to read editor extra feature config file !')
                reject(false)
            }
            let content: JSON = JSON.parse(data);
            if (!content[notePath]) {
                resolve(false)
            }
            resolve(true)
        })
    })
}

export function getEditorExtraFeature(notePath: string, nodePath: string, key: string): any {
    outPut.printINFO('Try to get editor extra feature...')

    try {
        let content: JSON = JSON.parse(fs.readFileSync(pathConfigFolder + editorExtraFeaturesConfigFileName, 'utf8'));
        if (!content[notePath]) {
            return null
        }
        outPut.printOK('Extra feature found: ' + key + '=>' + content[notePath][nodePath][key])
        return content[notePath][nodePath][key]
    }
    catch (error) {
        // extra feature doesn't exist
        return null
    }
}

export function updateEditorExtraFeaturesPath(oldPath: string, newPath: string): Promise<string> {
    outPut.printINFO('Try to update editor extra features path...')

    return new Promise((resolve, reject) => {
        fs.readFile(pathConfigFolder + editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if (err) {
                reject('Failed to read editor extra feature config file !')
            }
            let content: JSON = JSON.parse(data);
            if (!content[oldPath]) {
                resolve('No extra features for this note')
            }
            content[newPath] = content[oldPath]
            delete content[oldPath]
            fs.writeFile(pathConfigFolder + editorExtraFeaturesConfigFileName, JSON.stringify(content), (err) => {
                if (err) {
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
        fs.readFile(pathConfigFolder + editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if (err) {
                reject('Failed to read editor extra feature config file !')
            }
            let content: JSON = JSON.parse(data);
            if (!content[notePath]) {
                resolve('No extra features for this note')
            }
            delete content[notePath]
            fs.writeFile(pathConfigFolder + editorExtraFeaturesConfigFileName, JSON.stringify(content), (err) => {
                if (err) {
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
        fs.readFile(pathConfigFolder + editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if (err) {
                reject('Failed to read editor extra feature config file !')
            }
            let content: JSON = JSON.parse(data);
            if (!content[path]) {
                resolve('No extra features for this note')
            }
            content[newPath] = content[path]
            fs.writeFile(pathConfigFolder + editorExtraFeaturesConfigFileName, JSON.stringify(content), (err) => {
                if (err) {
                    reject('Failed to save editor extra feature config file !')
                }
                resolve('Editor extra feature saved !')
            })
        })
    })
}
