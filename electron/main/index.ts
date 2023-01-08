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
import chokidar from 'chokidar'

import * as VaultManagement from './modules/VaultManagementModule'
import * as WindowsManagement from './modules/WindowsManagement'
import * as printMessage from './modules/OutputModule'
import { getPathVault, setPathVault, initConfig, saveInSettingPathVault } from './modules/ManageConfig'

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

let pathVault: string | null = null
let mainWindow: BrowserWindow | null = null

let watcher: chokidar.FSWatcher | null = null

let modificationsInVaultFromApp: number = 0
let modificationsInVaultFromOutsideTimer: NodeJS.Timeout | null = null

function sendVaultContent() {
  printMessage.printINFO('Request to get folder content !')
  VaultManagement.getFolderContent(getPathVault(), true).then((content) => {
    mainWindow?.webContents.send('folder-content', content)
  })
}

function setupEvents() {
  ipcMain.on('get-folder-content', () => {
    sendVaultContent()
  })

  watcher = chokidar.watch(getPathVault(), {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: false,
    ignoreInitial: true
  })

  watcher.on('all', (event, path) => {
    if (modificationsInVaultFromApp > 0) {
      modificationsInVaultFromApp--

      switch (event) {
        case 'add':
          VaultManagement.getNoteOrFolderInfo(path).then((note) => {
            printMessage.printLog('add ' + path)
            mainWindow?.webContents.send('note-created', note)
          })
          break
        case 'addDir':
          VaultManagement.getNoteOrFolderInfo(path).then((folder) => {
            printMessage.printLog('addDir ' + path)
            mainWindow?.webContents.send('note-created', folder)
          })
          break
        case 'change':
          VaultManagement.getNoteOrFolderInfo(path).then((note) => {
            printMessage.printLog('change ' + path)
            mainWindow?.webContents.send('note-updated', note)
          })
          break
        case 'unlink':
          printMessage.printLog('remove ' + path)
          mainWindow?.webContents.send('note-or-folder-deleted', path)
          break
        case 'unlinkDir':
          printMessage.printLog('removeDir ' + path)
          mainWindow?.webContents.send('note-or-folder-deleted', path)
          break
      }
    }

    else {
      if (modificationsInVaultFromOutsideTimer) {
        clearTimeout(modificationsInVaultFromOutsideTimer)
      }

      modificationsInVaultFromOutsideTimer = setTimeout(() => {
        printMessage.printLog('Vault modified from outside')
        sendVaultContent()
      }, 1000)
    }
  })


  ipcMain.on('create-note', (event, pathVault: string | null = null) => {
    printMessage.printINFO('Request to add note !')
    modificationsInVaultFromApp++

    VaultManagement.createNote(pathVault ? pathVault : getPathVault()).then((note) => {
      if (note) {
        printMessage.printOK('Note added')
      } else {
        printMessage.printError('Note not added')
      }
    })
  })

  ipcMain.on('create-folder', (event, pathVault: string | null = null) => {
    printMessage.printINFO('Request to add folder !')
    modificationsInVaultFromApp++

    VaultManagement.createFolder(pathVault ? pathVault : getPathVault(), 'Untitled').then((folder) => {
      if (folder) {
        printMessage.printOK('Folder added')
      } else {
        printMessage.printError('Folder not added')
      }
    })
  })

  ipcMain.on('delete-note-or-folder', (event, arg) => {
    printMessage.printINFO('Request to remove : ' + arg)
    modificationsInVaultFromApp++

    VaultManagement.deleteFileOrFolder(arg).then((deleted) => {
      if (deleted) {
        printMessage.printOK(arg + ' removed!')
      } else {
        printMessage.printError(arg + ' not removed!')
      }
    })
  })

  ipcMain.on('rename-note-or-folder', (event, path: string, newName: string) => {
    printMessage.printINFO('Request to rename : ' + path)
    modificationsInVaultFromApp += 2

    VaultManagement.renameFileOrFolder(path, newName).then((renamed) => {
      if (renamed) {
        printMessage.printOK(path + ' renamed!')
      } else {
        printMessage.printError(path + ' not renamed!')
      }
    })
  })

  ipcMain.on('show-in-explorer', (event, path: string) => {
    printMessage.printINFO('Request to show in explorer : ' + path)
    VaultManagement.showInExplorer(path)
  })

  ipcMain.on('open_main_window', (event, path: string) => {
    if (!saveInSettingPathVault(path)) {
      app.exit();
    }
    WindowsManagement.closeVaultWindowAndOpenMain()
  })

  ipcMain.on('closeApp', () => {
    printMessage.printLog('Close application is asked')
    closeApp();
  })

  ipcMain.on('maximizeWindow', (event) => {
    printMessage.printLog('Maximize application is asked')
    BrowserWindow.getFocusedWindow().maximize()
  })

  ipcMain.on('hideWindow', (event) => {
    printMessage.printLog('hide application is asked')
    BrowserWindow.getFocusedWindow().minimize()
  })
}



if (initConfig() == false) {
  printMessage.printError('The configuration of settings is corrupted or a system error occured. Exiting...')
  app.exit();
}

app.whenReady().then(() => {
  setupEvents();
  pathVault = getPathVault()
  if (pathVault == null) {
    printMessage.printINFO('This is the first time of application launch or the config was reseted !')
    printMessage.printINFO('Launch select vault location window...')
    WindowsManagement.createVaultWindow()
  } else {
    printMessage.printINFO('A valid configuration is found, launching the main window...')
    setPathVault(pathVault)
    mainWindow = WindowsManagement.createMainWindow();
  }
})

function closeApp() {
  app.quit()
}


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
