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
import * as MarkdownConverter from './modules/markdownConversion/MarkdownConversionModule'
import * as ManageTheme from './modules/themes/ManageTheme'
import { initConfig, saveInSettingPathVault, saveSizeSideBar, getSizeSidebar, saveOpenedFiles, getSavedOpenedFiles } from './modules/ManageConfig'

import * as HtmlToPDF from './modules/HtmlToPDF'

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

let modificationsInVaultTimer: NodeJS.Timeout | null = null

function sendVaultContent() {
  printMessage.printINFO('Request to get folder content !')
  VaultManagement.getVaultContent().then((content) => {
    mainWindow?.webContents.send('folder-content', content)
  })
    .catch((err) => {
      printMessage.printError(err)
    })
}

function setupWatcher() {
  if (watcher) {
    watcher.close()
  }

  if (VaultManagement.getPathVault() === null) {
    return
  }

  watcher = chokidar.watch(VaultManagement.getPathVault(), {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: false,
    ignoreInitial: true
  })

  watcher.on('all', (event, path) => {
    printMessage.printINFO('File ' + path + ' has been ' + event)

    if (modificationsInVaultTimer) {
      clearTimeout(modificationsInVaultTimer)
    }
    modificationsInVaultTimer = setTimeout(() => {
      printMessage.printLog('Sending vault content to renderer')
      sendVaultContent()
    }, 1000)
    sendVaultContent()
  })
}

function setupEvents() {
  setupWatcher()

  ipcMain.on('get-folder-content', () => {
    sendVaultContent()
  })

  ipcMain.on('open_main_window', (event, path: string) => {
    if (!saveInSettingPathVault(path)) {
      app.exit();
    }
    setupWatcher()
    mainWindow = WindowsManagement.closeVaultWindowAndOpenMain()
  })

  ipcMain.on('closeApp', () => {
    printMessage.printLog('Close application is asked')
    mainWindow?.webContents.send('get_opened_files')
    ipcMain.once('opened_files_response', (event:Electron.IpcMainEvent, paths:string[]) => {
      printMessage.printLog('Opened responses')
      saveOpenedFiles(paths).then((value:string) => {
        printMessage.printOK(value)
      }).catch((reason:string) => {
        printMessage.printError(reason)
      }).finally(() => closeApp())
    })
  })

  ipcMain.on('getSizeSidebar', (event) => {
    event.reply('size_sidebar', getSizeSidebar())
  })

  ipcMain.on('newSizeSideBar', (event, number) => {
    printMessage.printLog('Save size of sidebar asked')
    saveSizeSideBar(number).then((value) => printMessage.printOK(value)).catch((reason) => printMessage.printError(reason))
  })

  ipcMain.on('open-link', (event, link) => {
    link = link.replace(/['"]+/g, '')
    printMessage.printLog('Open link asked: ' + link)

    shell.openExternal(link)
  })

  ipcMain.on('get_saved_opened_files', () => {
    printMessage.printINFO('Saved opened files is asked!')
    let saved_opened_files = getSavedOpenedFiles()
    let dataToSend = []
    Promise.all(saved_opened_files.map(path => {
        return VaultManagement.openFile(path)
        .then(([noteData, filePath]:string[]) => {
            return MarkdownConverter.convertMarkdownToJSON(noteData)
            .then((noteData) => {
              return VaultManagement.getNoteOrFolderInfo(path, false)
              .then((note) => {
                  printMessage.printOK(path + ' opened!!')
                  dataToSend.push([note.name, noteData, filePath])
              })
            })
        })
    })).then(() => {
        mainWindow?.webContents.send('saved_opened_files', dataToSend)
    })
    .catch((err) => {
        printMessage.printError(err)
    })
  })
}

// Initialize the config files if needed (it also check if the config files are valid)
initConfig()

app.whenReady().then(() => {
  setupEvents();
  ManageTheme.setupEvents();
  HtmlToPDF.setupEvents();
  VaultManagement.setupEvents();
  WindowsManagement.setupEvents();

  pathVault = VaultManagement.getPathVault()
  printMessage.printLog('Path found is ' + pathVault)
  if (pathVault == null) {
    printMessage.printINFO('This is the first time of application launch or the config was reseted !')
    printMessage.printINFO('Launch select vault location window...')
    WindowsManagement.createVaultWindow()
  } else {
    printMessage.printINFO('A valid configuration is found, launching the main window...')
    VaultManagement.setPath(pathVault)
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
