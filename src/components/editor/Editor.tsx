import {useContext, useEffect, useRef, useState} from 'react';

import styles from "styles/components/editor/editor.module.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {AutoLinkPlugin} from '@lexical/react/LexicalAutoLinkPlugin';
import {LinkPlugin as LexicalLinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin'

import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import { MARKDOWN_TRANSFORMERS } from './plugins/MarkdownTransformersPlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LINK_MATCHERS } from './plugins/AutoLinkPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';

import {validateUrl} from './utils/url';

import editorConfig from "../../config/editor/editorConfig";

import Toolbar from './toolbar/Toolbar';
import { fileType } from '../main/editors_contenair/Editor_contenair';
import { EditorState } from 'lexical';
import { NotificationContext, NotificationLevelEnum } from '@/context/NotificationContext';

const { ipcRenderer } = window.require('electron')

export interface Editor_Props {
    active: boolean,
    file:fileType,
    addUnsavedFiles: (path:string) => void,
    removeUnsavedFiles: (path:string) => void,
}

function Placeholder() {
    return <div className={styles.editor_inner_placeholder}>Enter some plain text...</div>;
}

export default function Editor(this:any, props:Editor_Props) {
    const refEditorContenair = useRef<HTMLDivElement>(null)

    const [isNoteSaved, setIsNoteSaved] = useState(true)

    const editorStateRef = useRef<EditorState>()

    const refInput = useRef(null)

    editorConfig.editorState = props.file.data

    const {notifications, addNotification, removeNotification} = useContext(NotificationContext)

    useEffect(() => {
        console.log('Editor of ' + props.file.name + ' is mounted !')
        document.addEventListener('keydown', handleKeyDown);
        ipcRenderer.on('note_saved', (event, path:string) => {
            if(path == props.file.path){
                setIsNoteSaved(true)
                props.removeUnsavedFiles(props.file.path)
            }
        })
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            ipcRenderer.removeAllListeners('note_saved')
        }
    }, [isNoteSaved, props.active])

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            saveNote()
        }
    }

    function saveNote() {
        console.log('Save of ' + props.file.name + ' is asked !\n' +

        ' isNoteSaved is ' + isNoteSaved +
        ' IsActive  is ' + props.active );
        if(isNoteSaved || !editorStateRef || !editorStateRef.current || !props.active ) return
        console.log('Save of ' + props.file.name + ' is send to server')
        ipcRenderer.send('save-note', JSON.stringify(editorStateRef.current.toJSON()), props.file.path)
    }

    const handleChange = (editorState:EditorState) => {
        editorStateRef.current = editorState
        setIsNoteSaved(false)
        props.addUnsavedFiles(props.file.path)
    }

    const exportToPDF = () => {
        const styleElement = (document.getElementById('style_editor') as HTMLStyleElement).outerHTML
        const htmlElement = (document.getElementsByClassName('editor_general')[0] as HTMLDivElement).outerHTML
        console.log(styleElement)
        console.log(htmlElement)
        ipcRenderer.send('savePDF', htmlElement, styleElement)
        ipcRenderer.once('pdf_save_responses', (event, isSaved, name) => {
            addNotification(isSaved ? `'${name}' is saved.` : `The pdf '${name}' is not saved.`, isSaved?  NotificationLevelEnum.SUCESS : NotificationLevelEnum.ERROR)
        })
    }

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className={`${styles.editor_container} ${props.active ? '' : styles.inactive}`} ref={refEditorContenair}>
                <Toolbar isSaved={isNoteSaved} exportTOPDF={exportToPDF}/>

                <div className={styles.editor_inner}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={`${styles.editor_inner_input} editor_general`}/>}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    {/* <OpenedNoteManagementPlugin /> */}
                    <ListPlugin />
                    <CodeHighlightPlugin />
                    <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
                    <AutoLinkPlugin matchers={LINK_MATCHERS} />
                    <ClickableLinkPlugin />
                    <LexicalLinkPlugin validateUrl={validateUrl} />
                    <HistoryPlugin />
                    <OnChangePlugin onChange={(editorState:EditorState) => handleChange(editorState)} ignoreSelectionChange={true} />
                </div>
            </div>
        </LexicalComposer>
    );
}
