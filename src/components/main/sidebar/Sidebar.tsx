import React, { useEffect } from 'react'
import styles from 'styles/sidebar.module.scss'

import FileList from "./FileList"
import TopBar from "./TopBar"

const { ipcRenderer } = window.require('electron')

let filesCopy: any = []
let currSortOrder: any = 'name-asc'

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState<any>([])
  const [folderName, setFolderName] = React.useState('MyVault')
  const [collapsed, setCollapsed] = React.useState(true)

  function setupEvents() {
    ipcRenderer.on('folder-content', (event, theFiles) => {
      changeSortOrderRecursive(theFiles[0].children)
      filesCopy = theFiles[0].children
      setFiles(filesCopy)

      // Retrieve folder name
      setFolderName(theFiles[0].name)
    })
    ipcRenderer.on('note-created', (event, note) => {
      filesCopy.push(note)
      changeSortOrderRecursive(filesCopy)
      setFiles(filesCopy)
    })
    ipcRenderer.on('folder-created', (event, folder) => {
      filesCopy.push(folder)
      changeSortOrderRecursive(filesCopy)
      setFiles(filesCopy)
    })
    ipcRenderer.on('note-or-folder-deleted', (event, path) => {
      filesCopy = filterDeletedNoteOrFolderRecursive(filesCopy, path)
      setFiles(filesCopy)
    })
  }

  useEffect(() => {
    getFiles()
    ipcRenderer.removeAllListeners('folder-content')
    ipcRenderer.removeAllListeners('note-created')
    ipcRenderer.removeAllListeners('folder-created')
    ipcRenderer.removeAllListeners('note-or-folder-deleted')
    setupEvents()
  }, [props.folderName])

  function filterDeletedNoteOrFolderRecursive(theFiles: any, path: string) {
    let filesCopy = [...theFiles]
    filesCopy.forEach((file: any, index: number) => {
      if (file.path === path) {
        filesCopy.splice(index, 1)
      } else if (file.isDirectory) {
        file.children = filterDeletedNoteOrFolderRecursive(file.children, path)
      }
    })
    return filesCopy
  }

  function getFiles() {
    ipcRenderer.send('get-folder-content')
  }

  function handleCollapseAll(collapse: boolean) {
    setCollapsed(collapse)
  }

  function changeSortOrderRecursive(files: any) {
    switch (currSortOrder) {
      case 'name-asc':
        files.sort((a: any, b: any) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        files.sort((a: any, b: any) => b.name.localeCompare(a.name))
        break
      case 'modified-desc':
        files.sort((a: any, b: any) => b.modified.localeCompare(a.modified))
        break
      case 'modified-asc':
        files.sort((a: any, b: any) => a.modified.localeCompare(b.modified))
        break
      case 'created-desc':
        files.sort((a: any, b: any) => b.created.localeCompare(a.created))
        break
      case 'created-asc':
        files.sort((a: any, b: any) => a.created.localeCompare(b.created))
        break
    }
    files.forEach((file: any) => {
      if (file.isDirectory) {
        changeSortOrderRecursive(file.children)
      }
    })
  }

  function handleSortOrderChange(item: any) {
    const filesCopy = [...files]
    currSortOrder = item.key
    changeSortOrderRecursive(filesCopy)
    setFiles(filesCopy)
  }

  return (
    <div className={styles.sidebar}>
        <TopBar onCollapseAll={handleCollapseAll} onSortOrderChange={handleSortOrderChange}/>
        <h2>{folderName}</h2>
        <FileList collapsed={collapsed} files={files}/>
    </div>
  )
}
