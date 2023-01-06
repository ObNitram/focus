import React, { useEffect } from 'react'
import styles from 'styles/components/main/sidebar.module.scss'

import FileList from "./FileList"
import TopBar from "./TopBar"

import * as FileListLogic from './FileListLogic'

const { ipcRenderer } = window.require('electron')

let mainFolderPath: string = ''

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState<any>([])
  const [folderName, setFolderName] = React.useState('MyVault')
  const [collapsedAll, setCollapsedAll] = React.useState<boolean | null>(null)

  const [folderToExpand, setFolderToExpand] = React.useState<string | null>(null)

  function setupEvents() {
    ipcRenderer.on('folder-content', (event, folderContent) => {
      FileListLogic.changeSortOrderRecursive(folderContent.children)
      setFiles(folderContent.children)

      // Retrieve folder name
      setFolderName(folderContent.name)
      mainFolderPath = folderContent.path
    })

    ipcRenderer.on('note-created', (event, note) => {
      setFiles(FileListLogic.addNoteOrFolder(note, files, mainFolderPath))

      setCollapsedAll(null)
      setFolderToExpand(note.path.split('/').slice(0, note.path.split('/').length - 1).join('/'))
    })
    ipcRenderer.on('folder-created', (event, folder) => {
      setFiles(FileListLogic.addNoteOrFolder(folder, files, mainFolderPath))

      setCollapsedAll(null)
      setFolderToExpand(folder.path.split('/').slice(0, folder.path.split('/').length - 1).join('/'))
    })
    ipcRenderer.on('note-or-folder-deleted', (event, path) => {
      setFiles(FileListLogic.deleteNoteOrFolder(files, path))
    })
    ipcRenderer.on('note-updated', (event, note) => {
      setFiles(FileListLogic.modifyNoteOrFolder(note, files, mainFolderPath))
    })
  }

  useEffect(() => {
    setupEvents()

    return () => {
      ipcRenderer.removeAllListeners('folder-content')
      ipcRenderer.removeAllListeners('note-created')
      ipcRenderer.removeAllListeners('folder-created')
      ipcRenderer.removeAllListeners('note-or-folder-deleted')
      ipcRenderer.removeAllListeners('note-updated')
    }
  }, [props.folderName, files])

  useEffect(() => {
    getListOfFilesAndFolders()
  }, [])

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
