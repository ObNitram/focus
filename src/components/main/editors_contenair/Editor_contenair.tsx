import Editor from '@/components/editor/Editor'
import { useState, useEffect } from 'react'
import styles from 'styles/components/editor/editors_contenair.module.scss'
import { IoClose } from 'react-icons/io5'
import { pathIsInFiles } from '../sidebar/FileListLogic'
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
            // setNoteName(noteName)

            // const editorState = editor.parseEditorState(noteData)
            // editor.setEditorState(editorState)

            // setIsNoteSaved(true)
        })
        ipcRenderer.on('folder-content', (event, folderContent) => {
            let newOpened:fileType[] = openedFiles.map((value:fileType) => {
                if (!pathIsInFiles(folderContent, value.path)){
                    value.isRemoved = true;
                }else{
                    value.isRemoved = false;
                }
                return value
            })
            setOpenedFiles(newOpened)
        })
    }

    useEffect(() => {
        setupEvents()

        return () => {
            ipcRenderer.removeAllListeners('note-opened')
        }
    })

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
}