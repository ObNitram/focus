import Editor from '@/components/editor/Editor'
import { useState, useEffect } from 'react'
import styles from 'styles/components/editor/editors_contenair.module.scss'
const { ipcRenderer } = window.require('electron')

export type fileType = {
    name:string,
    data:string,
    path:string,
}

export default function Editor_contenair():JSX.Element {
    const [openedFiles, setOpenedFiles] = useState<fileType[]>([])
    const [viewedFile, setViewedFile] = useState<fileType>()

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
                path: filePath
            }

            setOpenedFiles([...openedFiles, newFile])
            setViewedFile(newFile)
            // setNoteName(noteName)

            // const editorState = editor.parseEditorState(noteData)
            // editor.setEditorState(editorState)

            // setIsNoteSaved(true)
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
    }, [openedFiles])
    

    return (
        <div className={styles.editors_contenair}>
            <ul className={styles.tabs_menu}>
                {openedFiles.map((value:fileType, index:number) => {
                    return( <li className={isViewed(value) ? styles.tab_active :  ''}  key={index} onClick={()=>setViewedFile(value)} >
                                {value.name}
                            </li> 
                          )
                })}
            </ul>
            { openedFiles.length != 0 ? 
                openedFiles.map((value:fileType, index:number) => {
                    return( <Editor key={index} active={isViewed(value)} file={value}></Editor>
                          )
                }) 
                : (<p>Nothing</p>)}
        </div>
    )
}