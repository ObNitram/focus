import * as FileSystemModule from './FileSystemModule'

import * as pathManage from 'pathmanage'
import * as printMessage from './OutputModule'
import { saveEditorExtraFeatures } from './editorExtraFeaturesManagementModule/SaveEditorExtraFeatures'
import { restoreEditorExtraFeatures } from './editorExtraFeaturesManagementModule/RestoreEditorExtraFeatures'
import * as MarkdownConverter from './markdownConversion/MarkdownConversionModule'
import { copyEditorExtraFeaturesNoteToNewPath, deleteEditorExtraFeaturesPath, updateEditorExtraFeaturesPath } from './ManageConfig';
import { ipcMain } from 'electron';
import { mainWindow } from './WindowsManagement';
import { join } from 'path';

let pathVault: string | null = null;


export function setupEvents() {
    ipcMain.on('create-note', (event, pathVault: string | null = null) => {
        printMessage.printINFO('Request to add note !')

        createNote(pathVault ? pathVault : getPathVault()).then((note) => {
          if (note) {
            printMessage.printOK('Note added')
          } else {
            printMessage.printError('Note not added')
          }
        })
          .catch((err) => {
            printMessage.printError(err)
          })
      })

      ipcMain.on('create-folder', (event, pathVault: string | null = null) => {
        printMessage.printINFO('Request to add folder !')

        createFolder(pathVault ? pathVault : getPathVault(), 'Untitled').then((folder) => {
          if (folder) {
            printMessage.printOK('Folder added')
          } else {
            printMessage.printError('Folder not added')
          }
        })
          .catch((err) => {
            printMessage.printError(err)
          })
      })

      ipcMain.on('delete-note-or-folder', (event, arg) => {
        printMessage.printINFO('Request to remove : ' + arg)

        deleteFileOrFolder(arg).then(() => {
          printMessage.printOK(arg + ' removed!')
        })
          .catch((err) => {
            printMessage.printError(err)
          })
      })

      ipcMain.on('rename-note-or-folder', (event, path: string, newName: string) => {
        printMessage.printINFO('Request to rename : ' + path + ', new name is ' + newName)

        renameFileOrFolder(path, newName).then(() => {
          printMessage.printOK(path + ' renamed!')
        })
          .catch((err) => {
            printMessage.printError(err)
            getNoteOrFolderInfo(path, true).then((note) => {
              mainWindow?.webContents.send('note-updated', note)
            })
              .catch((err) => {
                printMessage.printError(err)
              })
          })
      })

      ipcMain.on('move-note-or-folder', (event, path: string, newParentFolder: string | null = null) => {
        if (newParentFolder === null) {
          newParentFolder = pathManage.repairEndOfPath(getPathVault(), true)
        }

        printMessage.printINFO('Request to move : ' + path + ' to ' + newParentFolder)
        // printMessage.printLog('Parent of file to move is ' + pathManage.getParentPath(path) )
        // printMessage.printLog('Parent of file to move is ' + pathManage.getParentPath(path) )
        if (path === newParentFolder || newParentFolder == pathManage.getParentPath(path)) {
          printMessage.printINFO('No move needed')
          return
        }

        const newPath = join(newParentFolder, pathManage.getName(path))

        moveFileOrFolder(path, newPath).then(() => {
          printMessage.printOK(path + ' moved!')
        })
          .catch((err) => {
            printMessage.printError(err)
          })
      })

      ipcMain.on('copy-note-or-folder', (event, path: string, newParentFolder: string | null = null) => {
        if (newParentFolder === null) {
          newParentFolder = getPathVault()
        }

        printMessage.printINFO('Request to copy : ' + path + ' to ' + newParentFolder)

        let pathParts = path.split('/')
        const newPath = join(newParentFolder, pathParts[pathParts.length - 1])

        copyFileOrFolder(path, newPath).then(() => {
          printMessage.printOK(path + ' copied!')
        })
          .catch((err) => {
            printMessage.printError(err)
          })
      })

      ipcMain.on('open-note', (event, path: string) => {
        printMessage.printINFO('Request to open : ' + path)
        openFile(path).then(([noteData, filePath]: string[]) => {
          MarkdownConverter.convertMarkdownToJSON(noteData).then((noteData) => {

            restoreEditorExtraFeatures(path, noteData).then((noteData) => {
              getNoteOrFolderInfo(path, false).then((note) => {
                printMessage.printOK(path + ' opened!')
                mainWindow?.webContents.send('note-opened', note.name, noteData, filePath)
              })
                .catch((err) => {
                  printMessage.printError(err)
                })
            })
              .catch((err) => {
                printMessage.printError(err)
              })
          })
            .catch((err) => {
              printMessage.printError(err)
            })
        })
          .catch((err) => {
            printMessage.printError(err)
          })
      })

      ipcMain.on('save-note', (event, noteData: string, path: string) => {
        printMessage.printINFO('Request to save : ' + path)
        saveEditorExtraFeatures(path, noteData).then(() => {
          MarkdownConverter.convertJSONToMarkdown(noteData).then((noteData) => {
            saveFile(noteData, path).then(() => {
              printMessage.printOK(path + ' saved!')
              mainWindow?.webContents.send('note_saved', path)
            })
              .catch((err) => {
                printMessage.printError(err)
              })
          })
            .catch((err) => {
              printMessage.printError(err)
            })
        })
          .catch((err) => {
            printMessage.printError(err)
          })
      })

      ipcMain.on('show-in-explorer', (event, path: string) => {
        printMessage.printINFO('Request to show in explorer : ' + path)
        showInExplorer(path)
      })
}





export function getPathVault() {
    return pathVault
}

export function setPath(path: string) {
    pathVault = path
}

export async function createFolder(dir: string, folderName: string): Promise<FileSystemModule.File> {
    return FileSystemModule.createFolder(dir, folderName)
}

export async function createNote(dir: string): Promise<FileSystemModule.File> {
    return FileSystemModule.createNote(dir)
}

export async function deleteFileOrFolder(path: string): Promise<void> {
    deleteEditorExtraFeaturesPath(path).then((result) => {
        printMessage.printINFO(result)
    }).catch((reason) => {
        printMessage.printError(reason)
    })
    return FileSystemModule.deleteFileOrFolder(path)
}

export async function moveFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    updateEditorExtraFeaturesPath(oldPath, newPath).then((result) => {
        printMessage.printINFO(result)
    }).catch((reason) => {
        printMessage.printError(reason)
    })
    return FileSystemModule.moveFileOrFolder(oldPath, newPath)
}

export async function copyFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    copyEditorExtraFeaturesNoteToNewPath(oldPath, newPath).then((result) => {
        printMessage.printINFO(result)
    }).catch((reason) => {
        printMessage.printError(reason)
    })

    return FileSystemModule.copyFileOrFolder(oldPath, newPath)
}

export async function renameFileOrFolder(oldPath: string, newName: string): Promise<void> {
    if (!oldPath || !newName) {
        return Promise.reject('Invalid parameters')
    }
    if (oldPath === newName) {
        return Promise.resolve()
    }

    let newPath = pathManage.joinPath(pathManage.getParentPath(oldPath), newName)
    if (oldPath.endsWith('.md')) {
        newPath += '.md'
    }
    updateEditorExtraFeaturesPath(oldPath, newPath).then((result) => {
        printMessage.printINFO(result)
    }).catch((reason) => {
        printMessage.printError(reason)
    })
    return FileSystemModule.renameFileOrFolder(oldPath, newPath)
}

export async function getVaultContent(): Promise<FileSystemModule.File> {
    return new Promise<FileSystemModule.File>((resolve, reject) => {
        FileSystemModule.getFolderContent(pathVault, true).then((value: FileSystemModule.File) => {
            value = FileSystemModule.convertAllCrossPath(value)
            resolve(FileSystemModule.removeMD(value))
        }).catch((reason) => reject(reason))
    })
}

export async function getNoteOrFolderInfo(path: string, recursive: boolean = false): Promise<FileSystemModule.File> {
    return FileSystemModule.getFileOrFolderInfo(path, recursive)
}

export function showInExplorer(folderPath: string): void {
    return FileSystemModule.showInExplorer(folderPath)
}

export function openFile(filePath: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        FileSystemModule.openFileAndReadData(filePath).then((value) => {
            resolve([value, filePath])
        }).catch((reason) => reject(reason))
    })
}

export function saveFile(data: string, path:string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        FileSystemModule.saveFile(path, data).then(() => {
            resolve()
        }).catch((reason) => reject(reason))
    })
}


export default FileSystemModule.File
