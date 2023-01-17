import styles from "../../assets/styles/components/editor/editor.module.scss";

import EditorNodes from "../../components/editor/nodes/EditorNodes";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: styles.editor_inner_placeholder,
  paragraph: styles.editor_inner_paragraph,
  quote: styles.editor_inner_quote,
  code: styles.editor_inner_code,
  codeHighlight: {
    atrule: styles.editor_inner_codeHighlight_tokenAttr,
    attr: styles.editor_inner_codeHighlight_tokenAttr,
    boolean: styles.editor_inner_codeHighlight_tokenProperty,
    builtin: styles.editor_inner_codeHighlight_tokenSelector,
    cdata: styles.editor_inner_codeHighlight_tokenComment,
    char: styles.editor_inner_codeHighlight_tokenSelector,
    class: styles.editor_inner_codeHighlight_tokenFunction,
    'class-name': styles.editor_inner_codeHighlight_tokenFunction,
    comment: styles.editor_inner_codeHighlight_tokenComment,
    constant: styles.editor_inner_codeHighlight_tokenProperty,
    deleted: styles.editor_inner_codeHighlight_tokenSelector,
    doctype: styles.editor_inner_codeHighlight_tokenComment,
    entity: styles.editor_inner_codeHighlight_tokenOperator,
    function: styles.editor_inner_codeHighlight_tokenFunction,
    important: styles.editor_inner_codeHighlight_tokenVariable,
    inserted: styles.editor_inner_codeHighlight_tokenSelector,
    keyword: styles.editor_inner_codeHighlight_tokenAttr,
    namespace: styles.editor_inner_codeHighlight_tokenVariable,
    number: styles.editor_inner_codeHighlight_tokenProperty,
    operator: styles.editor_inner_codeHighlight_tokenOperator,
    prolog: styles.editor_inner_codeHighlight_tokenComment,
    property: styles.editor_inner_codeHighlight_tokenProperty,
    punctuation: styles.editor_inner_codeHighlight_tokenPunctuation,
    regex: styles.editor_inner_codeHighlight_tokenVariable,
    selector: styles.editor_inner_codeHighlight_tokenSelector,
    string: styles.editor_inner_codeHighlight_tokenSelector,
    symbol: styles.editor_inner_codeHighlight_tokenProperty,
    tag: styles.editor_inner_codeHighlight_tokenProperty,
    url: styles.editor_inner_codeHighlight_tokenOperator,
    variable: styles.editor_inner_codeHighlight_tokenVariable
  },
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
