import { useState } from 'react'
import './assets/styles/index.scss'
import styles from 'styles/app.module.scss'

import Editor from "./components/editor/Editor"
import Sidebar from "./components/main/sidebar/Sidebar"
import MenuBar from './components/main/menubar/MenuBar'

const App: React.FC = () => {

  // TODO: Set folder name and dir after retrieving the saved values

  return (
    <div className={styles.app}>
      <MenuBar/>
      <Sidebar />

      {/* <h1>Text editor</h1>
      <Editor/> */}

    </div>
  )
}

export default App
