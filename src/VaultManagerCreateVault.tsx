/**
 * @file VaultManagerCreateVault.tsx
 * @description Page displayed when the user click on the "Create" button on the vault manager page.
  *             Allow the user to choose a name and a location for the vault
 */

import './assets/styles/index.scss'
import styles from 'styles/vaultManager.module.scss'

import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

const { ipcRenderer } = window.require('electron')

let theLocation: Function | null = null

const VaultManagerCreateVault: React.FC = () => {

  const [location, setLocation] = useState(null) // Store the location of the vault
  const [cannotCreateVault, setCannotCreateVault] = useState(true) // Store if the user can create the vault or not (if the name is empty)
  const [vaultName, setVaultName] = useState('') // Store the name of the vault

  /**
   * @description Called when the component is mounted. Add listeners to the ipcRenderer to listen to the events sent by the main process
   */
  useEffect(() => {
    ipcRenderer.removeAllListeners('directory-chosen')
    ipcRenderer.removeAllListeners('vault-created')

    /**
     * @description Called when the user choose a location for the vault. Store the location in the state
     */
    ipcRenderer.on('directory-chosen', (event, path: string) => {
      if (path !== undefined) {
        if (path.length > 100) {
          path = path.substring(0, 100) + '...'
        }

        if (theLocation != null) {
          theLocation(path)
        }
      }
    })

    /**
     * @description Called when the vault is created. Send a message to the main process to open the main window and close the vault manager
     */
    ipcRenderer.on('vault-created', (event, path: string) => {
      ipcRenderer.send('open_main_window', path)
    })

    return () => {
      ipcRenderer.removeAllListeners('directory-chosen')
      ipcRenderer.removeAllListeners('vault-created')
    }
  }, [])

  theLocation = setLocation

  /**
   * @description Set the value of the vault name in the state, and check if the user can create the vault or not
   * @param value: string - The value of the input
   */
  function setTextInputValue(value: string) {
    setVaultName(value)
    if (value.length > 0) {
      setCannotCreateVault(false)
    } else {
      setCannotCreateVault(true)
    }
  }

  /**
   * @description Called when the user click on the "Browse" button. 
                  Send a message to the main process to open the file explorer for the user to choose a folder
   */
  function chooseDirectory() {
    ipcRenderer.send('choose-directory')
  }

  /**
   * @description Called when the user click on the "Create vault" button. Ask the main process to create the vault
   */
  function createVault() {
    ipcRenderer.send('create-vault', vaultName, location)
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
            <p id={styles.location}>{location != null ? location : 'No location chosen, default to your Documents folder'}</p>
          </div>
          <button onClick={chooseDirectory}>Browse</button>
        </li>
      </ul>
      <button disabled={cannotCreateVault} onClick={createVault}>Create vault</button>
    </div>
  )
}

export default VaultManagerCreateVault
