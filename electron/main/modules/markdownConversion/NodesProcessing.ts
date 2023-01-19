import { BulletListNodeV1, CodeNodeV1, headingLevel, HeadingNodeV1, LineBreakNodeV1, ListItemNodeV1, ListNode, OrderedListNodeV1, QuoteNodeV1, textFormat, TextNodeV1 } from './LexicalNodes';

/**
 * get the number of indents in a line
 * @param line the line to be processed
 * @returns the number of indents
 */
export function getNbIndentsInLine(line: string): number {
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
export function proceedText(text: string): Array<TextNodeV1> {
    let textNodes: Array<TextNodeV1> = [];
    let textParts = text.split(/(\*\*|\*)/);
    let currentText = '';
    let currentFormat: textFormat = textFormat.normal;

    for (let i = 0; i < textParts.length; i++) {
        let part = textParts[i];
        if (part === '**') {
            if (currentText !== '') {
                textNodes.push(new TextNodeV1(currentText, currentFormat));
                currentText = '';
            }
            if (currentFormat === textFormat.normal) {
                currentFormat = textFormat.bold;
            }
            else {
                currentFormat = textFormat.normal;
            }
        }
        else if (part === '*') {
            if (currentText !== '') {
                textNodes.push(new TextNodeV1(currentText, currentFormat));
                currentText = '';
            }
            if (currentFormat === textFormat.normal) {
                currentFormat = textFormat.italic;
            }
            else {
                currentFormat = textFormat.normal;
            }
        }
        else {
            currentText += part;
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
 * @returns the created heading node or null if the text is not a heading
 */
export function proceedHeading(text: string): HeadingNodeV1 | null {
    let tag: headingLevel | null = null;
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
    let textNodes = proceedText(text.substring(tag.length));
    heading.children = textNodes;
    return heading;
}

/**
 * create a quote node
 * @param text the text to be processed
 * @param currentQuote the current quote node
 * @returns the created quote node
 */
export function proceedQuote(text: string, currentQuote: QuoteNodeV1 | null = null): QuoteNodeV1 {
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
export function proceedList(text: string, currentList: BulletListNodeV1 | null = null, orderedList: boolean = false): ListNode {
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
export function proceedCode(text: string, currentCode: CodeNodeV1 | null = null): CodeNodeV1 {
    let code = currentCode;

    if (!code) {
        code = new CodeNodeV1();
    }
    if (text.startsWith('```')) {
        if (!currentCode) {
            code.language = text.substring(3);
            text = '';
        }
    }
    if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
    }

    if (text) {
        code.children.push(new TextNodeV1(text, textFormat.normal));
            code.children.push(new LineBreakNodeV1());
    }
    return code;
}
