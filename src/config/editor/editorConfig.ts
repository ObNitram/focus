import styles from "../../assets/styles/components/editor/editor.module.scss";

import EditorNodes from "../../components/editor/nodes/EditorNodes";

export const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: `${styles.editor_inner_placeholder}`,
  paragraph: `${styles.editor_inner_paragraph} editor_paragraph`,
  quote: 'editor_quote',
  code: `${styles.editor_inner_code} editor_code`,
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
    h1: 'editor_h1',
    h2: 'editor_h2',
    h3: 'editor_h3',
    h4: 'editor_h4',
    h5: 'editor_h5',
    h6: 'editor_h6'
  },
  list: {
    ol: 'editor_ol',
    ul: 'editor_ul'
  },
  text: {
    bold: `editor_bold ${styles.editor_inner_bold}`,
    italic: `editor_italic ${styles.editor_inner_italic}`,
    underline: `editor_underline ${styles.editor_inner_underline}`
  },
  link: 'editor_link'
}

const editorConfig = {
  onError(error: any) {
    throw error;
  },
  namespace: "my-editor",
  theme,
  nodes: [...EditorNodes],
  editorState : ''
};

export default editorConfig;
