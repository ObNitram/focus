enum textFormat {
    normal = 0,
    bold = 1,
    italic = 2
}

enum headingLevel {
    h1 = "h1",
    h2 = "h2",
    h3 = "h3",
    h4 = "h4",
    h5 = "h5",
    h6 = "h6"
}

interface Node {
    children?: Node[];
    direction?: 'ltr' | 'rtl';
    format?: string | number;
    indent?: number;
    type: string;
    version: number;
}

class RootNodeV1 implements Node {
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

class ParagraphNodeV1 implements Node {
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

class LineBreakNodeV1 implements Node {
    type: string;
    version: number;

    constructor() {
        this.type = 'linebreak';
        this.version = 1;
    }
}

class TextNodeV1 implements Node {
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

class HeadingNodeV1 implements Node {
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

class QuoteNodeV1 implements Node {
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

class ListItemNodeV1 implements Node {
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

interface ListNode extends Node {
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

class BulletListNodeV1 implements ListNode {
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

class OrderedListNodeV1 implements ListNode {
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

class CodeNodeV1 implements Node {
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

/**
 * get the number of indents in a line
 * @param line the line to be processed
 * @returns the number of indents
 */
function getNbIndentsInLine(line: string): number {
    let spacesAndTabs = line.match(/^(\t| {1,10})/);
    let indent = 0;
    if (spacesAndTabs) {
        indent = spacesAndTabs[0].length;
    }
    return indent;
}

/**
 * create text nodes, separated by bold, italic and normal text
 * @param text the text to be processed
 * @returns the created text nodes
 */
function proceedText(text: string): Array<TextNodeV1> {
    let textParts = text.trim().split(' ');
    let currentText = '';
    let currentFormat = textFormat.normal;

    let textNodes: Array<TextNodeV1> = [];

    for (let i = 0; i < textParts.length; i++) {
        let textPart = textParts[i];
        let format = textFormat.normal;

        if (textPart.startsWith('**') && textPart.endsWith('**')) {
            format = textFormat.bold;
            textPart = textPart.substring(2, textPart.length - 2);
        } else if (textPart.startsWith('*') && textPart.endsWith('*')) {
            format = textFormat.italic;
            textPart = textPart.substring(1, textPart.length - 1);
        }

        currentText += ' '

        if (format === currentFormat) {
            currentText += textPart;
        } else {
            if (currentText !== '') {
                textNodes.push(new TextNodeV1(currentText, currentFormat));
            }
            currentText = textPart;
            currentFormat = format;
        }
    }

    if (currentText !== '') {
        textNodes.push(new TextNodeV1(currentText, currentFormat));
    }
    return textNodes;
}

/**
 * create a heading node
 * @param text the text to be processed
 * @returns the created heading node
 */
function proceedHeading(text: string): HeadingNodeV1 {
    let tag = null;
    if (text.startsWith('#')) {
        tag = headingLevel.h1;
    } else if (text.startsWith('##')) {
        tag = headingLevel.h2;
    } else if (text.startsWith('###')) {
        tag = headingLevel.h3;
    } else if (text.startsWith('####')) {
        tag = headingLevel.h4;
    } else if (text.startsWith('#####')) {
        tag = headingLevel.h5;
    } else if (text.startsWith('######')) {
        tag = headingLevel.h6;
    }
    else {
        return null;
    }

    let heading = new HeadingNodeV1(tag);
    let textNodes = proceedText(text.substring(tag.length + 1));
    heading.children = textNodes;
    return heading;
}

/**
 * create a quote node
 * @param text the text to be processed
 * @param currentQuote the current quote node
 * @returns the created quote node
 */
function proceedQuote(text: string, currentQuote: QuoteNodeV1 | null = null): QuoteNodeV1 {
    let textNodes = proceedText(text.substring(1));

    let quote = currentQuote;
    if (!quote) {
        quote = new QuoteNodeV1();
    }
    else {
        quote.children.push(new LineBreakNodeV1());
    }
    quote.children = quote.children.concat(textNodes);
    return quote;
}

/**
 * create a list node
 * @param text the text to be processed
 * @param currentList the current list node
 * @param orderedList true if the list is ordered, false if it is unordered
 * @returns the created list node
 */
function proceedList(text: string, currentList: BulletListNodeV1 | null = null, orderedList: boolean = false): ListNode {
    let textNodes = proceedText(text.substring(2));

    let list = currentList;
    if (!list) {
        if (orderedList) {
            list = new OrderedListNodeV1();
        }
        else {
            list = new BulletListNodeV1();
        }
    }
    let listItem = new ListItemNodeV1(list.children.length + 1);
    listItem.children = textNodes;
    list.children.push(listItem);

    return list;
}

/**
 * create a code node
 * @param text the text to be processed
 * @param currentCode the current code node
 * @returns the created code node
 */
function proceedCode(text: string, currentCode: CodeNodeV1 | null = null): CodeNodeV1 {
    let code = currentCode;
    if (!code) {
        code = new CodeNodeV1();
    }
    else {
        code.children.push(new LineBreakNodeV1());
    }
    if (text.startsWith('```')) {
        code.language = text.substring(3);
        text = '';
    }
    if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
    }

    code.children.push(new TextNodeV1(text, textFormat.normal));
    return code;
}

export function convertMarkdownToJSON(markdown: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const parts = markdown.split('\n');
        let jsonObject: any = { root: new RootNodeV1() }

        let currentParagraph: ParagraphNodeV1 = null;
        let currentQuote: QuoteNodeV1 = null;
        let currentList: ListNode = null;
        let currentCode: CodeNodeV1 = null;

        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (part === '') {
                if (currentParagraph) {
                    jsonObject.root.children.push(currentParagraph);
                    currentParagraph = null;
                }
                if (currentQuote) {
                    jsonObject.root.children.push(currentQuote);
                    currentQuote = null;
                }
                if (currentList) {
                    jsonObject.root.children.push(currentList);
                    currentList = null;
                }
            } else {
                let nodeCreated = false;

                if (part.startsWith('#')) {  // heading
                    let heading = proceedHeading(part);
                    if (heading) {
                        if (currentParagraph) {
                            jsonObject.root.children.push(currentParagraph);
                            currentParagraph = null;
                        }

                        jsonObject.root.children.push(heading);
                        nodeCreated = true;
                    }
                }
                else if (part.startsWith('>')) { // quote
                    let quote = proceedQuote(part, currentQuote);
                    if (quote) {
                        currentQuote = quote;
                        nodeCreated = true;
                    }
                }
                else if (part.startsWith('-')) { // unordered list
                    let list = proceedList(part, currentList);
                    if (list) {
                        currentList = list;
                        nodeCreated = true;
                    }
                }
                else if (part.match(/^\d+\./)) { // ordered list
                    let list = proceedList(part, currentList, true);
                    if (list) {
                        currentList = list;
                        nodeCreated = true;
                    }
                }
                else if (part.startsWith('```')) { // code (start or end)
                    if (currentCode) {
                        jsonObject.root.children.push(currentCode);
                        currentCode = null;
                        nodeCreated = true;
                    }
                    else {
                        if (currentParagraph) {
                            jsonObject.root.children.push(currentParagraph);
                            currentParagraph = null;
                        }
                        currentCode = proceedCode(part);
                        if (currentCode) {
                            nodeCreated = true;
                        }
                    }
                }
                else if (currentCode) { // code (middle)
                    currentCode = proceedCode(part, currentCode);
                    nodeCreated = true;
                }
                else if (part.endsWith('```')) { // code (end)
                    if (currentCode) {
                        jsonObject.root.children.push(currentCode);
                        currentCode = null;

                        nodeCreated = true;
                    }
                }


                if (!nodeCreated) { // text
                    let textNode = proceedText(part);
                    if (textNode) {
                        if (!currentParagraph) {
                            let indent = getNbIndentsInLine(part);
                            currentParagraph = new ParagraphNodeV1(indent);
                        }
                        else {
                            currentParagraph.children.push(new LineBreakNodeV1());
                        }
                        currentParagraph.children = currentParagraph.children.concat(textNode);
                    }
                }
            }
        }

        resolve(JSON.stringify(jsonObject));
    });
}
