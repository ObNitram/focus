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

import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'os'
import { join } from 'path'

import * as VaultManagement from './modules/VaultManagementModule'
import * as FileSystemModule from './modules/FileSystemModule'
import { getPathVault, initConfig } from './modules/ManageConfig'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const urlDev = process.env.VITE_DEV_SERVER_URL
const urlProd = join('file://', process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.svg'),
    fullscreenable: true,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  win.maximize()

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(urlDev)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadURL(urlProd)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

function setupEvents() {
  ipcMain.on('get-folder-content', (event, arg) => {
    const content = FileSystemModule.getFolderContent(arg, true)
    event.reply('folder-content', content)
  })

  ipcMain.on('create-note', (event, arg) => {
    // TODO: Set vault path after getting saved value

    const note = FileSystemModule.createNote('/home/logan/Downloads')

    if (note) {
      event.reply('note-created', note)
    }
  })

  ipcMain.on('create-folder', (event, arg) => {
    // TODO: Set vault path after getting saved value

    const folder = FileSystemModule.createFolder('/home/logan/Downloads', 'Untitled')

    if (folder) {
      event.reply('folder-created', folder)
    }
  })

  ipcMain.on('delete-note-or-folder', (event, arg) => {
    const deleted = FileSystemModule.deleteFileOrFolder(arg)

    if (deleted) {
      event.reply('note-or-folder-deleted', arg)
    }
  })
}

let pathVault:string|null = null
initConfig();

app.whenReady().then(() => {
  setupEvents();
  pathVault = getPathVault()
  if(pathVault == null){
    VaultManagement.init(ipcMain);
  }else{
    createWindow();
  }
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
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
