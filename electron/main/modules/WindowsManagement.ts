process.env.DIST_ELECTRON = join(__dirname, '../../..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { BrowserWindow, shell, ipcMain, dialog, app } from "electron"
import { createFolder } from "./VaultManagementModule"
import { join } from 'path'

let mainWindow: BrowserWindow | null = null
let winVault: BrowserWindow | null = null


// Here, you can also use other preload
const preload = join(__dirname, '../../preload/index.js')

const urlDev = process.env.VITE_DEV_SERVER_URL
const urlProd = join('file://', process.env.DIST, 'index.html')

const defaultPath = app.getPath('home') + '/Documents'


export function createMainWindow() {
  console.log("je passe main window create")
  mainWindow = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.svg'),
    fullscreenable: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
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
  console.log(winVault)
  return winVault
}

function addListenerVaultWindow(){
  ipcMain.on('choose-directory', async (event) => {
    const { filePaths } = await dialog.showOpenDialog(winVault, {
      title: 'Choose a directory to use as a vault',
      defaultPath: defaultPath,
      buttonLabel: 'Use as vault',
      properties: ['openDirectory'],
    })
    console.log("type of file path : " + typeof filePaths)
    console.log("Content of file path : " + filePaths)
    if(filePaths.length != 0){
      event.reply('directory-chosen', filePaths[0])
    }
  })


  ipcMain.on('create-vault', async (event, vaultName: string, vaultPath: string) => {
    console.log(vaultName + ' in ' + vaultPath)
    if (!vaultName) {
      return
    }

    if (!vaultPath) {
      vaultPath = defaultPath
    }

    const vault = createFolder(vaultPath,vaultName)
    if (!vault) {
      return
    }
    console.log(vault)
    event.reply('vault-created', vault.path)
  })
}

export function closeVaultWindowAndOpenMain(){
  winVault.close();
  mainWindow = createMainWindow();
}

