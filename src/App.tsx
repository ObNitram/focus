import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
const { ipcRenderer } = window.require('electron')
import './assets/styles/index.scss'
import styles from 'styles/app.module.scss'

import { SelectedFilesContext } from './context/selectedFilesContext'

import Editor from "./components/editor/Editor"
import Sidebar from "./components/main/sidebar/Sidebar"
import MenuBar from './components/main/menubar/MenuBar'
import Editor_contenair from './components/main/editors_contenair/Editor_contenair'
import ThemeGenerator from './components/main/themeGenerator/ThemeGenerator'
import { ColorRing } from 'react-loader-spinner'


const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [displayThemeGenerator, setDisplayThemeGenerator] = useState<boolean>(false)
  const [themeReceived, setThemeReceived] = useState<boolean>(false)
  const [themes, setThemes] = useState<{name:string, css:string}[]| null>(null)
  const [selectedTheme, setSelectedTheme] = useState<string>('default')

  useEffect(() => {
    ipcRenderer.send('getTheme')
        ipcRenderer.once('getTheme_responses', (event, value: {name:string, css:string}[]) => {
            let newStyle = document.createElement('style')
            newStyle.innerHTML = value[0].css
            document.head.appendChild(newStyle)
            setThemeReceived(true)
            setSelectedTheme('default')
            setThemes(value)
        })
  }, [])

  useEffect(() => {
    console.log(selectedFiles)
  }, [selectedFiles])
  // TODO: Set folder name and dir after retrieving the saved values

  const closeThemeGenerator = () => {
    setDisplayThemeGenerator(false)
  }

  return (
    <div className={styles.app}>
      <SelectedFilesContext.Provider value={[selectedFiles, setSelectedFiles]}>
        <MenuBar themes={themes} selectedTheme={selectedTheme} displayManageTheme={setDisplayThemeGenerator}/>
        {themeReceived ? 
        <div className={styles.appContenair} style={{display: displayThemeGenerator? 'none' : 'flex'}}>
          <Sidebar  />
          <Editor_contenair/>
        </div>
        : 
          <div className={styles.editors_contenair}>
              <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                  <ColorRing
                      visible={true}
                      height="100"
                      width="100"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      colors={['#8400ff', '#7700e6','#6a00cc','#5c00b3','#4f0099']}
                  />

              </div>
          </div>
        }
        {displayThemeGenerator && <ThemeGenerator closeThemeGenerator={closeThemeGenerator}></ThemeGenerator>}
      </SelectedFilesContext.Provider>
    </div>
  )
}

export default App
