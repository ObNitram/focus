import React, { useCallback, useEffect, useRef, useState } from 'react'
import {gsap} from 'gsap'
import styles from 'styles/components/main/sidebar.module.scss'

import FileList from "./FileList"
import TopBar from "./TopBar"
import { white } from 'colors'

const { ipcRenderer } = window.require('electron')

let filesCopy: any = []
let currSortOrder: any = 'name-asc'

let mainFolderPath: string = ''

export default function Sidebar(props: any) {
  const [files, setFiles] = React.useState<any>([])
  const [folderName, setFolderName] = React.useState('MyVault')
  const [collapsedAll, setCollapsedAll] = React.useState<boolean | null>(null)
  const refBar = useRef<null | HTMLDivElement>(null)
  const refResizeBar = useRef<null|HTMLDivElement>(null)
  const [isHidden, setIsHidden] = React.useState<boolean>(false)
  const [folderToExpand, setFolderToExpand] = React.useState<string | null>(null)

  function setupEvents() {
    ipcRenderer.on('folder-content', (event, theFiles) => {
      changeSortOrderRecursive(theFiles[0].children)
      filesCopy = theFiles[0].children
      setFiles(filesCopy)

      // Retrieve folder name
      setFolderName(theFiles[0].name)
      mainFolderPath = theFiles[0].path
    })
  }

  useEffect(() => {

    getFiles()
    ipcRenderer.removeAllListeners('folder-content')
    ipcRenderer.removeAllListeners('note-created')
    ipcRenderer.removeAllListeners('folder-created')
    ipcRenderer.removeAllListeners('note-or-folder-deleted')
    setupEvents()
  }, [props.folderName])

  function addNewNoteOrFolderInRightPlace(newNoteOrFolder: any) {
    let pathParts = newNoteOrFolder.path.split(mainFolderPath + '/')[1].split('/')
    let parentPath = mainFolderPath + '/' + pathParts.shift()

    let folderWhereToInsert = filesCopy

    while (parentPath.length > 0) {
      let folderWhereToInsertTemp = [...folderWhereToInsert]
      folderWhereToInsertTemp = folderWhereToInsertTemp.find((file: any) => file.path === parentPath)

      if (folderWhereToInsertTemp) {
        folderWhereToInsert = folderWhereToInsertTemp.children
        parentPath = parentPath + '/' + pathParts.shift()
      }
      else {
        break
      }
    }

    folderWhereToInsert.push(newNoteOrFolder)
    changeSortOrderRecursive(filesCopy)
    setFiles([...filesCopy])

    setCollapsedAll(null)
    setFolderToExpand(newNoteOrFolder.path.split('/').slice(0, newNoteOrFolder.path.split('/').length - 1).join('/'))
  }

  function filterDeletedNoteOrFolderRecursive(theFiles: any, path: string) {
    let filesCopy = [...theFiles]
    filesCopy.forEach((file: any, index: number) => {
      if (file.path === path) {
        filesCopy.splice(index, 1)
      } else if (file.isDirectory) {
        file.children = filterDeletedNoteOrFolderRecursive(file.children, path)
      }
    })
    return filesCopy
  }

  function getFiles() {
    ipcRenderer.send('get-folder-content')
  }

  function handleCollapseAll(collapseAll: boolean) {
    setCollapsedAll(collapseAll)
  }

  function changeSortOrderRecursive(files: any) {
    switch (currSortOrder) {
      case 'name-asc':
        files.sort((a: any, b: any) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        files.sort((a: any, b: any) => b.name.localeCompare(a.name))
        break
      case 'modified-desc':
        files.sort((a: any, b: any) => b.modifiedTime - a.modifiedTime)
        break
      case 'modified-asc':
        files.sort((a: any, b: any) => a.modifiedTime - b.modifiedTime)
        break
      case 'created-desc':
        files.sort((a: any, b: any) => b.createdTime - a.createdTime)
        break
      case 'created-asc':
        files.sort((a: any, b: any) => a.createdTime - b.createdTime)
        break
    }
    files.forEach((file: any) => {
      if (file.isDirectory) {
        changeSortOrderRecursive(file.children)
      }
    })
  }

  function handleSortOrderChange(item: any) {
    const filesCopy = [...files]
    currSortOrder = item.key
    changeSortOrderRecursive(filesCopy)
    setFiles(filesCopy)
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    if(!isHidden)  window.addEventListener('mousemove', handleMove)
    console.log('down')
  };

  const handleMove = useCallback((e:MouseEvent) => {
    if(! refBar || !refBar.current) return;
    console.log(refBar.current?.offsetWidth * 100 / window.innerWidth)
    if(e.movementX > 0 && refBar.current?.offsetWidth * 100 / window.innerWidth >= 70){
      handleMouseUp()
      return
    }else if(e.movementX<0 && refBar.current?.offsetWidth * 100 / window.innerWidth <= 20){
      handleMouseUp()
      return
    }
    console.log(refBar.current.style.width)
    refBar.current.style.width = `${refBar.current.offsetWidth + e.movementX}px`
    console.log(refBar.current.style.width)
  }, [])

  const handleMouseUp = () => {
    console.log('up')
    window.removeEventListener('mousemove', handleMove)
  };


  const handleHiddenBar = () => {
    if(!refBar || ! refBar.current || !refResizeBar || !refResizeBar.current) return
    let ctx = gsap.context((self:gsap.Context) => {
      if(isHidden){
        
        gsap.timeline().to(refBar.current, {
          width: "300px",
          duration: 0.2,
        }).to('.'+styles.sidebar_header, {
          borderBottom: 1,
          duration: 0.1
        }).to('h2', {
          visibility: 'visible',
          duration: 0
        }).to('.'+styles.sidebar_list, {
          visibility: 'visible',
          duration: 0,
        }).to('.'+styles.sidebar_list, {
          // visibility: 'visible',
          duration: 0.2,
          opacity: 1,
        })
      }else{
        gsap.timeline().to('h2', {
          visibility: 'hidden',
          duration: 0.1
        }).to('.'+styles.sidebar_list, {
          // visibility: 'hidden',
          opacity: 0,
          duration: 0.1
        }).to('.'+styles.sidebar_list, {
          visibility: 'hidden',
          duration: 0
        }).to('.'+styles.sidebar_header, {
          borderBottom: 0,
          duration: 0
          
        }, -0.1).to(refBar.current, {
          width: "60px",
          duration: 0.2
        })
      }
    }, refBar)
    setIsHidden(!isHidden)
    refResizeBar.current.style.cursor = isHidden? 'e-resize' : 'default'
  }

  return (
    <div className={styles.sidebar} ref={refBar}>

      <div className={styles.sidebar_header + ' test'}>
        <TopBar onCollapseAll={handleCollapseAll} onSortOrderChange={handleSortOrderChange} onHiddenBar={handleHiddenBar} isHidden={isHidden}/>
        <h2>{folderName}</h2>
      </div>
      <FileList collapsedAll={collapsedAll} files={files} folderToExpand={folderToExpand} />
      <div ref={refResizeBar} className={styles.left_border} onMouseDown={(e) => handleMouseDown(e)} onMouseUpCapture={() => handleMouseUp()}></div>
    </div>
  )
}
