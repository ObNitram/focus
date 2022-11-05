import {$getRoot, $getSelection, ParagraphNode} from 'lexical';
import {useEffect} from 'react';

import styles from "styles/editor.module.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import Toolbar from './Toolbar';

const theme = {
    namespace: "my-editor",
    ltr: "ltr",
    rtl: "rtl",
    placeholder: styles.editorPlaceholder,
    paragraph: styles.editorParagraph,
    text: {
        bold: styles.editorTextBold,
        italic: styles.editorTextItalic,
        underline: styles.editorTextUnderline
    }
}

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

function onError(error) {
    console.error(error);
}

function Placeholder() {
    return <div className={styles.editorPlaceholder}>Enter some plain text...</div>;
  }

export default function Editor() {
    const initialConfig = {
        theme,
        onError,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
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
                </div>
            </div>
        </LexicalComposer>
    );
}