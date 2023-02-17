/**
 * @file VaultManager.tsx
 * @description Vault manager component. First page displayed when the app is launched for the first time
 */
import './assets/styles/index.scss'
import styles from 'styles/vaultManager.module.scss'

import { Link } from 'react-router-dom'

const { ipcRenderer } = window.require('electron')

/**
 * @description Called when the user click on the "Open" button. 
                Send a message to the main process to open the file explorer for the user to choose a folder
 */
function chooseDirectory() {
  ipcRenderer.send('choose-directory')
}

/**
 * @description Called when the user choose a folder. Ask the main process to open the main window and close the vault manager
 */
ipcRenderer.on('directory-chosen', (event, path:string) => {
  ipcRenderer.send('open_main_window', path)
})

const VaultManager: React.FC = () => {

  return (
    <div className={styles.vaultManager}>

      <h1>Welcome to Focus!</h1>
      <ul>
        <li>
          <div>
            <h2>Create new vault</h2>
            <p>Create a new vault under the folder of your choice.</p>
          </div>
          <Link className={styles.button} to="/vault-manager/create-vault">Create</Link>
        </li>
        <li>
          <div>
            <h2>Open folder as vault</h2>
            <p>Choose an existing folder of Markdown files to open it as a vault.</p>
          </div>
          <button onClick={chooseDirectory}>Open</button>
        </li>
      </ul>
    </div>
  )
}

export default VaultManager
