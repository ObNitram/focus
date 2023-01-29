import { cpSync, existsSync } from "fs";
import { mainWindow } from "../WindowsManagement";
import { ipcMain } from "electron";
import { getThemes } from "../ManageConfig";
import { printError, printINFO, printLog } from "../OutputModule";
import {Theme, defaultTheme} from 'themetypes'

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

export function setupEvents():void{
    ipcMain.on('getTheme', () => {
        printINFO('getTheme receive')
        createAllThemesConverted().then((value: {name:string, css:string}[]) => {
            printINFO('Themes is converted, send they to client')
            mainWindow?.webContents.send('getTheme_responses', value)
        }).catch((reason) => {
            printError('Error when convert themes')
            mainWindow?.webContents.send('getTheme_responses', reason)
        })
    })
}

