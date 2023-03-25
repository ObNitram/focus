/**
 * @file WindowsManagement.ts
 * @description This file contains all the functions to manage the windows of the application
 */
process.env.DIST_ELECTRON = join(__dirname, '../../..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { BrowserWindow, shell, ipcMain, dialog, app } from "electron"
import { createFolder } from "./VaultManagementModule"
import { join } from 'path'

import * as printMessage from './OutputModule'

export let mainWindow: BrowserWindow | null = null //Contains the main window of the application
export let winVault: BrowserWindow | null = null //Contains the window to create a vault

/**
 * @description This function is used to setup the events to manage the windows
 */
export function setupEvents() {
  /**
   * @description Function called when user want maximize the window
   * @param event - The event
   */
  ipcMain.on('maximizeWindow', (event) => {
    printMessage.printLog('Maximize application is asked')
    BrowserWindow.getFocusedWindow().maximize()
  })

  /**
   * @description Function called when user want hide the window
   * @param event - The event
   */
  ipcMain.on('hideWindow', (event) => {
    printMessage.printLog('hide application is asked')
    BrowserWindow.getFocusedWindow().minimize()
  })
}

const preload = join(__dirname, '../../preload/index.js') // Path to the preload script

const urlDev = process.env.VITE_DEV_SERVER_URL //Url of the dev server
const urlProd = join('file://', process.env.DIST, 'index.html') //Url of the production server

const defaultPath = app.getPath('home') + '/Documents' //Default path to create a vault

/**
 * @description Create the main window of the application
 * @returns: BrowserWindow - The main window of the application
 */
export function createMainWindow():BrowserWindow {
  mainWindow = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.svg'),
    fullscreenable: true,
    frame: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  mainWindow.maximize()
  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    mainWindow.loadURL(urlDev)
    // Open devTool if the app is not packaged
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadURL(urlProd)
  }

  // Test actively push message to the Electron-Renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  return mainWindow
}

/**
 * @description Create the window to create a vault
 * @returns: BrowserWindow - The window to create a vault
 */
export function createVaultWindow() {
  winVault = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.svg'),
    width: 1000,
    height: 420,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  winVault.setResizable(false)

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    winVault.loadURL(urlDev  + '#/vault-manager')
    // Open devTool if the app is not packaged
    winVault.webContents.openDevTools()
  } else {
    winVault.loadURL(urlProd  + '#/vault-manager')
  }

  // Make all links open with the browser, not with the application
  winVault.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  addListenerVaultWindow();
  return winVault
}

/**
 * @description Add the listeners to the vault window
 */
function addListenerVaultWindow(){
  /**
   * @description Function called when user want to choose a directory to create a vault
                  Open a dialog to choose a directory and respond to the renderer with the path of the directory if the user choose one
   * @param event - The event
   */
  ipcMain.on('choose-directory', async (event) => {
    const { filePaths } = await dialog.showOpenDialog(winVault, {
      title: 'Choose a directory to use as a vault',
      defaultPath: defaultPath,
      buttonLabel: 'Use as vault',
      properties: ['openDirectory'],
    })
    if(filePaths.length != 0){
      event.reply('directory-chosen', filePaths[0])
    }
  })

  /**
   * @description Function called when user want to create the vault
                  Create the vault and respond to the renderer with the path of the vault if the vault is created
   * @param event - The event
   * @param vaultName:string - The name of the vault
   * @param vaultPath:string - The path of the vault
   */
  ipcMain.on('create-vault', async (event, vaultName: string, vaultPath: string) => {
    if (!vaultName) {
      return
    }

    if (!vaultPath) {
      vaultPath = defaultPath
    }

    createFolder(vaultPath,vaultName).then((vault) => {
      if (!vault) {
        return
      }

      event.reply('vault-created', vault.path)
    })
    .catch((err) => {
      printMessage.printError(err)
    })
  })
}
/**
 * Close the vault window and open the main window.
 * @returns: BrowserWindow - The main window of the application
 */
export function closeVaultWindowAndOpenMain(){
  winVault.close();
  mainWindow = createMainWindow();
  return mainWindow
}

/**
 * Get the main window of the application
 * @returns: BrowserWindow - The main window of the application
 */
export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}