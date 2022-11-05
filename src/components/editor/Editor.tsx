import {$getRoot, $getSelection, ParagraphNode} from 'lexical';
import {useEffect} from 'react';

import styles from "styles/editor.module.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import EmojisPlugin from "./plugins/EmojisPlugin";

import editorConfig from "../..//config/editor/editorConfig";

import Toolbar from './Toolbar';

function onChange(editorState) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();

    });
}

function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();
  
    useEffect(() => {
      // Focus the editor when the effect fires!
      editor.focus();
    }, [editor]);
  
    return null;
}

function Placeholder() {
    return <div className={styles.editorPlaceholder}>Enter some plain text...</div>;
  }

export default function Editor() {

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className={styles.editorContainer}>
                <Toolbar />

                <div className={styles.editorInner}>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className={styles.editorInput}>
                                <ParagraphNode className={styles.editorParagraph} />
                            </ContentEditable>
                        }
                        placeholder={<Placeholder />}
                    />
                    <OnChangePlugin onChange={onChange} />
                    <HistoryPlugin />
                    <MyCustomAutoFocusPlugin />
                    <EmojisPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}