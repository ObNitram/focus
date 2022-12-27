import React, { useEffect } from 'react'
import styles from 'styles/sidebar.module.scss'

import FileList from "./FileList"
import TopBar from "./TopBar"

const { ipcRenderer } = window.require('electron')

function getFiles(dir: string) {
  if (dir) ipcRenderer.send('get-folder-content', dir)
}

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState(null)
  const [folderName, setFolderName] = React.useState('MyVault')
  const [collapsed, setCollapsed] = React.useState(true)

  function setupEvents() {
    ipcRenderer.on('folder-content', (event, files) => {
      setFiles(files)
    })
  }

  function retrieveFolderName() {
    if (props.dir) {
      const path = props.dir.split('/')
      const name = path[path.length - 1]
      setFolderName(name)
    }
  }

  useEffect(() => {
    retrieveFolderName()
    getFiles(props.dir)
    ipcRenderer.removeAllListeners('folder-content')
    setupEvents()
  }, [props.folderName, props.dir])

  function handleCollapseAll() {
    setCollapsed(!collapsed)
  }

  return (
    <div className={styles.sidebar}>
        <TopBar onCollapseAll={handleCollapseAll}/>
        <h2>{folderName}</h2>
        <FileList collapsed={collapsed} files={files}/>
    </div>
  )
}
