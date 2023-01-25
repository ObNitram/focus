import { createContext, useContext, useEffect, useState } from 'react'
const { ipcRenderer } = window.require('electron')
import './assets/styles/index.scss'
import styles from 'styles/app.module.scss'

import { SelectedFilesContext } from './context/selectedFilesContext'

import Editor from "./components/editor/Editor"
import Sidebar from "./components/main/sidebar/Sidebar"
import MenuBar from './components/main/menubar/MenuBar'
import Editor_contenair from './components/main/editors_contenair/Editor_contenair'


const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  
  useEffect(() => {
    ipcRenderer.send('get_saved_opened_files')
  }, [])

  useEffect(() => {
    console.log(selectedFiles)
  }, [selectedFiles])
  // TODO: Set folder name and dir after retrieving the saved values


  return (
    <div className={styles.app}>
      <SelectedFilesContext.Provider value={[selectedFiles, setSelectedFiles]}>
        <MenuBar/>
        <div className={styles.appContenair}>
          <Sidebar  />
          <Editor_contenair/>      
        </div>
      </SelectedFilesContext.Provider>
    </div>
  )
}

export default App
