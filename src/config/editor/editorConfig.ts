import styles from "../../assets/styles/editor.module.scss";

import EditorNodes from "../../components/editor/nodes/EditorNodes";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: styles.editorPlaceholder,
  paragraph: styles.editorParagraph,
  quote: styles.editorQuote,
  heading: {
    h1: styles.editorHeading1,
    h2: styles.editorHeading2,
    h3: styles.editorHeading3,
    h4: styles.editorHeading4,
    h5: styles.editorHeading5,
    h6: styles.editorHeading6
  },
  list: {
    ol: styles.editorListOl,
    ul: styles.editorListUl
  },
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
    nodes: [...EditorNodes]
  };

  export default editorConfig;
