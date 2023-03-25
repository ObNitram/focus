/**
 * @file VaultManagementModule.ts
 * @description Contains functions for manage the vault
 */

import * as FileSystemModule from './FileSystemModule'

import * as pathManage from 'pathmanage'
import * as printMessage from './OutputModule'
import * as Notification from './NotificationModule'
import { saveEditorExtraFeatures } from './editorExtraFeaturesManagementModule/SaveEditorExtraFeatures'
import { restoreEditorExtraFeatures } from './editorExtraFeaturesManagementModule/RestoreEditorExtraFeatures'
import * as MarkdownConverter from './markdownConversion/MarkdownConversionModule'
import { copyEditorExtraFeaturesNoteToNewPath, deleteEditorExtraFeaturesPath, updateEditorExtraFeaturesPath } from './ManageConfig';
import { ipcMain } from 'electron';
import { mainWindow } from './WindowsManagement';
import { join } from 'path';

let pathVault: string | null = null;

/**
 * @description Set the handlers of events send by the renderer process
 */
export function setupEvents() {
    /**
     * @description Function called when the event emitted when the user wants to create a note is received. Create a note in the vault
                    Send a notification to the main window when the note is not created
     * @param event:Electron.IpcMainEvent The event
     * @param pathVault:string|null The path of the vault
     */
    ipcMain.on('create-note', (event, pathVault: string | null = null) => {
        printMessage.printINFO('Request to add note !')

        createNote(pathVault ? pathVault : getPathVault()).then((note) => {
          if (note) {
            printMessage.printOK('Note added')
          } else {
            printMessage.printError('Note not added')
            Notification.showNotification('Impossible to create note, check the permissions', Notification.NotificationLevelEnum.ERROR)
          }
        })
          .catch((err) => {
            printMessage.printError(err)
            Notification.showNotification('Impossible to create note, check the permissions', Notification.NotificationLevelEnum.ERROR)
          })
      })

      /**
       * @description Function called when the event emitted when the user wants to create a folder is received. Create a folder in the vault
                      Send a notification to the main window when the folder is not created
       * @param event:Electron.IpcMainEvent The event
       * @param pathVault:string|null The path of the vault
       */
      ipcMain.on('create-folder', (event, pathVault: string | null = null) => {
        printMessage.printINFO('Request to add folder !')

        createFolder(pathVault ? pathVault : getPathVault(), 'Untitled').then((folder) => {
          if (folder) {
            printMessage.printOK('Folder added')
          } else {
            printMessage.printError('Folder not added')
            Notification.showNotification('Impossible to create folder, check the permissions', Notification.NotificationLevelEnum.ERROR)
          }
        })
          .catch((err) => {
            printMessage.printError(err)
            Notification.showNotification('Impossible to create folder, check the permissions', Notification.NotificationLevelEnum.ERROR)
          })
      })

      /**
        * @description Function called when the event emitted when the user wants to delete a note or a folder is received. 
                       Delete a note or a folder in the vault
                       Send a notification to the main window when the note or folder is not deleted
        * @param event:Electron.IpcMainEvent The event
        * @param arg:string The path of the note or folder to delete
       */
      ipcMain.on('delete-note-or-folder', (event, arg) => {
        printMessage.printINFO('Request to remove : ' + arg)

        deleteFileOrFolder(arg).then(() => {
          printMessage.printOK(arg + ' removed!')
        })
          .catch((err) => {
            printMessage.printError(err)
            Notification.showNotification('Impossible to delete note or folder, check the permissions', Notification.NotificationLevelEnum.ERROR)
          })
      })

      /**
       * @description Function called when the event emitted when the user wants to rename a note or a folder is received.
                      Rename a note or a folder in the vault
                      Send a notification to the main window when the note or folder is not renamed
                      Send a event when note or folder is renamed
        * @param event:Electron.IpcMainEvent The event
        * @param path:string The path of the note or folder to rename
        * @param newName:string The new name of the note or folder
       */
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
                Notification.showNotification('Impossible to rename note or folder, check the permissions', Notification.NotificationLevelEnum.ERROR)
              })
          })
      })

      /**
       * @description Function called when the event emitted when the user wants to move a note or a folder is received.
                      Move a note or a folder in the vault if needed
                      Send a notification to the main window when the note or folder is not moved
       * @param event:Electron.IpcMainEvent The event
       * @param path:string The path of the note or folder to move
       * @param newParentFolder:string|null The new parent folder of the note or folder
       */
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
            Notification.showNotification('Impossible to move note or folder, check the permissions', Notification.NotificationLevelEnum.ERROR)
          })
      })

      /**
       * @description Function called when the event emitted when the user wants to copy a note or a folder is received.
                      Copy a note or a folder in the vault
                      Send a notification to the main window when the note or folder is not copied
       * @param event:Electron.IpcMainEvent The event
       * @param path:string The path of the note or folder to copy
       * @param newParentFolder:string|null The new parent folder of the note or folder
       */
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
            Notification.showNotification('Impossible to copy note or folder, check the permissions', Notification.NotificationLevelEnum.ERROR)
          })
      })

      /**
       * @description Function called when the event emitted when the user wants to open a note is received.
                      Open a note in the vault and send the converted and addedExtraFeature content to the main window when the note is opened
                      Send a notification to the main window when the note is not opened
       * @param event:Electron.IpcMainEvent The event
      * @param path:string The path of the note to open
       */
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
                  Notification.showNotification('Impossible to open note, check the permissions', Notification.NotificationLevelEnum.ERROR)
                })
            })
              .catch((err) => {
                printMessage.printError(err)
                Notification.showNotification('Impossible to open note, check the permissions', Notification.NotificationLevelEnum.ERROR)
              })
          })
            .catch((err) => {
              printMessage.printError(err)
              Notification.showNotification('Impossible to open note, check the permissions', Notification.NotificationLevelEnum.ERROR)
            })
        })
          .catch((err) => {
            printMessage.printError(err)
            Notification.showNotification('Impossible to open note, check the permissions', Notification.NotificationLevelEnum.ERROR)
          })
      })

      /**
       * @description Function called when the event emitted when the user wants to save a note is received.
                      Convert the json content to markdown and save the note in the vault
                      Send a notification to the main window when the note is not saved
                      Send a event to the main window when the note is saved
       * @param event:Electron.IpcMainEvent The event
       * @param noteData:string The content of the note to save
       * @param path:string The path of the note to save
       */
      ipcMain.on('save-note', (event, noteData: string, path: string) => {
        printMessage.printINFO('Request to save : ' + path)
        saveEditorExtraFeatures(path, noteData).then(() => {
          MarkdownConverter.convertJSONToMarkdown(noteData).then((noteData) => {
            saveFile(noteData, path).then(() => {
              printMessage.printOK(path + ' saved!')
              Notification.showNotification('Note saved successfully!', Notification.NotificationLevelEnum.SUCESS)
              mainWindow?.webContents.send('note_saved', path)
            })
              .catch((err) => {
                printMessage.printError(err)
                Notification.showNotification('An error occured while saving the note!', Notification.NotificationLevelEnum.ERROR)
              })
          })
            .catch((err) => {
              printMessage.printError(err)
              Notification.showNotification('An error occured while saving the note!', Notification.NotificationLevelEnum.ERROR)
            })
        })
          .catch((err) => {
            printMessage.printError(err)
            Notification.showNotification('An error occured while saving the note!', Notification.NotificationLevelEnum.ERROR)
          })
      })

      /**
       * @description Function called when the event emitted when the user wants to open the file explorer at a specific path is received.
                      Open the file explorer at a specific path
       * @param event:Electron.IpcMainEvent The event
       * @param path:string The path to open in the file explorer
       */
      ipcMain.on('show-in-explorer', (event, path: string) => {
        printMessage.printINFO('Request to show in explorer : ' + path)
        showInExplorer(path)
      })
}

/**
 * @description Called for get the path of the vault
 * @returns The path of the vault
 */
export function getPathVault() {
    return pathVault
}

/**
 * @description Called for set the path of the vault
 * @param path:string The path of the vault
 */
export function setPath(path: string) {
    pathVault = path
}

/**
 * @description Create a new folder in the vault
 * @param dir: string The path of the folder where the new folder will be created
 * @param folderName: string The name of the new folder
 * @returns: Promise<FileSystemModule.File> Resolve with the new folder created or reject with an error
 */
export async function createFolder(dir: string, folderName: string): Promise<FileSystemModule.File> {
    return FileSystemModule.createFolder(dir, folderName)
}

/**
 * @description Create a new note in the vault
 * @param dir: string The path of the folder where the new note will be created
 * @returns: Promise<FileSystemModule.File> Resolve with the new note created or reject with an error
 */
export async function createNote(dir: string): Promise<FileSystemModule.File> {
    return FileSystemModule.createNote(dir)
}

/**
 * @description Delete a file or a folder in the vault
 * @param path: string The path of the file or folder to delete
 * @returns : Promise<void> Resolve with a message when file or folder is removed or reject with an error
 */
export async function deleteFileOrFolder(path: string): Promise<void> {
    deleteEditorExtraFeaturesPath(path).then((result) => {
        printMessage.printINFO(result)
    }).catch((reason) => {
        printMessage.printError(reason)
    })
    return FileSystemModule.deleteFileOrFolder(path)
}

/**
 * @description Move a file or a folder in the vault
 * @param oldPath: string The path of the file or folder to move
 * @param newPath: string The new path of the file or folder
 * @returns: Promise<void> Resolve with a message when file or folder is moved or reject with an error
 */
export async function moveFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    updateEditorExtraFeaturesPath(oldPath, newPath).then((result) => {
        printMessage.printINFO(result)
    }).catch((reason) => {
        printMessage.printError(reason)
    })
    return FileSystemModule.moveFileOrFolder(oldPath, newPath)
}

/**
 * @description Copy a file or a folder in the vault
 * @param oldPath: string The path of the file or folder to copy
 * @param newPath: string The new path of the file or folder
 * @returns 
 */
export async function copyFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    copyEditorExtraFeaturesNoteToNewPath(oldPath, newPath).then((result) => {
        printMessage.printINFO(result)
    }).catch((reason) => {
        printMessage.printError(reason)
    })

    return FileSystemModule.copyFileOrFolder(oldPath, newPath)
}

/**
 * @description Rename a file or a folder in the vault
 * @param oldPath: string The path of the file or folder to rename
 * @param newName: string The new name of the file or folder
 * @returns 
 */
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

/**
 * @description Get the content of the vault. The content is a list of files and folders, recursively.
 * @returns: Promise<FileSystemModule.File> Resolve with the content of the vault or reject with an error
 */
export async function getVaultContent(): Promise<FileSystemModule.File> {
    return new Promise<FileSystemModule.File>((resolve, reject) => {
        FileSystemModule.getFolderContent(pathVault, true).then((value: FileSystemModule.File) => {
            value = FileSystemModule.convertAllCrossPath(value)
            resolve(FileSystemModule.removeMD(value))
        }).catch((reason) => reject(reason))
    })
}

/**
 * @description Get information of a file or a folder. May be recursive.
 * @param path: string The path of the file or folder
 * @param recursive: boolean If true, the function will be recursive
 * @returns: Promise<FileSystemModule.File> Resolve with the information of the file or folder or reject with an error
 */
export async function getNoteOrFolderInfo(path: string, recursive: boolean = false): Promise<FileSystemModule.File> {
    return FileSystemModule.getFileOrFolderInfo(path, recursive)
}

/**
 * @description Open file explorer at the path
 * @param folderPath: string The path to open in the file explorer
 */
export function showInExplorer(folderPath: string): void {
    return FileSystemModule.showInExplorer(folderPath)
}

/**
 * @description Open a file and read the data as a string
 * @param filePath: string The path of the file to open
 * @returns: Promise<string[]> Resolve with the data of the file and the path of the file or reject with an error
 */
export function openFile(filePath: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        FileSystemModule.openFileAndReadData(filePath).then((value) => {
            resolve([value, filePath])
        }).catch((reason) => reject(reason))
    })
}

/**
 * @description Save data in a file specified by the path
 * @param data: string The data to save
 * @param path: string The path of the file
 * @returns: Promise<void> Resolve with a message when the file is saved or reject with an error
 */
export function saveFile(data: string, path:string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        FileSystemModule.saveFile(path, data).then(() => {
            resolve()
        }).catch((reason) => reject(reason))
    })
}


export default FileSystemModule.File
