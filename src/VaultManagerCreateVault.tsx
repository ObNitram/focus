import './assets/styles/index.scss'
import styles from 'styles/vaultManager.module.scss'

import { Link } from 'react-router-dom'
import React, { useState } from 'react'

const { ipcRenderer } = window.require('electron')

const VaultManagerCreateVault: React.FC = () => {

  ipcRenderer.on('directory-chosen', (event, path) => {
    if (path !== undefined) {
      if (path.length > 100) {
        path = path.substring(0, 100) + '...'
      }
      setLocation(path)
    }
  })

  const [location, setLocation] = useState('No location chosen, default to your Documents folder')
  const [cannotCreateVault, setCannotCreateVault] = useState(true)
  const [vaultName, setVaultName] = useState('')

  function setTextInputValue(value: string) {
    setVaultName(value)
    if (value.length > 0) {
      setCannotCreateVault(false)
    } else {
      setCannotCreateVault(true)
    }
  }

  function chooseDirectory() {
    ipcRenderer.send('choose-directory')
  }

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
          <input type="text" placeholder="My awesome vault name" value={vaultName} onChange={e => setTextInputValue(e.target.value)} />
        </li>
        <li>
          <div>
            <h2>Location</h2>
            <p>Choose where you want to store your vault.</p>
            <p id={styles.location}>{location}</p>
          </div>
          <button onClick={chooseDirectory}>Browse</button>
        </li>
      </ul>
      <button disabled={cannotCreateVault}>Create vault</button>
    </div>
  )
}

export default VaultManagerCreateVault
