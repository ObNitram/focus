import './assets/styles/index.scss'
import styles from 'styles/vaultManager.module.scss'

import { Link } from 'react-router-dom'

const { ipcRenderer } = window.require('electron')

function chooseDirectory() {
  ipcRenderer.send('choose-directory')
}

const VaultManagerCreateVault: React.FC = () => {

  return (
    <div className={styles.vaultManager}>
      <h1>Welcome to Focus!</h1>
      <ul>
        <li>
            <div>
                <Link className={styles.button} to="/vault-manager">Back</Link>
                <h2>Create local vault</h2>
            </div>
        </li>
        <li>
            <div>
                <h2>Vault name</h2>
                <p>Pick a name for your awesome vault.</p>
            </div>
            <input type="text" placeholder="My awesome vault name" />
        </li>
        <li>
            <div>
                <h2>Location</h2>
                <p>Choose where you want to store your vault.</p>
            </div>
            <button onClick={chooseDirectory}>Browse</button>
        </li>
      </ul>
    </div>
  )
}

export default VaultManagerCreateVault
