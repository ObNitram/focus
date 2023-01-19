import { CodeNodeV1, LineBreakNodeV1, ListNode, ParagraphNodeV1, QuoteNodeV1, RootNodeV1 } from './LexicalNodes';
import { getNbIndentsInLine, proceedCode, proceedHeading, proceedList, proceedQuote, proceedText } from './NodesProcessing';

/**
 * Converts a markdown string to a JSON string representing the lexical tree
 * @param markdown The markdown string to convert
 * @returns A promise that resolves to the JSON string
 */
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
                        currentCode.children.pop(); // remove the last line break
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

        // the root node should always have at least one child
        if (jsonObject.root.children.length === 0) {
            jsonObject.root.children.push(new ParagraphNodeV1());
        }
        resolve(JSON.stringify(jsonObject));
    });
}
