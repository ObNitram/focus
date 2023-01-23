import Editor from '@/components/editor/Editor'
import { useState, useEffect } from 'react'
import styles from 'styles/components/editor/editors_contenair.module.scss'
const { ipcRenderer } = window.require('electron')



export default function Editor_contenair():JSX.Element {
    const [openedFiles, setOpenedFiles] = useState<string[]>(['Test', 'Unitiled', 'Bonjour'])
    const [viewedFile, setViewedFile] = useState<string>('Unitiled')

    const isViewed = (fileName:string) => {
        return fileName == viewedFile
    }

    function setupEvents() {
        // ipcRenderer.on('note-opened', (event, noteName, noteData) => {
        //     setNoteName(noteName)

        //     const editorState = editor.parseEditorState(noteData)
        //     editor.setEditorState(editorState)

        //     setIsNoteSaved(true)
        // })
        // ipcRenderer.on('is-note-saved', (event) => {
        //     ipcRenderer.send('is-note-saved-answer', isNoteSaved)
        // })
    }

    useEffect(() => {

    })
    

    return (
        <div className={styles.editors_contenair}>
            <ul className={styles.tabs_menu}>
                {openedFiles.map((value:string, index:number) => {
                    return( <li className={isViewed(value) ? styles.tab_active :  ''}  key={index} onClick={()=>setViewedFile(value)} >
                                {value}
                            </li>
                          )
                })}
            </ul>
            { openedFiles.length != 0 ? 
                openedFiles.map((value:string, index:number) => {
                    return( <Editor active={isViewed(value)}></Editor>
                          )
                }) 
                : (<p>Nothing</p>)}
        </div>
    )
}