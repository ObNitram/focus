import {useEffect} from 'react';

import styles from "styles/editor.module.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import editorConfig from "../../config/editor/editorConfig";

import Toolbar from './Toolbar';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const { ipcRenderer } = window.require('electron')

function Placeholder() {
    return <div className={styles.editorPlaceholder}>Enter some plain text...</div>;
}

function RestoreFromJSONPlugin() {
    const [editor] = useLexicalComposerContext()

    function setupEvents() {
        ipcRenderer.on('note-opened', (event, noteData) => {
            console.log(noteData)

            const editorState = editor.parseEditorState(noteData)
            editor.setEditorState(editorState)
        })
    }

    useEffect(() => {
        setupEvents()
        ipcRenderer.send('open-note', '/home/logan/Documents/myVault/aNote.md')

        return () => {
            ipcRenderer.removeAllListeners('note-opened')
        }
    }, [editor])

    function getData() {
        const editorState = editor.getEditorState()
        const json = editorState.toJSON()

        console.log(json)
        console.log('Hey!')
    }

    return (
        <div>
            <button onClick={() => { getData() }} >Get Data</button>
        </div>
    )
}

export default function Editor() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className={styles.editorContainer}>
                <Toolbar />

                <div className={styles.editorInner}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={styles.editorInput} />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <RestoreFromJSONPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
