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
    atrule: 'editor_code_attr',
    attr: 'editor_code_attr',
    boolean: 'editor_code_property',
    builtin: 'editor_code_selector',
    cdata: 'editor_code_comment',
    char: 'editor_code_selector',
    class: 'editor_code_function',
    'class-name': 'editor_code_function',
    comment: 'editor_code_comment',
    constant: 'editor_code_property',
    deleted: 'editor_code_selector',
    doctype: 'editor_code_comment',
    entity: 'editor_code_operator',
    function: 'editor_code_function',
    important: 'editor_code_variable',
    inserted: 'editor_code_selector',
    keyword: 'editor_code_attr',
    namespace: 'editor_code_variable',
    number: 'editor_code_property',
    operator: 'editor_code_operator',
    prolog: 'editor_code_comment',
    property: 'editor_code_property',
    punctuation: 'editor_code_punctuation',
    regex: 'editor_code_variable',
    selector: 'editor_code_selector',
    string: 'editor_code_selector',
    symbol: 'editor_code_property',
    tag: 'editor_code_property',
    url: 'editor_code_operator',
    variable: 'editor_code_variable'
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
