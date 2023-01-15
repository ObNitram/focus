import styles from "../../assets/styles/components/editor/editor.module.scss";

import EditorNodes from "../../components/editor/nodes/EditorNodes";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: styles.editor_inner_placeholder,
  paragraph: styles.editor_inner_paragraph,
  quote: styles.editorQuote,
  heading: {
    h1: styles.editor_inner_heading1,
    h2: styles.editor_inner_heading2,
    h3: styles.editor_inner_heading3,
    h4: styles.editor_inner_heading4,
    h5: styles.editor_inner_heading5,
    h6: styles.editor_inner_heading6
  },
  list: {
    ol: styles.editor_inner_list_ol,
    ul: styles.editor_inner_list_ul
  },
  text: {
      bold: styles.editor_inner_text_bold,
      italic: styles.editor_inner_text_italic,
      underline: styles.editor_inner_text_underline
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
