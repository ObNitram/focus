import {useEffect} from 'react';

import styles from "styles/components/editor/editor.module.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';

import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';

import editorConfig from "../../config/editor/editorConfig";

import Toolbar from './toolbar/Toolbar';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const { ipcRenderer } = window.require('electron')

function Placeholder() {
    return <div className={styles.editor_inner_placeholder}>Enter some plain text...</div>;
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
        ipcRenderer.send('open-note', '/home/obnitram/Documents/test/debug.md')

        return () => {
            ipcRenderer.removeAllListeners('note-opened')
        }
    }, [editor])

    function getData() {
        const editorState = editor.getEditorState()
        const json = editorState.toJSON()

        console.log(json);
        console.log(JSON.stringify(json).toString());
        console.log('Hey!');
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
            <div className={styles.editor_container}>
                <Toolbar />

                <div className={styles.editor_inner}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={styles.editor_inner_input} />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <RestoreFromJSONPlugin />
                    <ListPlugin />
                    <CodeHighlightPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
