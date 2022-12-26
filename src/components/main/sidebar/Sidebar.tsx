import React, { useEffect } from 'react'
import styles from 'styles/sidebar.module.scss'

import FileList from "./FileList"

const { ipcRenderer } = window.require('electron')

let theFiles: Function | null = null

function setupEvents() {
  ipcRenderer.on('folder-content', (event, files) => {
    if (theFiles) {
      theFiles(files)
    }
  })
}

function getFiles(dir: string) {
  if (dir) ipcRenderer.send('get-folder-content', dir)
}

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState(null)
  const [folderName, setFolderName] = React.useState('MyVault')

  setupEvents()
  theFiles = setFiles

  useEffect(() => {
    getFiles(props.dir)
    ipcRenderer.removeAllListeners('folder-content')
    setupEvents()

    if (props.folderName) {
      setFolderName(props.folderName)
    }
  }, [props.folderName, props.dir])

  return (
    <div className={styles.sidebar}>
        <h2>{folderName}</h2>
        <FileList files={files}/>
    </div>
  )
}
