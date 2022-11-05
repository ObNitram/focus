import {$getRoot, $getSelection, ParagraphNode} from 'lexical';
import {useEffect} from 'react';

import styles from "styles/editor.module.scss";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

const theme = {
    ltr: "ltr",
    rtl: "rtl",
    placeholder: styles.editorPlaceholder,
    paragraph: styles.editorParagraph,
}

function onChange(editorState) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();
  
      console.log(root, selection);
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
                <PlainTextPlugin
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
        </LexicalComposer>
    );
}