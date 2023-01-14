import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {gsap} from 'gsap'
import styles from 'styles/components/main/sidebar.module.scss'

import FileList from "./FileList"
import TopBar from "./TopBar"

import * as FileListLogic from './FileListLogic'
import { SelectedFilesContext } from '@/context/selectedFilesContext'

const { ipcRenderer } = window.require('electron')

let mainFolderPath: string = ''

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState<any>(null)
  const [folderName, setFolderName] = React.useState('MyVault')
  const [collapsedAll, setCollapsedAll] = React.useState<boolean | null>(null)
  const refBar = useRef<null | HTMLDivElement>(null)
  const refResizeBar = useRef<null | HTMLDivElement>(null)
  const [isHidden, setIsHidden] = React.useState<boolean>(false)
  const [folderToExpand, setFolderToExpand] = React.useState<string | null>(null)

  const selectedFilesContext = useContext(SelectedFilesContext)

  function setupEvents() {
    ipcRenderer.on('folder-content', (event, folderContent) => {
      FileListLogic.changeSortOrderRecursive(folderContent)
      setFiles({ ...folderContent })

      // Retrieve folder name
      setFolderName(folderContent.name)
      mainFolderPath = folderContent.path
    })

    ipcRenderer.on('note-created', (event, note) => {
      setFiles({ ...FileListLogic.addNoteOrFolder(note, files, mainFolderPath) })

      setCollapsedAll(null)
      setFolderToExpand(note.path.split('/').slice(0, note.path.split('/').length - 1).join('/'))
    })
    ipcRenderer.on('folder-created', (event, folder) => {
      setFiles({ ...FileListLogic.addNoteOrFolder(folder, files, mainFolderPath) })

      setCollapsedAll(null)
      setFolderToExpand(folder.path.split('/').slice(0, folder.path.split('/').length - 1).join('/'))
    })
    ipcRenderer.on('note-or-folder-deleted', (event, path) => {
      setFiles({ ...FileListLogic.deleteNoteOrFolder(files, path) })
    })
    ipcRenderer.on('note-updated', (event, note) => {
      setFiles({ ...FileListLogic.modifyNoteOrFolder(note, files, mainFolderPath) })
    })

    ipcRenderer.on('size_sidebar', (event, size) => {
      if (refBar && refBar.current) refBar.current.style.width = '' + size + 'px'
    })
  }

  useEffect(() => {
    setupEvents()

    if (files === null) {
        getSizeSideBar()
        getListOfFilesAndFolders()
    }
    document.addEventListener('keydown', handleSupprKey)

    return () => {
      ipcRenderer.removeAllListeners('folder-content')
      ipcRenderer.removeAllListeners('note-created')
      ipcRenderer.removeAllListeners('folder-created')
      ipcRenderer.removeAllListeners('note-or-folder-deleted')
      ipcRenderer.removeAllListeners('note-updated')
      ipcRenderer.removeAllListeners('size_sidebar')
      document.removeEventListener('keydown', handleSupprKey)
    }
  }, [props.folderName, files, selectedFilesContext])

  function getListOfFilesAndFolders() {
    ipcRenderer.send('get-folder-content')
  }

  function getSizeSideBar() {
    ipcRenderer.send('getSizeSidebar')
  }

  function handleCollapseAll(collapseAll: boolean) {
    setCollapsedAll(collapseAll)
  }

  function handleSortOrderChange(item: any) {
    const filesCopy = { ...files }
    FileListLogic.changeSortOrderRecursive(filesCopy, item.key)
    setFiles(filesCopy)
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!isHidden) window.addEventListener('mousemove', handleMove)
  };

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
  }, [])

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMove)
    ipcRenderer.send('newSizeSideBar', refBar.current?.offsetWidth)
  };


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

  const handleSupprKey = (event:KeyboardEvent) => {
    if(event.key == 'Delete'){
      selectedFilesContext?.[0].forEach((path:string) => {
        ipcRenderer.send('delete-note-or-folder', path)
      })
      selectedFilesContext?.[1]([])
    }
  }

  return (
    <div className={styles.sidebar} ref={refBar}>

      <div className={styles.sidebar_header + ' test'}>
        <TopBar onCollapseAll={handleCollapseAll} onSortOrderChange={handleSortOrderChange} onHiddenBar={handleHiddenBar} isHidden={isHidden} />
        <h2>{folderName}</h2>
      </div>
      <FileList collapsedAll={collapsedAll} files={files} folderToExpand={folderToExpand} />
      <div ref={refResizeBar} className={styles.left_border} onMouseDown={(e) => handleMouseDown(e)} onMouseUpCapture={() => handleMouseUp()}></div>
    </div>
  )
}
