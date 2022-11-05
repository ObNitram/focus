import { EmojiNode } from "../../components/editor/nodes/EmojiNode";

import styles from "../../assets/styles/editor.module.scss";

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

const editorConfig = {
    onError(error) {
      throw error;
    },
    theme,
    nodes: [EmojiNode]
  };
  
  export default editorConfig;