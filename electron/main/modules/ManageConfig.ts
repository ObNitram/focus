import fs from 'fs'
import { app, dialog } from 'electron'
import * as outPut from './OutputModule'
import * as vaultManagement from './VaultManagementModule'
import * as FileSystemModule from './FileSystemModule'
import * as Notification from './NotificationModule'
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
        if (!createConfigFolderIfNeeded(pathConfigFolder)) {
            displayResetConfigDialog('config folder', pathConfigFolder)
            reject('Failed to create config folder.')
        }
        if (!createConfigFileIfNeeded(pathConfigFolder + vaultConfigFileName, JSON.stringify({ location: null }))) {
            displayResetConfigDialog('vault config file', pathConfigFolder + vaultConfigFileName)
            reject('Failed to create config files.')
        }
        if (!createConfigFileIfNeeded(pathConfigFolder + pathThemeConfigFileName, JSON.stringify([]))) {
            displayResetConfigDialog('theme config file', pathConfigFolder + pathThemeConfigFileName)
            reject('Failed to create config files.')
        }
        if (!createConfigFileIfNeeded(pathConfigFolder + generalConfigFileName, JSON.stringify({ size_sidebar: 300, openedFiles: [] }))) {
            displayResetConfigDialog('general config file', pathConfigFolder + generalConfigFileName)
            reject('Failed to create config files.')
        }
        if (!createConfigFileIfNeeded(pathConfigFolder + editorExtraFeaturesConfigFileName)) {
            displayResetConfigDialog('editor extra features config file', pathConfigFolder + editorExtraFeaturesConfigFileName)
            reject('Failed to create config files.')
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
        displayResetConfigDialog('vault config file', pathConfigFolder + vaultConfigFileName)
        return false
    }
    if (data) {
        try {
            let res: vaultConfigFileNameType = JSON.parse(data)
            vaultManagement.setPath(res.location)
            outPut.printOK('Config is OK!')
        } catch (error: any) {
            outPut.printError('Failed to get setting. Aborting...')
            displayResetConfigDialog('vault config file', pathConfigFolder + vaultConfigFileName)
            return false
        }
    }
    else {
        outPut.printError('Failed to get setting. Aborting...')
        displayResetConfigDialog('vault config file', pathConfigFolder + vaultConfigFileName)
        return false
    }


    try {
        data = fs.readFileSync(pathConfigFolder + generalConfigFileName, 'utf8');
    } catch (error) {
        outPut.printError('Failed to read setting !')
        displayResetConfigDialog('general config file', pathConfigFolder + generalConfigFileName)
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
            displayResetConfigDialog('general config file', pathConfigFolder + generalConfigFileName)
            return false
        }
    }
    else {
        outPut.printError('Failed to get setting. Aborting...')
        displayResetConfigDialog('general config file', pathConfigFolder + generalConfigFileName)
        return false
    }


    try {
        data = fs.readFileSync(pathConfigFolder + pathThemeConfigFileName, 'utf8');
    } catch (error) {
        outPut.printError('Failed to read setting !')
        displayResetConfigDialog('theme config file', pathConfigFolder + pathThemeConfigFileName)
        return false
    }
    if (data) {
        try {
            let res: themeConfigFileType = JSON.parse(data)
            themeConfig = res
            outPut.printOK('Config is OK!')
        } catch (error: any) {
            outPut.printError('Failed to get setting. Aborting...')
            displayResetConfigDialog('theme config file', pathConfigFolder + pathThemeConfigFileName)
            return false
        }
    }
    else {
        outPut.printError('Failed to get setting. Aborting...')
        displayResetConfigDialog('theme config file', pathConfigFolder + pathThemeConfigFileName)
        return false
    }


    outPut.printOK('Config is OK!')
    return true
}

function displayResetConfigDialog(configName: string, path: string) {
    // Ask the user if he want to reset the config
    // If yes, delete the config folder and restart the app
    // If no, quit the app

    dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: 'An error occur, ' + configName + ' is corrupted.\nDo you want to reset the config ?\n' +
        'If you choose to do so, part of your config will be lost.\n' +
        'You will have to relaunch the app after the reset.',
        buttons: ['Yes', 'No']
    }).then((res) => {
        if (res.response === 0) {
            outPut.printINFO('Try to delete: ' + path)
            try {
                // Delete the config folder
                fs.rmSync(path, { recursive: true, force: true })
                outPut.printOK('Config: ' + path + ' deleted !')
                app.exit(0)
            } catch (error) {
                outPut.printError('Failed to delete the config: ' + path + ': ' + error)
                dialog.showMessageBox({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to delete: ' + path + '\nYou may try to delete it manually.',
                    buttons: ['OK']
                }).then(() => {
                    app.exit(0)
                })
            }
        }
        else {
            outPut.printINFO('User choose to quit the app.')
            app.exit(0)
        }
    })
}

export function initConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
        createConfigFilesIfNeeded().then(() => {
            if (!initDataFromConfigFiles()) {
                outPut.printError('An error occur, the config is corrupted. Aborting...')
                reject("An error occur, the config is corrupted. Aborting...")
            }
            resolve()
        }).catch((e) => {
            outPut.printError('Failed to create config files: ' + e)
            reject("Failed to create config files: " + e)
        })
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

export async function removeTheme(themeName:string): Promise<string> {
    return new Promise( async (resolve, reject) => {
        outPut.printINFO('Try to remove user\'s theme.')
        if(themeConfig == null) reject('Theme config is null!')
        let newThemeConfig: themeConfigFileType = themeConfig.filter((value:Theme) => {
            return value.name != themeName
        })
        if(themeConfig.length == newThemeConfig.length) reject('Theme not found !')
        await saveThemes(newThemeConfig).then((value:string) => {
            resolve('The theme ' + themeName + ' is removed!');
        }).catch((reason:string)=> {
            reject(reason)
        })
    })
}

export function saveEditorExtraFeatures(notePath: string, nodes: Array<NodesSave>) {
    outPut.printINFO('Try to save editor extra features...')
    let content: JSON = JSON.parse(fs.readFileSync(pathConfigFolder + editorExtraFeaturesConfigFileName, 'utf8'));
    content[notePath] =  []

    for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].value) {
            continue
        }

        // put data in associative array
        content[notePath].push(nodes[i])
    }

    try {
        fs.writeFileSync(pathConfigFolder + editorExtraFeaturesConfigFileName, JSON.stringify(content))
    }
    catch (error) {
        outPut.printError('Failed to save editor extra features !')
        Notification.showNotification('Failed to save extra features! If you close the current note, you will lose the non-markdown content.', Notification.NotificationLevelEnum.ERROR)
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

export function getEditorExtraFeatures(notePath: string): Promise<Array<NodesSave>> {
    outPut.printINFO('Try to get editor extra features...')

    return new Promise((resolve, reject) => {
        fs.readFile(pathConfigFolder + editorExtraFeaturesConfigFileName, 'utf8', (err, data) => {
            if (err) {
                outPut.printError('Failed to read editor extra feature config file !')
                reject([])
            }
            let content: JSON = JSON.parse(data);
            if (!content[notePath]) {
                resolve([])
            }
            resolve(content[notePath])
        })
    })
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
