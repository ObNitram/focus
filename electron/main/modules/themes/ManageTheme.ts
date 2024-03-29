/**
 * @file ManageTheme.ts
 * @description Contains all functions to manage themes
 */

import { mainWindow } from "../WindowsManagement";
import { dialog, ipcMain } from "electron";
import { getThemes, saveThemes, removeTheme } from "../ManageConfig";
import { printError, printINFO, printLog, printOK } from "../OutputModule";
import {Theme, defaultTheme} from 'themetypes'

/**
 * @description Convert a theme object to a html css link element
 * @param theme: Theme - The theme to convert
 * @returns: {name:string, css:string} - The theme converted, with the name and the css
 */
export function convertThemeForStyle(theme:Theme):{name:string, css:string}{
    let css:string = ''
    for(const selector in theme){
        let newCssProperty = ''
        if(selector != 'link' && selector != 'name'){
            newCssProperty = `\n.editor_${selector}{\n`
            for(const property in theme[selector]){
                newCssProperty += `\t${property}: ${theme[selector][property]};\n`
            }
            newCssProperty+= '}'
        }
        css+=newCssProperty
    }
    let newCssProperty = '\n.editor_link{\n';
    for(const property in theme['link']){
        if(property != 'linkHover'){
            newCssProperty +=  `\t${property}: ${theme['link'][property]};\n`
        }
    }
    newCssProperty += '}\n'
    newCssProperty+= '.editor_link:hover{\n'
    for(const property in theme['link']['linkHover']){
        newCssProperty +=  `\t${property}: ${theme['link']['linkHover'][property]};\n`
    }
    newCssProperty += '}'
    css += newCssProperty
    return {
        name: theme.name,
        css: css
    }
}

/**
 * @description Convert all saved themes to html css links elements and return them
 * @returns: Promise<{name:string, css:string}[]> - The themes converted, with the name and the css
 */
async function createAllThemesConverted():Promise<{name:string, css:string}[]>{
    return new Promise((resolve, reject) => {
        let convertedThemes: {name:string, css:string}[] = []
        convertedThemes.push(convertThemeForStyle(defaultTheme))
        try{
            let savedThemes:Theme[] = getThemes()
            savedThemes.forEach((value:Theme) => {
                convertedThemes.push(convertThemeForStyle(value))
            })
            resolve(convertedThemes)
        }catch(e){
            printError(e)
            reject(convertedThemes)
        }
    })
}

/**
 * @description Setup all events for themes
 */
export function setupEvents():void{
    /**
     * @description Called when renderer ask all themes. Convert all themes and send them to renderer
     */
    ipcMain.on('getTheme', () => {
        printINFO('getTheme receive')
        createAllThemesConverted().then((value: {name:string, css:string}[]) => {
            printINFO('Themes is converted, send they to client')
            mainWindow?.webContents.send('getTheme_responses', value, 'default')
        }).catch((reason) => {
            printError('Error when convert themes')
            mainWindow?.webContents.send('getTheme_responses', reason)
        })
    })

    /**
     * @description Callend when renderer want the JSON version of themes. Send them to renderer
     */
    ipcMain.on('getJSONTypes', () => {
        printINFO('JSON themes is asked ! Send they to front.')
        mainWindow?.webContents.send('JSONTypesReceived', [defaultTheme, ...getThemes()])
    })

    /**
     * @description Called when renderer ask to save a theme. Save the theme and send the result to renderer
     * @param event: Electron.IpcMainEvent - The event
     * @param themeName: string - The name of the theme
     * @param theme: Theme - The theme to save
     */
    ipcMain.on('saveTheme', (event, themeName: string, theme: Theme) => {
        printINFO('Save theme "' + themeName + '" is asked.')
        console.log(theme)
        let themes:Theme[] = getThemes()
        let index = themes.findIndex((value:Theme) => value.name == theme.name)
        if(index != -1){
            themes[index] = theme
        }else{
            themes.push(theme)
        }
        saveThemes(themes).then(() => {
            printINFO('Theme "' + themeName + '" is saved !')
            mainWindow.webContents.send('saveTheme_reponse', true)
            createAllThemesConverted().then((value: {name:string, css:string}[]) => {
                printINFO('Themes is converted, send they to client')
                mainWindow?.webContents.send('getTheme_responses', value, themeName)
            }).catch((reason) => {
                printError('Error when convert themes')
                mainWindow?.webContents.send('getTheme_responses', reason)
            })
            
        }).catch((reason) => {  
            mainWindow.webContents.send('saveTheme_reponse', false)
            printError('Error when save theme "' + themeName + '"')
            printError(reason)
        })
    })

    /**
     * @description Called when renderer ask to remove a theme. Ask to user if he is sure to remove the theme, and if yes, remove it.
                    Send the result to renderer
     * @param event: Electron.IpcMainEvent - The event
     * @param themeName: string - The name of the theme to remove
     */
    ipcMain.on('removeTheme', (event, themeName: string) => {
        printINFO('Remove theme "' + themeName + '" is asked.')
        dialog.showMessageBox(mainWindow, {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Remove theme',
            message: 'Are you sure to remove theme "' + themeName + '" ?'
        }).then((value) => {
            if(value.response == 0){
                removeTheme(themeName).then((value) => {
                    printOK(value)
                    mainWindow.webContents.send('removeTheme_response', true)
                }).catch((reason:string) => {
                    printError(reason)
                    mainWindow.webContents.send('removeTheme_response', false)
                })
            }else{
                printINFO('Remove theme "' + themeName + '" is canceled.')
                mainWindow.webContents.send('removeTheme_response', false)
            }
        })
    })
}

