/**
 * @file index.ts
 * @description Entry point of the application. Set the environment variables, the events, launch application
 */
process.env.DIST_ELECTRON = join(__dirname, '../..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'os'
import { join } from 'path'
import chokidar from 'chokidar'

import { restoreEditorExtraFeatures } from './modules/editorExtraFeaturesManagementModule/RestoreEditorExtraFeatures'
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

const preload = join(__dirname, '../preload/index.js') // Path to the preload script
const urlDev = process.env.VITE_DEV_SERVER_URL // Url of the dev server
const urlProd = join('file://', process.env.DIST, 'index.html') // Url of the production server

let pathVault: string | null = null // Path of the vault
let mainWindow: BrowserWindow | null = null // Contains the main window of the application

let watcher: chokidar.FSWatcher | null = null // Watcher to detect modifications in the vault

let modificationsInVaultTimer: NodeJS.Timeout | null = null // Timer to avoid multiple calls to sendVaultContent

/**
 * @description Send to renderer the content of the vault, as a list of files
 */
function sendVaultContent() {
  printMessage.printINFO('Request to get folder content !')
  VaultManagement.getVaultContent().then((content) => {
    mainWindow?.webContents.send('folder-content', content)
  })
    .catch((err) => {
      printMessage.printError(err)
    })
}

/**
 * @description Set the watcher to detect modifications in the vault. If watcher is already set, close it before.
                If the vault is not itialized, do nothing
                When modifications are detected, send the content of the vault to the renderer
                If many modifications are detected in a short time, only send the content once
 */
function setupWatcher() {
  printMessage.printLog('Setup watcher')
  console.log(VaultManagement.getPathVault())
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

/**
 * @description Set the events of the application
 */
function setupEvents() {
  setupWatcher()

  /**
   * @description When renderer went vault content, send the content of the vault
   */
  ipcMain.on('get-folder-content', () => {
    sendVaultContent()
  })

  /**
   * @description When renderer ask to open main window, close vault window if necessary and open main window
   * @param event Event
   * @param path:string Path of the vault
   */
  ipcMain.on('open_main_window', (event, path: string) => {
    if (!saveInSettingPathVault(path)) {
      app.exit();
    }
    setupWatcher()
    mainWindow = WindowsManagement.closeVaultWindowAndOpenMain()
  })

  /**
   * @description Called when user want close the application. Save the opened files and close the application
   */
  ipcMain.on('closeApp', () => {
    printMessage.printLog('Close application is asked')
    mainWindow?.webContents.send('get_opened_files')
    ipcMain.once('opened_files_response', (event: Electron.IpcMainEvent, paths: string[]) => {
      printMessage.printLog('Opened responses')
      saveOpenedFiles(paths).then((value: string) => {
        printMessage.printOK(value)
      }).catch((reason: string) => {
        printMessage.printError(reason)
      }).finally(() => closeApp())
    })
  })

  /**
   * @description Called when renderer want the saved sidebar size
   * @param event Event
   */
  ipcMain.on('getSizeSidebar', (event) => {
    event.reply('size_sidebar', getSizeSidebar())
  })

  /**
   * @description Called when user change size of sidebar. Save the new size of sidebar in the config file
   * @param event Event
   * @param number:number New size of sidebar
   */
  ipcMain.on('newSizeSideBar', (event, number) => {
    printMessage.printLog('Save size of sidebar asked')
    saveSizeSideBar(number).then((value) => printMessage.printOK(value)).catch((reason) => printMessage.printError(reason))
  })

  /**
   * @description Called when user want to open a link in the default browser. Open the link in the default browser
   * @param event Event
   * @param link:string Link to open
   */
  ipcMain.on('open-link', (event, link) => {
    link = link.replace(/['"]+/g, '')

    if (!link.startsWith('mailto:') && !link.startsWith('file://')) {
      if (!link.startsWith('http')) {
        link = 'https://' + link
      }
      if (!link.startsWith('https://www.') && !link.startsWith('http://www.')) {
        link = link.replace('https://', 'https://www.')
        link = link.replace('http://', 'http://www.')
      }
    }

    printMessage.printLog('Open link asked: ' + link)

    shell.openExternal(link)
  })

  /**
   * @description Called when main windows is opened. Send the paths of the previously opened files before closing the application
   */
  ipcMain.on('get_saved_opened_files', () => {
    printMessage.printINFO('Saved opened files is asked!')
    let saved_opened_files = getSavedOpenedFiles()
    let dataToSend = []
    Promise.all(saved_opened_files.map(path => {
      return VaultManagement.openFile(path)
        .then(([noteData, filePath]: string[]) => {
          return MarkdownConverter.convertMarkdownToJSON(noteData)
            .then((noteData) => {
              return restoreEditorExtraFeatures(path, noteData)
                .then((noteData) => {
                  return VaultManagement.getNoteOrFolderInfo(path, false)
                    .then((note) => {
                      printMessage.printOK(path + ' opened!!')
                      dataToSend.push([note.name, noteData, filePath])
                    })
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

/**
 * @description When the application is ready, setup event, initialize the config files if needed and launch the main window if its the first time of application launch
                or the config was reseted. If the config is valid, launch the main window
 */
app.whenReady().then(() => {
  VaultManagement.setupEvents();
  ManageTheme.setupEvents();
  HtmlToPDF.setupEvents();
  WindowsManagement.setupEvents();

  // Initialize the config files if needed (it also check if the config files are valid)
  initConfig().then(() => {
    setupEvents();
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
  }).catch((err) => {
    printMessage.printError(err)
  })
})

/**
 * @description Close the application
 */
function closeApp() {
  app.quit()
}

/**
 * @description When all windows are closed, close the application
 */
app.on('window-all-closed', () => {
  mainWindow = null
  if (process.platform !== 'darwin') app.quit()
})

/**
 * @description Avoid multiple instance of the application
 */
app.on('second-instance', () => {
  if (mainWindow) {
    // Focus on the main window if the user tried to open another
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

/**
 * @description When the application is activated, the code checks whether the application is already running.
                If the application is already running, it focuses the first window. If the application is not running, it creates a new window.
 */
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
