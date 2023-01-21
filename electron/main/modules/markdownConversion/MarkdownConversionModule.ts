import { CodeNodeV1, LineBreakNodeV1, ListNode, ParagraphNodeV1, QuoteNodeV1, RootNodeV1, textFormat } from './LexicalNodes';
import * as processNodesToJSON from './nodesProcessing/NodesProcessingMarkdownToJSON';
import * as processNodesToMarkdown from './nodesProcessing/NodesProcessingJSONToMarkdown';

import * as printMessage from '../../modules/OutputModule'

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
                    let heading = processNodesToJSON.proceedHeading(part);
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
                    let quote = processNodesToJSON.proceedQuote(part, currentQuote);
                    if (quote) {
                        currentQuote = quote;
                        nodeCreated = true;
                    }
                }
                else if (part.startsWith('-')) { // unordered list
                    let list = processNodesToJSON.proceedList(part, currentList);
                    if (list) {
                        currentList = list;
                        nodeCreated = true;
                    }
                }
                else if (part.match(/^\d+\./)) { // ordered list
                    let list = processNodesToJSON.proceedList(part, currentList, true);
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
                        currentCode = processNodesToJSON.proceedCode(part);
                        if (currentCode) {
                            nodeCreated = true;
                        }
                    }
                }
                else if (currentCode) { // code (middle)
                    currentCode = processNodesToJSON.proceedCode(part, currentCode);
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
                    let textNode = processNodesToJSON.proceedText(part);
                    if (textNode) {
                        if (!currentParagraph) {
                            let indent = processNodesToJSON.getNbIndentsInLine(part);
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

export function convertJSONToMarkdown(json: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let jsonObject = JSON.parse(json);
        let markdown = '';

        console.log(jsonObject.root.children);

        for (let i = 0; i < jsonObject.root.children.length; i++) {
            let child = jsonObject.root.children[i];

            try {
                switch (child.type) {
                    case 'heading':
                        markdown += processNodesToMarkdown.proceedHeading(child);
                        break;
                    case 'list':
                        markdown += processNodesToMarkdown.proceedList(child);
                        break;
                    case 'quote':
                        markdown += processNodesToMarkdown.proceedQuote(child);
                        break;
                    case 'paragraph':
                        markdown += processNodesToMarkdown.proceedParagraph(child);
                        break;
                    case 'code':
                        markdown += processNodesToMarkdown.proceedCode(child);
                        break;
                }
            }
            catch (e) {
                printMessage.printError('Error while converting JSON to Markdown: ' + e);
            }
        }

        resolve(markdown);
    });
}
