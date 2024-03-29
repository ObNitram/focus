import { HeadingNodeV1, Node, textFormat, TextNodeV1, ListNode, QuoteNodeV1, ParagraphNodeV1, CodeNodeV1, LinkNodeV1 } from '../../../model/LexicalNodes';

function getHeadingLevelNumberFromString(headingLevel: string): number {
    switch (headingLevel) {
        case 'h1':
            return 1;
        case 'h2':
            return 2;
        case 'h3':
            return 3;
        case 'h4':
            return 4;
        case 'h5':
            return 5;
        case 'h6':
            return 6;
        default:
            throw new Error('The heading level is not between 1 and 6.');
    }
}

function addIndentation(indentationLevel: number): string {
    let indentation = '';
    for (let i = 0; i < indentationLevel; i++) {
        indentation += ' ';
    }
    return indentation;
}

/**
 * create a markdown heading from a heading node
 * @param headingNode the heading node to be processed
 * @returns the created markdown heading
 * @throws an error if the node is not a heading node
 * @throws an error if the heading level is not between 1 and 6
 */
export function proceedHeading(headingNode: HeadingNodeV1): string {
    if (headingNode.type !== 'heading') {
        throw new Error('The node is not a heading node.');
    }
    let headingText = addIndentation(headingNode.indent);
    for (let i = 0; i < headingNode.children.length; i++) {
        headingText += proceedText(headingNode.children[i]);
    }
    if (!headingText.trim()) {
        return '';
    }
    return '#'.repeat(getHeadingLevelNumberFromString(headingNode.tag)) + ' ' + headingText + '\n\n';
}

/**
 * proceed a text node and return the markdown text
 * @param textNode the text node to be processed
 * @returns the markdown text
 */
export function proceedText(node: Node): string {
    console.log(node);
    if (node.type === 'linebreak') {
        return '\n';
    }
    if (node.type === 'text' || node.type === 'code-highlight') {
        let textNode = node as TextNodeV1;
        switch (textNode.format) {
            case textFormat.boldItalic:
                return '***' + textNode.text + '***';
            case textFormat.bold:
                return '**' + textNode.text + '**';
            case textFormat.italic:
                return '*' + textNode.text + '*';
            case textFormat.normal:
                return textNode.text;
            default:
                return textNode.text;
        }
    }
    else if (node.type === 'link' || node.type === 'autolink') {
        let linkNode = node as LinkNodeV1;
        let linkText = '';
        for (let i = 0; i < linkNode.children.length; i++) {
            linkText += proceedText(linkNode.children[i]);
        }
        return '[' + linkText + '](' + linkNode.url + ')';
    }
    else {
        throw new Error('The node is not a text node.');
    }
}

/**
 * create a markdown list from a list node
 * @param listNode the list node to be processed
 * @returns the created markdown list
 * @throws an error if the node is not a list node
 * @throws an error if the list type is not bullet or number
 */
export function proceedList(listNode: ListNode): string {
    if (listNode.type !== 'list') {
        throw new Error('The node is not a list node.');
    }
    if (listNode.listType !== 'bullet' && listNode.listType !== 'number') {
        throw new Error('The list type is not bullet or number.');
    }

    let markdownList = addIndentation(listNode.indent);

    for (let i = 0; i < listNode.children.length; i++) {
        markdownList += listNode.listType === 'bullet' ? '- ' : (i + 1) + '. ';
        for (let j = 0; j < listNode.children[i].children.length; j++) {
            markdownList += proceedText(listNode.children[i].children[j]);
        }
        markdownList += '\n';
    }
    return markdownList + '\n';
}

/**
 * create a markdown quote from a quote node
 * @param quoteNode the quote node to be processed
 * @returns the created markdown quote
 * @throws an error if the node is not a quote node
 */
export function proceedQuote(quoteNode: QuoteNodeV1): string {
    if (quoteNode.type !== 'quote') {
        throw new Error('The node is not a quote node.');
    }
    let quoteText = addIndentation(quoteNode.indent);
    for (let i = 0; i < quoteNode.children.length; i++) {
        let quoteTextTemp = proceedText(quoteNode.children[i]);
        if (quoteTextTemp.trim()) {
            if (i > 0) {
                quoteText += '\n';
            }
            quoteText += '> ' + proceedText(quoteNode.children[i]);
        }
    }
    return quoteText + '\n\n';
}

/**
 * create a markdown paragraph from a paragraph node
 * @param paragraphNode the paragraph node to be processed
 * @returns the created markdown paragraph
 * @throws an error if the node is not a paragraph node
 */
export function proceedParagraph(paragraphNode: ParagraphNodeV1): string {
    if (paragraphNode.type !== 'paragraph') {
        throw new Error('The node is not a paragraph node.');
    }
    let paragraphText = addIndentation(paragraphNode.indent);

    for (let j = 0; j < paragraphNode.children.length; j++) {
        paragraphText += proceedText(paragraphNode.children[j]);
    }
    return paragraphText + '\n\n';
}

/**
 * create a markdown code block from a code block node
 * @param codeBlockNode the code block node to be processed
 * @returns the created markdown code block
 * @throws an error if the node is not a code block node
 */
export function proceedCode(codeBlockNode: CodeNodeV1): string {
    if (codeBlockNode.type !== 'code') {
        throw new Error('The node is not a code block node.');
    }
    let codeBlockText = '```' + codeBlockNode.language + '\n';
    for (let i = 0; i < codeBlockNode.children.length; i++) {
        codeBlockText += proceedText(codeBlockNode.children[i]);
    }
    codeBlockText += '\n```';
    return codeBlockText + '\n\n';
}
