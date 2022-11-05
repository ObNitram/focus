import { EmojiNode } from "../../components/editor/nodes/EmojiNode";

import styles from "../../assets/styles/editor.module.scss";

const theme = {
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

const editorConfig = {
    onError(error: any) {
      throw error;
    },
    namespace: "my-editor",
    theme,
    nodes: [EmojiNode]
  };
  
  export default editorConfig;