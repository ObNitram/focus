import React, { useEffect } from 'react'
import styles from 'styles/components/main/sidebar.module.scss'

import FileList from "./FileList"
import TopBar from "./TopBar"

import * as FileListLogic from './FileListLogic'

const { ipcRenderer } = window.require('electron')

let filesCopy: any = []

let mainFolderPath: string = ''

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState<any>([])
  const [folderName, setFolderName] = React.useState('MyVault')
  const [collapsedAll, setCollapsedAll] = React.useState<boolean | null>(null)

  const [folderToExpand, setFolderToExpand] = React.useState<string | null>(null)

  function setupEvents() {
    ipcRenderer.on('folder-content', (event, theFiles) => {
      FileListLogic.changeSortOrderRecursive(theFiles[0].children)
      filesCopy = theFiles[0].children
      setFiles(filesCopy)

      // Retrieve folder name
      setFolderName(theFiles[0].name)
      mainFolderPath = theFiles[0].path
    })

    ipcRenderer.on('note-created', (event, note) => {
      filesCopy = FileListLogic.addNewNoteOrFolderInRightPlace(note, filesCopy, mainFolderPath)
      setFiles(filesCopy)

      setCollapsedAll(null)
      setFolderToExpand(note.path.split('/').slice(0, note.path.split('/').length - 1).join('/'))
    })
    ipcRenderer.on('folder-created', (event, folder) => {
      filesCopy = FileListLogic.addNewNoteOrFolderInRightPlace(folder, filesCopy, mainFolderPath)
      setFiles(filesCopy)

      setCollapsedAll(null)
      setFolderToExpand(folder.path.split('/').slice(0, folder.path.split('/').length - 1).join('/'))
    })
    ipcRenderer.on('note-or-folder-deleted', (event, path) => {
      filesCopy = FileListLogic.filterDeletedNoteOrFolderRecursive(filesCopy, path)
      setFiles(filesCopy)
    })
    ipcRenderer.on('note-updated', (event, note) => {
      filesCopy = FileListLogic.modifyNoteOrFolder(note, filesCopy, mainFolderPath)
      setFiles(filesCopy)
    })
  }

  useEffect(() => {
    getListOfFilesAndFolders()
    ipcRenderer.removeAllListeners('folder-content')
    ipcRenderer.removeAllListeners('note-created')
    ipcRenderer.removeAllListeners('folder-created')
    ipcRenderer.removeAllListeners('note-or-folder-deleted')
    ipcRenderer.removeAllListeners('note-updated')
    setupEvents()
  }, [props.folderName])

  function getListOfFilesAndFolders() {
    ipcRenderer.send('get-folder-content')
  }

  function handleCollapseAll(collapseAll: boolean) {
    setCollapsedAll(collapseAll)
  }

  function handleSortOrderChange(item: any) {
    const filesCopy = [...files]
    FileListLogic.changeSortOrderRecursive(filesCopy, item.key)
    setFiles(filesCopy)
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar_header}>
        <TopBar onCollapseAll={handleCollapseAll} onSortOrderChange={handleSortOrderChange} />
        <h2>{folderName}</h2>
      </div>
      <FileList collapsedAll={collapsedAll} files={files} folderToExpand={folderToExpand} />
    </div>
  )
}
