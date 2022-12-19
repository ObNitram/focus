import { useState } from 'react'
import './assets/styles/index.scss'
import styles from 'styles/app.module.scss'

import Editor from "./components/editor/Editor"

const App: React.FC = () => {
  const [count, setCount] = useState(0)



  return (
    <div className={styles.app}>

      <h1>Text editor</h1>
      <Editor/>

    </div>
  )
}

export default App
