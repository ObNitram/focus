/**
 * Top level component. Used to setup the context and the events, and to display the components
 */
import { useEffect, useState } from 'react'
const { ipcRenderer } = window.require('electron')
import './assets/styles/index.scss'
import styles from 'styles/app.module.scss'

import { SelectedFilesContext } from './context/selectedFilesContext'
import { NotificationContext, NotificationType, NotificationLevelEnum } from './context/NotificationContext'
import Sidebar from "./components/main/sidebar/Sidebar"
import MenuBar from './components/main/menubar/MenuBar'
import Editor_contenair from './components/main/editors_contenair/Editor_contenair'
import ThemeGenerator from './components/main/themeGenerator/ThemeGenerator'
import { Loader } from './components/generic/Loader'
import { NotificationInfo } from './components/generic/NotificationInfo'


const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]) // State who save the selected files
  const [displayThemeGenerator, setDisplayThemeGenerator] = useState<boolean>(false) // State used to display the theme generator
  const [themeReceived, setThemeReceived] = useState<boolean>(false) // Used to know if display the loader or not
  const [themes, setThemes] = useState<{ name: string, css: string }[] | null>(null) // Used to save the themes
  const [selectedTheme, setSelectedTheme] = useState<string>('default') // Used to save the selected theme
  const [notification, setNotification] = useState<NotificationType[]>([]) // Used to display the notifications

  /**
   * Setup the events
   */
  function setupEvents() {
    /**
     * @description Called when main process send the themes
     * @param event Electron.IpcRendererEvent
     * @param value { name: string, css: string }[] The themes
     * @param themeToSet string The theme to set
     */
    ipcRenderer.on('getTheme_responses', (event, value: { name: string, css: string }[], themeToSet: string) => {
      let editor_style: HTMLStyleElement | null = document.getElementById('style_editor') as HTMLStyleElement
      if (editor_style == null) {
        editor_style = document.createElement('style')
        editor_style.id = 'style_editor'
        document.head.appendChild(editor_style)
      }
      let found: boolean = false
      value.forEach((value: { name: string, css: string }) => {
        if (value.name == themeToSet && editor_style) {
          editor_style.innerHTML = value.css
          found = true
          setSelectedTheme(themeToSet)
        }
      })
      if (!found && editor_style) {
        editor_style.innerHTML = value[0].css
        setSelectedTheme(value[0].name)
      }
      setThemeReceived(true)
      setThemes(value)
    })

    /**
     * @description Called when main process send a notification
     * @param event Electron.IpcRendererEvent
     * @param value NotificationType The notification
     */
    ipcRenderer.on('notification', (event, value: NotificationType) => {
      setNotification([...notification, value])
    })
  }

  /**
   * Called when the component is mounted, only once. Ask the main process to get the themes and setup the events.
   */
  useEffect(() => {
    ipcRenderer.send('getTheme')
    setupEvents()

    return () => {
      ipcRenderer.removeAllListeners('getTheme_responses')
    }
  }, [])

  /**
   * Called when the selected theme change. Set the css of the editor
   */
  useEffect(() => {
    let style = document.getElementById('style_editor')
    if (style != null) {
      style.innerHTML = themes?.find((value) => value.name == selectedTheme)?.css || ''
    }
  }, [selectedTheme])

  /**
   * @description Called when the user click on the close button of the theme generator. Change the state.
   */
  const closeThemeGenerator = () => {
    setDisplayThemeGenerator(false)
  }

  /**
   * @description Function who add a notification. Shared by context to all the components
   * @param s: string The text of the notification
   * @param level: NotificationLevelEnum The level of the notification
   */
  const addNotif = (s:string, level:NotificationLevelEnum) => {
    console.log('ADD NOTIF')
    let newNotif:NotificationType = {
      text: s,
      level: level
    }
    setNotification([...notification, newNotif])
  }

  /**
   * @description Function who remove a notification. Shared by context to all the components
   * @param notificationToDelete:NotificationType The notification to delete
   */
  const removeNotif = (notificationToDelete:NotificationType) => {
    setNotification(notification.filter((value:NotificationType) => {
      return (value.level != notificationToDelete.level && value.text != notificationToDelete.text)
    }))
  }

  return (
    <div className={styles.app}>
      <NotificationContext.Provider  value={{notifications:notification, addNotification:addNotif, removeNotification:removeNotif}}>
        <SelectedFilesContext.Provider value={[selectedFiles, setSelectedFiles]}>
          <MenuBar themes={themes} selectedTheme={selectedTheme} displayManageTheme={setDisplayThemeGenerator} displayThemeGenerator={displayThemeGenerator} setSelectedTheme={setSelectedTheme} />
          {themeReceived ?
            <div className={styles.appContenair} style={{ display: displayThemeGenerator ? 'none' : 'flex' }}>
              <Sidebar />
              <Editor_contenair />
            </div>
            :
            <div className={styles.editors_contenair}>
              <Loader />
            </div>
          }
          {displayThemeGenerator && <ThemeGenerator closeThemeGenerator={closeThemeGenerator} ></ThemeGenerator>}

          {notification.map((value: NotificationType) => {
            return <NotificationInfo notification={value} />
          })}
        </SelectedFilesContext.Provider>
      </NotificationContext.Provider>
    </div>
  )
}

export default App
