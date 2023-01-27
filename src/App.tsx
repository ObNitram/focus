import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
const { ipcRenderer } = window.require('electron')
import './assets/styles/index.scss'
import styles from 'styles/app.module.scss'

import { SelectedFilesContext } from './context/selectedFilesContext'

import Editor from "./components/editor/Editor"
import Sidebar from "./components/main/sidebar/Sidebar"
import MenuBar from './components/main/menubar/MenuBar'
import Editor_contenair from './components/main/editors_contenair/Editor_contenair'
import { ButtonToggleThemeGenerator } from './components/main/themeGenerator/ButtonToggleThemeGenerator'
import ThemeGenerator from './components/main/themeGenerator/ThemeGenerator'


const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [displayThemeGenerator, setDisplayThemeGenerator] = useState<boolean>(false)

  useEffect(() => {
    console.log(selectedFiles)
  }, [selectedFiles])
  // TODO: Set folder name and dir after retrieving the saved values


  return (
    <div className={styles.app}>
      <SelectedFilesContext.Provider value={[selectedFiles, setSelectedFiles]}>
        <MenuBar/>
        <div className={styles.appContenair} style={{display: displayThemeGenerator? 'none' : 'flex'}}>
          <Sidebar  />
          <Editor_contenair/>
        </div>
        {displayThemeGenerator && <ThemeGenerator></ThemeGenerator>}
        <ButtonToggleThemeGenerator title={displayThemeGenerator ? 'Return to editor.' : 'Display theme generator.'} toggleThemeGenerator={() => setDisplayThemeGenerator(!displayThemeGenerator)}></ButtonToggleThemeGenerator>
      </SelectedFilesContext.Provider>
    </div>
  )
}

export default App
