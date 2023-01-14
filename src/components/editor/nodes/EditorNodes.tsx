import { Klass, LexicalNode } from "lexical";

import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {ListItemNode, ListNode} from '@lexical/list';
import {CodeHighlightNode, CodeNode} from '@lexical/code';

const EditorNodes: Array<Klass<LexicalNode>> = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
];

export default EditorNodes;
