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
import { Loader } from './components/generic/Loader'


const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [displayThemeGenerator, setDisplayThemeGenerator] = useState<boolean>(false)
  const [themeReceived, setThemeReceived] = useState<boolean>(false)
  const [themes, setThemes] = useState<{name:string, css:string}[]| null>(null)
  const [selectedTheme, setSelectedTheme] = useState<string>('default')

  useEffect(() => {
    ipcRenderer.send('getTheme')
    ipcRenderer.on('getTheme_responses', (event, value: {name:string, css:string}[], themeToSet:string) => {
      let editor_style:HTMLStyleElement|null = document.getElementById('style_editor') as HTMLStyleElement
      if(editor_style == null) {
        editor_style = document.createElement('style')
        editor_style.id= 'style_editor'
        document.head.appendChild(editor_style)
      }
      let found:boolean = false
      value.forEach((value: {name:string, css:string}) => {
        if(value.name == themeToSet && editor_style) {
          editor_style.innerHTML = value.css
          found = true
          setSelectedTheme(themeToSet)
        }
      })
      if(!found && editor_style) {
        editor_style.innerHTML = value[0].css
        setSelectedTheme(value[0].name)
      }
      setThemeReceived(true)
      setThemes(value)
    })
  }, [])

  useEffect(() => {
    let style = document.getElementById('style_editor')
    if(style != null){
      style.innerHTML = themes?.find((value) => value.name == selectedTheme)?.css || ''
    }
  }, [selectedTheme])

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
        <MenuBar themes={themes} selectedTheme={selectedTheme} displayManageTheme={setDisplayThemeGenerator} displayThemeGenerator={displayThemeGenerator} setSelectedTheme={setSelectedTheme}/>
        {themeReceived ? 
        <div className={styles.appContenair} style={{display: displayThemeGenerator? 'none' : 'flex'}}>
          <Sidebar  />
          <Editor_contenair/>
        </div>
        : 
          <div className={styles.editors_contenair}>
              <Loader/>
          </div>
        }
        {displayThemeGenerator && <ThemeGenerator closeThemeGenerator={closeThemeGenerator} ></ThemeGenerator>}
      </SelectedFilesContext.Provider>
    </div>
  )
}

export default App
