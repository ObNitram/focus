import React, { useEffect } from 'react'
import styles from 'styles/sidebar.module.scss'

import FileList from "./FileList"

const { ipcRenderer } = window.require('electron')

let theFiles: Function | null = null

function getFiles(dir: string) {
  if (dir) ipcRenderer.send('get-folder-content', dir)
}

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState(null)
  const [folderName, setFolderName] = React.useState('MyVault')

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

  return (
    <div className={styles.sidebar}>
        <h2>{folderName}</h2>
        <FileList files={files}/>
    </div>
  )
}
