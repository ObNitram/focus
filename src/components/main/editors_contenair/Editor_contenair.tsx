import Editor from '@/components/editor/Editor'
import { useState, useEffect, useContext } from 'react'
import styles from 'styles/components/editor/editors_contenair.module.scss'
import { IoClose } from 'react-icons/io5'
import { pathIsInFiles } from '../sidebar/FileListLogic'
import { normalizePathname } from '@remix-run/router'
import { ColorRing } from 'react-loader-spinner'

import { SelectedFilesContext } from '@/context/selectedFilesContext'
const { ipcRenderer } = window.require('electron')

export type fileType = {
    name:string,
    data:string,
    path:string,
    isRemoved:boolean
}

export default function Editor_contenair():JSX.Element {
    const [openedFiles, setOpenedFiles] = useState<fileType[]>([])
    const [viewedFile, setViewedFile] = useState<fileType>()
    const [unsavedFiles, setUnsavedFiles] = useState<Set<string>>(new Set())
    const [themeReceived, setThemeReceived] = useState<boolean>(false)

    let selectedFilesContext = useContext(SelectedFilesContext);
    
    const isViewed = (fileName:fileType) => {
        if(!viewedFile) return false
        return viewedFile.path == fileName.path
    }


    function setupEvents() {
        ipcRenderer.on('note-opened', (event, noteName, noteData, filePath) => {
            console.log('opened file, noteName is '  + noteName)
            let alreadyPresent = false;
            openedFiles.forEach((elem:fileType) => {
                if(filePath == elem.path){
                    setViewedFile((elem))
                    alreadyPresent = true;
                }
            })
            if(alreadyPresent) return

            let newFile:fileType = {
                name: noteName,
                data: noteData,
                path: filePath,
                isRemoved: false
            }

            setOpenedFiles([...openedFiles, newFile])
            setViewedFile(newFile)
        })

        ipcRenderer.on('folder-content', verifyFolderContent)
        ipcRenderer.on('get_opened_files', (event:Electron.IpcRendererEvent) => {
            console.log('getopenedfiles asked')
            event.sender.send('opened_files_response', openedFiles.map((value:fileType) => {
                return value.path
            }))
        }) 
    }

    function verifyFolderContent(event:Electron.IpcRendererEvent, folderContent:any){
        let newOpened:fileType[] = openedFiles.map((value:fileType) => {
            if (!pathIsInFiles(folderContent, value.path)){
                value.isRemoved = true;
            }else{
                value.isRemoved = false;
            }
            return value
        })

        let newSelected = selectedFilesContext?.[0].map((path:string) => {
            return pathIsInFiles(folderContent, path)
        })
        setOpenedFiles(newOpened)
    }

    useEffect(() => {
        setupEvents()

        return () => {
            ipcRenderer.removeAllListeners('note-opened')
            ipcRenderer.removeAllListeners('get_opened_files')
            ipcRenderer.removeListener('folder-content', verifyFolderContent)
        }
    })

    useEffect(() => {
        ipcRenderer.send('get_saved_opened_files')
        ipcRenderer.once('saved_opened_files', (event, value:string[][]) => {
            console.log('saved_opened_files receive, data is ' + value)
            let newOpenedFiles:fileType[] = []
            value.forEach((elem) => {
                let newFile:fileType = {
                    name: elem[0],
                    data: elem[1],
                    path: elem[2],
                    isRemoved: false
                }
                newOpenedFiles.push(newFile)
            })
            setOpenedFiles(newOpenedFiles)
            setViewedFile(newOpenedFiles.at(-1))
        })
        ipcRenderer.send('getTheme')
        ipcRenderer.once('getTheme_responses', (event, value:string) => {
            let newStyle = document.createElement('style')
            newStyle.innerHTML = value
            document.head.appendChild(newStyle)
            setThemeReceived(true)
        })
    }, [])

    useEffect(() => {
        console.log(openedFiles)
        console.log(unsavedFiles)
    }, [openedFiles, unsavedFiles])

    useEffect(() => {
        if(viewedFile == undefined) return
        if(openedFiles.length == 0) setViewedFile(undefined)
        if(!openedFiles.includes(viewedFile)){
            setViewedFile(openedFiles.at(-1))
        }
    }, [openedFiles])

    useEffect(() => {
        console.log('viewed file has change')
        console.log(viewedFile)
    }, [viewedFile])
    
    const onClose = (path:string) => {
        if(unsavedFiles.has(path)){
            const choice = window.confirm('This note is not saved. Do you really want to close it?')
            if(!choice){
                return
            }else{
                removeUnsavedFiles(path)
            }
        }
        const newOpened = openedFiles.filter((value:fileType) => {
            return value.path != path
        })
        setOpenedFiles(newOpened)
    }

    const addUnsavedFiles = (path:string) => {
        let newSet:Set<string> = new Set(unsavedFiles)
        newSet.add(path)
        setUnsavedFiles(newSet)
    }

    const removeUnsavedFiles = (path:string) => {
        let newSet:Set<string> = new Set(unsavedFiles)
        newSet.delete(path)
        setUnsavedFiles(newSet) 
    }

    if(themeReceived){
        return (

            <div className={styles.editors_contenair}>
                <ul className={styles.tabs_menu}>
                    {openedFiles.map((value:fileType, index:number) => {
                        return( <li className={isViewed(value) ? styles.tab_active :  ''}  key={index} onClick={()=>setViewedFile(value)} >
                                    <p className={value.isRemoved ? styles.p_removed : ''}>{value.name.endsWith('.md') ? value.name.slice(0,-3) : value.name}</p>
                                    <IoClose onClick={() => onClose(value.path)}></IoClose>
                                </li> 
                              )
                    })}
                </ul>
                { openedFiles.length != 0 ? 
                    openedFiles.map((value:fileType, index:number) => {
                        return( <Editor key={index} active={isViewed(value)} file={value} addUnsavedFiles={addUnsavedFiles} removeUnsavedFiles={removeUnsavedFiles}></Editor>
                              )
                    }) 
                    : (<p>Nothing</p>)}
            </div>
        )
    }else{
        return (
            <div className={styles.editors_contenair}>
                <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                    <ColorRing
                        visible={true}
                        height="100"
                        width="100"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={['#8400ff', '#7700e6','#6a00cc','#5c00b3','#4f0099']}
                    />

                </div>
            </div>
        )
    }

    
}