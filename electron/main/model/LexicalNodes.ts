/**
 * @description The different types of nodes supported by the editor
 */


/**
 * @description The different formats of text supported by the editor and the Markdown language
 */
export enum textFormat {
    normal = 0,
    bold = 1,
    italic = 2,
    boldItalic = 3
}

/**
 * @description The different types of heading supported by the editor and the Markdown language
 */
export enum headingLevel {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6"
}

/**
 * @description the level of heading as a number
 */
export enum headingLevelNumber {
    h1 = 1,
    h2 = 2,
    h3 = 3,
    h4 = 4,
    h5 = 5,
    h6 = 6
}

/**
 * @description The most general type of node
 */
export interface Node {
    children?: Node[];
    direction?: 'ltr' | 'rtl';
    format?: string | number;
    indent?: number;
    type: string;
    version: number;
}

/**
 * @description The root node in a lexical tree.
 * It should be only found once, at the top of the tree.
 */
export class RootNodeV1 implements Node {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    type: string;
    version: number;

    constructor() {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.type = 'root';
        this.version = 1;
    }
}

/**
 * @description A paragraph node
 * It can contains text nodes, line break nodes, link nodes
 */
export class ParagraphNodeV1 implements Node {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    type: string;
    version: number;

    constructor(indent: number = 0) {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = indent;
        this.type = 'paragraph';
        this.version = 1;
    }
}

/**
 * @description A line break node
 * Used to separate two lines of text in a paragraph, a quote, a code block, etc.
 */
export class LineBreakNodeV1 implements Node {
    type: string;
    version: number;

    constructor() {
        this.type = 'linebreak';
        this.version = 1;
    }
}

export class TextNodeV1 implements Node {
    detail: number;
    format: textFormat;
    mode: string;
    style: string;
    text: string;
    type: string;
    version: number;

    constructor(text: string, format: textFormat = textFormat.normal) {
        this.detail = 0;
        this.format = format;
        this.mode = 'normal';
        this.style = '';
        this.text = text;
        this.type = 'text';
        this.version = 1;
    }
}

/**
 * @description A Link node
 */
export class LinkNodeV1 implements Node {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    type: string;
    version: number;
    rel: string|null;
    target: string|null;
    url: string|null;

    constructor(url: string|null, target: string|null = null, rel: string|null = null) {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.type = 'link';
        this.version = 1;
        this.rel = rel;
        this.target = target;
        this.url = url;
    }
}

export class HeadingNodeV1 implements Node {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    tag: headingLevel;
    type: string;
    version: number;

    constructor(tag: headingLevel) {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.tag = tag;
        this.type = 'heading';
        this.version = 1;
    }
}

export class QuoteNodeV1 implements Node {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    type: string;
    version: number;

    constructor() {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.type = 'quote';
        this.version = 1;
    }
}

export class ListItemNodeV1 implements Node {
    checked?: boolean;
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    type: string;
    value: number;
    version: number;

    constructor(value: number) {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.type = 'listitem';
        this.value = value;
        this.version = 1;
    }
}

export interface ListNode extends Node {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    listType: string;
    start: number;
    tag: string;
    type: string;
    version: number;
}

export class BulletListNodeV1 implements ListNode {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    listType: string;
    start: number;
    tag: string;
    type: string;
    version: number;

    constructor() {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.listType = 'bullet';
        this.start = 1;
        this.tag = 'ul';
        this.type = 'list';
        this.version = 1;
    }
}

export class OrderedListNodeV1 implements ListNode {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    listType: string;
    start: number;
    tag: string;
    type: string;
    version: number;

    constructor() {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.listType = 'number';
        this.start = 1;
        this.tag = 'ol';
        this.type = 'list';
        this.version = 1;
    }
}

export class CodeNodeV1 implements Node {
    children: Node[];
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    language?: string;
    type: string;
    version: number;

    constructor() {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.type = 'code';
        this.version = 1;
    }
}
