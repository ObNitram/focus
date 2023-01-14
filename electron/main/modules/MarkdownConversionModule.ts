enum textFormat {
    normal = 0,
    bold = 1,
    italic = 2
}

interface Node {
    children?: Node[];
    direction?: 'ltr' | 'rtl';
    format: string | number;
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

    constructor() {
        this.children = [];
        this.direction = 'ltr';
        this.format = '';
        this.indent = 0;
        this.type = 'paragraph';
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

/**
 * create text nodes, separated by bold, italic and normal text
 * @param text the text to be processed
 * @param currentParagraph the current paragraph node
 */
function proceedText(text: string, currentParagraph: Node = new ParagraphNodeV1()) {
    let textParts = text.split(' ');
    let currentText = '';
    let currentFormat = textFormat.normal;

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
                currentParagraph.children.push(new TextNodeV1(currentText, currentFormat));
            }
            currentText = textPart;
            currentFormat = format;
        }
    }

    if (currentText !== '') {
        currentParagraph.children.push(new TextNodeV1(currentText, currentFormat));
    }
}


export function convertMarkdownToJSON(markdown: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const parts = markdown.split('\n');
        let jsonObject: any = { root: new RootNodeV1() }
        let currentParagraph: Node = new ParagraphNodeV1();

        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (part === '') {
                jsonObject.root.children.push(currentParagraph);
                currentParagraph = new ParagraphNodeV1();
            } else {
                switch (part) {
                    // text
                    default:
                        proceedText(part, currentParagraph);
                }
            }
        }

        resolve(JSON.stringify(jsonObject));
    });
}
