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
    setupEvents()
  }, [props.folderName, props.dir])

  function handleCollapseAll(collapse: boolean) {
    setCollapsed(collapse)
  }

  function handleSortOrderChange(item: any) {

    switch (item.key) {
      case 'name-asc':
        setFiles([...files].sort((a: any, b: any) => {
          a.children.sort((a: any, b: any) => a.name.localeCompare(b.name))
          b.children.sort((a: any, b: any) => a.name.localeCompare(b.name))
          return (a.name.localeCompare(b.name))
        }))
        break
      case 'name-desc':
        setFiles([...files].sort((a: any, b: any) => {
          a.children.sort((a: any, b: any) => b.name.localeCompare(a.name))
          b.children.sort((a: any, b: any) => b.name.localeCompare(a.name))
          return (b.name.localeCompare(a.name))
        }))
        break
      case 'modified-desc':
        setFiles([...files].sort((a: any, b: any) => {
          a.children.sort((a: any, b: any) => b.modifiedTime - a.modifiedTime)
          b.children.sort((a: any, b: any) => b.modifiedTime - a.modifiedTime)
          return (b.modifiedTime - a.modifiedTime)
        }))
        break
      case 'modified-asc':
        setFiles([...files].sort((a: any, b: any) => {
          a.children.sort((a: any, b: any) => a.modifiedTime - b.modifiedTime)
          b.children.sort((a: any, b: any) => a.modifiedTime - b.modifiedTime)
          return (a.modifiedTime - b.modifiedTime)
        }))
        break
      case 'created-desc':
        setFiles([...files].sort((a: any, b: any) => {
          a.children.sort((a: any, b: any) => b.createdTime - a.createdTime)
          b.children.sort((a: any, b: any) => b.createdTime - a.createdTime)
          return (b.createdTime - a.createdTime)
        }))
        break
      case 'created-asc':
        setFiles([...files].sort((a: any, b: any) => {
          a.children.sort((a: any, b: any) => a.createdTime - b.createdTime)
          b.children.sort((a: any, b: any) => a.createdTime - b.createdTime)
          return (a.createdTime - b.createdTime)
        }))
    }
  }

  return (
    <div className={styles.sidebar}>
        <TopBar onCollapseAll={handleCollapseAll} onSortOrderChange={handleSortOrderChange}/>
        <h2>{folderName}</h2>
        <FileList collapsed={collapsed} files={files}/>
    </div>
  )
}
