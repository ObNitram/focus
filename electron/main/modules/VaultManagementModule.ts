process.env.DIST_ELECTRON = join(__dirname, '../../..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { app, BrowserWindow, dialog, IpcMain, shell} from 'electron'
import { join } from 'path'
import * as fs from './FileSystemModule'

const urlDev = process.env.VITE_DEV_SERVER_URL + '#/vault-manager'
const urlProd = join('file://', process.env.DIST, 'index.html') + '#/vault-manager'



function setupEvents(ipc: IpcMain, win: BrowserWindow) {
  
}

