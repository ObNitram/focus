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

  ipcMain.on('create-note', (event) => {
    // TODO: Set vault path after getting saved value

    const note = VaultManagement.createNote(getPathVault())

    if (note) {
      event.reply('note-created', note)
    }
  })

  ipcMain.on('create-folder', (event) => {
    // TODO: Set vault path after getting saved value

    const folder = VaultManagement.createFolder(getPathVault(), 'Untitled')

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
    console.log('test')
    setPathVault(path)
    if(!saveInSettingPathVault){
      console.log('ERROR WITH CONFIG OF THE APPLICATION.')
      app.exit();
    }
    saveInSettingPathVault(path)
    WindowsManagement.closeVaultWindowAndOpenMain()
  })
}


if(initConfig() == false){
  console.log('ERROR WITH CONFIG OF THE APPLICATION.')
  app.exit();
}

app.whenReady().then(() => {
  setupEvents();
  pathVault = getPathVault()
  console.log("Path vault in start of app : " + pathVault)
  if(pathVault == null){
    WindowsManagement.createVaultWindow()
  }else{
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
