import {useEffect, useRef} from 'react';

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
        <div className={styles.buttonGetData}>
            <button onClick={() => { getData() }} >Get Data</button>
        </div>
    )
}

export default function Editor(props:any) {
    const refEditorContenair = useRef<HTMLDivElement>(null)

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
                    <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
                    <AutoLinkPlugin matchers={LINK_MATCHERS} />
                    <ClickableLinkPlugin />
                    <LexicalLinkPlugin validateUrl={validateUrl} />
                </div>
            </div>
        </LexicalComposer>
    );
}
