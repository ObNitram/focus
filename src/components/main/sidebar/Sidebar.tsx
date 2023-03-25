/**
 * @file Sidebar.tsx
 * @description Sidebar component. Used to display the files and folders. The sidebar is the left part of the app. Is resizable and collapsible.
                The size of the sidebar is saved in the config file.
 */
import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from 'styles/components/main/sidebar.module.scss'

import FileList from "./FileList"
import TopBar from "./TopBar"

import * as FileListLogic from './FileListLogic'
import { SelectedFilesContext } from '@/context/selectedFilesContext'

const pathManage = require('pathmanage')

const { ipcRenderer } = window.require('electron')

let mainFolderPath: string = ''

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState<any>(null) // State who save the files and folders
  const [folderName, setFolderName] = React.useState('MyVault') // State who save the vault name
  const [collapsedAll, setCollapsedAll] = React.useState<boolean | null>(null) //Know if all folders are collapsed or not
  const refBar = useRef<null | HTMLDivElement>(null) // Ref of the div sidebar
  const refResizeBar = useRef<null | HTMLDivElement>(null) //Ref of the div who allow to resize the sidebar
  const [isHidden, setIsHidden] = React.useState<boolean>(false) // State who save if the sidebar is hidden or not
  const [folderToExpand, setFolderToExpand] = React.useState<string | null>(null) // State who save the folders to expand

  const selectedFilesContext = useContext(SelectedFilesContext) // Context who save the selected files

  /**
   * @description Setup the the handle of the events
   */
  function setupEvents() {
    /**
     * @description Called when main process send the files and folders. Sort the files and folders and save them in the state. Retrieve the folder name.
     * @param event Electron.IpcRendererEvent
     * @param folderContent The files and folders
     */
    ipcRenderer.on('folder-content', (event, folderContent) => {
      FileListLogic.changeSortOrderRecursive(folderContent)
      FileListLogic.setRealName(folderContent)
      setFiles({ ...folderContent })

      // Retrieve folder name
      setFolderName(pathManage.getName(folderContent.path))
      mainFolderPath = folderContent.path
    })

    /**
     * @description Called when main process send the size of the sidebar. Set the width of the sidebar.
     * @param event Electron.IpcRendererEvent
     * @param size The size of the sidebar
     */
    ipcRenderer.on('size_sidebar', (event, size) => {
      if (refBar && refBar.current) refBar.current.style.width = '' + size + 'px'
    })
  }

  /**
   * @description Called only once when the component is mounted. Ask the main process to send the files and folders and the size of the sidebar.
   */
  useEffect(() => {
    getSizeSideBar()
    getListOfFilesAndFolders()
  }, [])

  /**
   * @description Called when the folder name change, when the files and folders change or when the selected files change. 
                  Setup the events and add the event listener for the keydown suppr.
   */
  useEffect(() => {
    setupEvents()

    document.addEventListener('keydown', handleSupprKey)

    return () => {
      ipcRenderer.removeAllListeners('folder-content')
      ipcRenderer.removeAllListeners('size_sidebar')
      document.removeEventListener('keydown', handleSupprKey)
    }
  }, [props.folderName, files, selectedFilesContext])

  /**
   * @description Ask the main process to send the files and folders.
   */
  function getListOfFilesAndFolders() {
    ipcRenderer.send('get-folder-content')
  }

  /**
   * @description Ask the main process to send the size of the sidebar.
   */
  function getSizeSideBar() {
    ipcRenderer.send('getSizeSidebar')
  }

  /**
   * @description Called when the user click on the button to collapse or expand all folders.
   * @param collapseAll True if all folders must be collapsed, false otherwise
   */
  function handleCollapseAll(collapseAll: boolean) {
    setCollapsedAll(collapseAll)
  }

  /**
   * @description Called when the user change the sort order of the files and folders.
   * @param item The order by
   */
  function handleSortOrderChange(item: any) {
    const filesCopy = { ...files }
    FileListLogic.changeSortOrderRecursive(filesCopy, item.key)
    setFiles(filesCopy)
  }

  /**
   * @description Called when the user mouse down on the resize bar. Add the event listener for the mouse move.
   * @param event: React.MouseEvent
   */
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!isHidden) window.addEventListener('mousemove', handleMove)
  };

  /**
   * @description Called when the user mouse move when he resize the sidebar.
   * @param e: MouseEvent
   */
  const handleMove = useCallback((e: MouseEvent) => {
    if (!refBar || !refBar.current) return;
    if (e.movementX > 0 && refBar.current?.offsetWidth * 100 / window.innerWidth >= 70) {
      handleMouseUp()
      return
    } else if (e.movementX < 0 && refBar.current?.offsetWidth <= 280) {
      handleMouseUp()
      return
    }
    refBar.current.style.width = `${refBar.current.offsetWidth + e.movementX}px`
    // props.setWidthSideBar(`${refBar.current.offsetWidth + e.movementX}px`)
  }, [])

  /**
   * @description Called when the user mouse up when he resize the sidebar. Remove the event listener for the mouse move and send the new size of the sidebar to the main process.
   */
  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMove)
    ipcRenderer.send('newSizeSideBar', refBar.current?.offsetWidth)
  };


  /**
   * @description Called when the user click on the button to hide or show the sidebar. Use GSAP to animate the sidebar.
   */
  const handleHiddenBar = () => {
    if (!refBar || !refBar.current || !refResizeBar || !refResizeBar.current) return
    let ctx = gsap.context((self: gsap.Context) => {
      if (isHidden) {

        gsap.timeline().to(refBar.current, {
          width: "300px",
          duration: 0.2,
        }).to('h2', {
          visibility: 'visible',
          duration: 0
        }).to('h2', {
          opacity: 1,
          duration: 0.1
        }).to('.' + styles.sidebar_header, {
          borderBottom: 1,
          duration: 0.1
        }).to('.' + styles.sidebar_list, {
          visibility: 'visible',
          duration: 0,
        }).to('.' + styles.sidebar_list, {
          // visibility: 'visible',
          duration: 0.15,
          opacity: 1,
        })
      } else {
        gsap.timeline().to('h2', {
          opacity: 0,
          duration: 0.1
        }).to('h2', {
          visibility: 'hidden',
          duration: 0
        }).to('.' + styles.sidebar_header, {
          borderBottom: 0,
          duration: 0.1
        }).to('.' + styles.sidebar_list, {
          // visibility: 'hidden',
          opacity: 0,
          duration: 0.15
        }).to('.' + styles.sidebar_list, {
          visibility: 'hidden',
          duration: 0
        }).to(refBar.current, {
          width: "60px",
          duration: 0.2
        })
      }
    }, refBar)
    setIsHidden(!isHidden)
    refResizeBar.current.style.cursor = isHidden ? 'e-resize' : 'default'
  }

  /**
   * @description Called when user click on the suppr key. Delete the selected files and folders.
   * @param event: KeyboardEvent
   */
  const handleSupprKey = (event: KeyboardEvent) => {
    if (event.key == 'Delete') {
      selectedFilesContext?.[0].forEach((path: string) => {
        ipcRenderer.send('delete-note-or-folder', path)
      })
      selectedFilesContext?.[1]([])
    }
  }

  /**
   * @description Called when the user clicks on the sidebar but somewhere other than a file or folder. Unselect all files and folders.
   * @param event: React.MouseEvent
   */
  const handleUnselect = (event: React.MouseEvent) => {
    selectedFilesContext?.[1]([])
  }

  return (
    <div className={styles.sidebar} ref={refBar} onClick={handleUnselect} id='sidebar'>

      <div className={styles.sidebar_header}>
        <TopBar onCollapseAll={handleCollapseAll} onSortOrderChange={handleSortOrderChange} onHiddenBar={handleHiddenBar} isHidden={isHidden} />
        <h2>{folderName}</h2>
      </div>
      <FileList collapsedAll={collapsedAll} files={files} folderToExpand={folderToExpand} />
      <div ref={refResizeBar} className={styles.left_border} onMouseDown={(e) => handleMouseDown(e)} onMouseUpCapture={() => handleMouseUp()}></div>
    </div>
  )
}
