import {useEffect, useRef, useState} from 'react';

import styles from "styles/components/editor/editor.module.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {AutoLinkPlugin} from '@lexical/react/LexicalAutoLinkPlugin';
import {LinkPlugin as LexicalLinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin'

import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import { MARKDOWN_TRANSFORMERS } from './plugins/MarkdownTransformersPlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LINK_MATCHERS } from './plugins/AutoLinkPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';

import {validateUrl} from './utils/url';

import editorConfig from "../../config/editor/editorConfig";

import Toolbar from './toolbar/Toolbar';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { fileType } from '../main/editors_contenair/Editor_contenair';
import { EditorState } from 'lexical';

const { ipcRenderer } = window.require('electron')

export interface Editor_Props {
    active: boolean,
    file:fileType
}

function Placeholder() {
    return <div className={styles.editor_inner_placeholder}>Enter some plain text...</div>;
}

export default function Editor(this:any, props:Editor_Props) {
    const refEditorContenair = useRef<HTMLDivElement>(null)

    const [noteName, setNoteName] = useState(props.file.name)
    const [isNoteSaved, setIsNoteSaved] = useState(true)

    const editorStateRef = useRef<EditorState>()

    editorConfig.editorState = props.file.data

    useEffect(() => {
        console.log('Editor of ' + props.file.name + ' is mounted !')
        document.addEventListener('keydown', handleKeyDown);
        ipcRenderer.on('note_saved', (event, path:string) => {
            if(path == props.file.path){
                setIsNoteSaved(true)
            }
        })
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            ipcRenderer.removeAllListeners('note_saved')
        }
    }, [isNoteSaved])

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            saveNote()
        }
    }

    function saveNote() {
        if(isNoteSaved || !editorStateRef || !editorStateRef.current ) return
        ipcRenderer.send('save-note', JSON.stringify(editorStateRef.current.toJSON()), props.file.path)
    }

    const handleChange = (editorState:EditorState) => {
        editorStateRef.current = editorState
        setIsNoteSaved(false)
    }

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className={`${styles.editor_container} ${props.active ? '' : styles.inactive}`} ref={refEditorContenair}>
                <Toolbar />

                <div className={styles.editor_inner}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={styles.editor_inner_input} />}
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
                    <OnChangePlugin onChange={(editorState:EditorState) => handleChange(editorState)} ignoreSelectionChange={true} />
                </div>
            </div>
        </LexicalComposer>
    );
}
