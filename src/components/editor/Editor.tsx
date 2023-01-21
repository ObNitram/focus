import {useEffect, useRef, useState} from 'react';

import styles from "styles/components/editor/editor.module.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {AutoLinkPlugin} from '@lexical/react/LexicalAutoLinkPlugin';
import {LinkPlugin as LexicalLinkPlugin} from '@lexical/react/LexicalLinkPlugin';

import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import { MARKDOWN_TRANSFORMERS } from './plugins/MarkdownTransformersPlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LINK_MATCHERS } from './plugins/AutoLinkPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';

import {validateUrl} from './utils/url';

import editorConfig from "../../config/editor/editorConfig";

import Toolbar from './toolbar/Toolbar';
import NoteTitleBar from './NoteTitleBar';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { json } from 'react-router-dom';

const { ipcRenderer } = window.require('electron')

function Placeholder() {
    return <div className={styles.editor_inner_placeholder}>Enter some plain text...</div>;
}

export default function Editor() {
    const refEditorContenair = useRef<HTMLDivElement>(null)

    const [noteName, setNoteName] = useState('Untitled')
    const [isNoteSaved, setIsNoteSaved] = useState(true)

    function OpenedNoteManagementPlugin() {
        const [editor] = useLexicalComposerContext()

        let data: string|null = null

        function setupEvents() {
            ipcRenderer.on('note-opened', (event, noteName, noteData) => {
                setNoteName(noteName)

                const editorState = editor.parseEditorState(noteData)
                editor.setEditorState(editorState)
            })
            ipcRenderer.on('is-note-saved', (event) => {
                ipcRenderer.send('is-note-saved-answer', isNoteSaved)
            })
        }

        useEffect(() => {
            setupEvents()

            document.addEventListener('keydown', handleKeyDown)
            data = JSON.stringify(editor.getEditorState().toJSON())

            const removeTextContentListener = editor.registerTextContentListener((textContent) => {
                setIsNoteSaved(false)
                data = JSON.stringify(editor.getEditorState().toJSON())
            })

            return () => {
                ipcRenderer.removeAllListeners('note-opened')
                ipcRenderer.removeAllListeners('is-note-saved')
                removeTextContentListener()

                document.removeEventListener('keydown', handleKeyDown)
            }
        }, [editor])

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault()
                saveNote()
            }
        }

        function saveNote() {
            if(!data) return
            ipcRenderer.send('save-note', data)
            setIsNoteSaved(true)
        }

        function getData() {
            const editorState = editor.getEditorState()
            const data = editorState.toJSON()
            console.log(data)
        }

        return (
            <div className={styles.buttonGetData}>
                {/* TODO: Remove these debug btns */}
                <button onClick={() => { getData() }} >Get data</button>
                <button onClick={() => { saveNote() }} >Save Note</button>
            </div>
        )
    }

    // useEffect(() => {
    //     if(!refEditorContenair || !refEditorContenair.current) return
    //     console.log(props.widthSideBar)
    //     refEditorContenair.current.style.left = props.widthSideBar
    //     refEditorContenair.current.style.width = 'calc(100% - ' + props.widthSideBar +')'
    //     console.log('calc(100% - ' + props.widthSideBar +')')
    // }, [refEditorContenair, props.widthSideBar])

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className={styles.editor_container} ref={refEditorContenair}>
                <NoteTitleBar noteName={noteName} noteSaved={isNoteSaved} />
                <Toolbar />

                <div className={styles.editor_inner}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={styles.editor_inner_input} />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OpenedNoteManagementPlugin />
                    <ListPlugin />
                    <CodeHighlightPlugin />
                    <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
                    <AutoLinkPlugin matchers={LINK_MATCHERS} />
                    <ClickableLinkPlugin />
                    <LexicalLinkPlugin validateUrl={validateUrl} />
                </div>
            </div>
        </LexicalComposer>
    );
}
