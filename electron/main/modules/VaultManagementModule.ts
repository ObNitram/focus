process.env.DIST_ELECTRON = join(__dirname, '../../..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { app, BrowserWindow, dialog, IpcMain, shell} from 'electron'
import { join } from 'path'
import * as fs from './FileSystemModule'

const urlDev = process.env.VITE_DEV_SERVER_URL + '#/vault-manager'
const urlProd = join('file://', process.env.DIST, 'index.html') + '#/vault-manager'
const defaultPath = app.getPath('home') + '/Documents'

let winVault: BrowserWindow | null = null

async function createWindow() {
  winVault = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.svg'),
    width: 1000,
    height:420,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  winVault.setResizable(false)

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    winVault.loadURL(urlDev)
    // Open devTool if the app is not packaged
    winVault.webContents.openDevTools()
  } else {
    winVault.loadURL(urlProd)
  }

  // Make all links open with the browser, not with the application
  winVault.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

function setupEvents(ipc: IpcMain, win: BrowserWindow) {
  ipc.on('choose-directory', async (event) => {
    const { filePaths } = await dialog.showOpenDialog(win, {
      title: 'Choose a directory to use as a vault',
      defaultPath: defaultPath,
      buttonLabel: 'Use as vault',
      properties: ['openDirectory'],
    })
    event.reply('directory-chosen', filePaths[0])
  })


  ipc.on('create-vault', async (event, vaultName: string, vaultPath: string) => {
    if (!vaultName) {
      return
    }

    if (!vaultPath) {
      vaultPath = defaultPath
    }

    const vault = fs.createFolder(vaultPath,vaultName)
    if (!vault) {
      return
    }
    event.reply('vault-created', vault)
  })
}

export function init(ipc: IpcMain) {

  createWindow()
  setupEvents(ipc, winVault)
}
