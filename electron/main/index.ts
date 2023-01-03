// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { app, BrowserWindow, shell, ipcMain, ipcRenderer } from 'electron'
import { release } from 'os'
import { join } from 'path'

import * as VaultManagement from './modules/VaultManagementModule'
import * as WindowsManagement from './modules/WindowsManagement'
import * as printMessage from './modules/OutputModule'
import { getPathVault, setPathVault ,initConfig, saveInSettingPathVault } from './modules/ManageConfig'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const urlDev = process.env.VITE_DEV_SERVER_URL
const urlProd = join('file://', process.env.DIST, 'index.html')

let pathVault:string|null = null
let mainWindow:BrowserWindow|null = null


function setupEvents() {
  ipcMain.on('get-folder-content', (event) => {
    // TODO: Set vault path after getting saved value
    const content = VaultManagement.getFolderContent(getPathVault(), true)
    event.reply('folder-content', content)
  })

  ipcMain.on('create-note', (event, pathVault:string|null = null) => {
    // TODO: Set vault path after getting saved value

    const note = VaultManagement.createNote(pathVault ? pathVault : getPathVault())

    if (note) {
      event.reply('note-created', note)
    }
  })

  ipcMain.on('create-folder', (event, pathVault:string|null = null) => {
    // TODO: Set vault path after getting saved value

    const folder = VaultManagement.createFolder(pathVault ? pathVault : getPathVault(), 'Untitled')

    if (folder) {
      event.reply('folder-created', folder)
    }
  })

  ipcMain.on('delete-note-or-folder', (event, arg) => {
    const deleted = VaultManagement.deleteFileOrFolder(arg)

    if (deleted) {
      event.reply('note-or-folder-deleted', arg)
    }
  })

  ipcMain.on('open_main_window', (event, path:string) => {
    if(!saveInSettingPathVault(path)){
      app.exit();
    }
    WindowsManagement.closeVaultWindowAndOpenMain()
  })
}

printMessage.printLog('TEST')

if(initConfig() == false){
  printMessage.printError('The configuration of settings is corrupted or a system error occured. Exiting...')
  app.exit();
}

app.whenReady().then(() => {
  setupEvents();
  pathVault = getPathVault()
  if(pathVault == null){
    printMessage.printINFO('This is the first time of application launch or the config was reseted !')
    printMessage.printINFO('Launch select vault location window...')
    WindowsManagement.createVaultWindow()
  }else{
    printMessage.printINFO('A valid configuration is found, launching the main window...')
    setPathVault(pathVault)
    mainWindow =  WindowsManagement.createMainWindow();
  }
})



app.on('window-all-closed', () => {
  mainWindow = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (mainWindow) {
    // Focus on the main window if the user tried to open another
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    mainWindow = WindowsManagement.createMainWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${urlDev}#${arg}`)
  } else {
    childWindow.loadURL(`${urlProd}#${arg}`)
  }
})
