import React, { useEffect } from 'react'
import styles from 'styles/sidebar.module.scss'

import FileList from "./FileList"
import TopBar from "./TopBar"

const { ipcRenderer } = window.require('electron')

let filesCopy: any = []

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState<any>([])
  const [folderName, setFolderName] = React.useState('MyVault')
  const [collapsed, setCollapsed] = React.useState(true)

  function setupEvents() {
    ipcRenderer.on('folder-content', (event, theFiles) => {
      setFiles(theFiles)
      filesCopy = [...theFiles]
    })
    ipcRenderer.on('note-created', (event, note) => {
      filesCopy = [...filesCopy, note]
      setFiles(filesCopy)
    })
    ipcRenderer.on('folder-created', (event, folder) => {
      filesCopy = [...filesCopy, folder]
      setFiles(filesCopy)
    })
  }

  function retrieveFolderName() {
    if (props.dir) {
      const path = props.dir.split('/')
      const name = path[path.length - 1]
      setFolderName(name)
    }
  }

  function getFiles(dir: string) {
    if (dir) ipcRenderer.send('get-folder-content', dir)
  }

  useEffect(() => {
    retrieveFolderName()
    getFiles(props.dir)
    ipcRenderer.removeAllListeners('folder-content')
    ipcRenderer.removeAllListeners('note-created')
    ipcRenderer.removeAllListeners('folder-created')
    setupEvents()
  }, [props.folderName, props.dir])

  function handleCollapseAll(collapse: boolean) {
    setCollapsed(collapse)
  }

  function changeSortOrderRecursive(item: any, files: any) {
    switch (item.key) {
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
        changeSortOrderRecursive(item, file.children)
      }
    })
  }

  function handleSortOrderChange(item: any) {
    const filesCopy = [...files]
    changeSortOrderRecursive(item, filesCopy)
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
