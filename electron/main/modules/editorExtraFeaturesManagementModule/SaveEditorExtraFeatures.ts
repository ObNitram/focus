/**
 * @file SaveEditorExtraFeatures.ts
 * @description Save extra features not supported by the Markdown language in a JSON object
 */

import * as ManageConfig from "../ManageConfig"
import { Node, TextNodeV1 } from "../../model/LexicalNodes"
import { editorExtraFeatures } from "../../model/EditorExtraFeatures"

/**
 * @description A node to save
 * @property nodePath The path of the node to save
 * @property key The key of the node to save
 * @property value The value of the node to save
 */
export interface NodesSave {
    nodePath: string
    key: string
    value: any,
}

/**
 * @description Get the nodes to save recursively
 * @param node The node from which to get the nodes to save
 * @param nodesSave The nodes to save
 * @param nodePath The path of the node
 * @returns The nodes to save in an array
 */
function getNodesToSaveRecursively(node: Node, nodesSave: NodesSave[], nodePath: string): NodesSave[] {
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i]
            let childPath = nodePath + '.children[' + i + ']'

            // for text nodes, we need to get the occurrence of the text in the paragraph
            if (node.type === 'paragraph' && child.type === 'text') {
                let textNode = child as TextNodeV1
                if (textNode.text === '') {
                    continue
                }

                let nbTotOccurrences = 0
                for (let j = 0; j < node.children.length; j++) {
                    if (node.children[j].type === 'text') {
                        let textNode2 = node.children[j] as TextNodeV1
                        if (textNode2.text.includes(textNode.text)) {
                            nbTotOccurrences++
                        }
                    }
                }

                let currOccurrence = nbTotOccurrences
                for (let j = i; j < node.children.length; j++) {
                    if (node.children[j].type === 'text') {
                        let textNode2 = node.children[j] as TextNodeV1
                        if (textNode2.text.includes(textNode.text)) {
                            currOccurrence--
                        }
                    }
                }
                childPath = nodePath + '.children[' + textNode.text + '][' + currOccurrence + ']'
            }
            nodesSave = getNodesToSaveRecursively(child, nodesSave, childPath)
        }
    }
    // If the node type is not supported, return the nodes to save
    if (editorExtraFeatures[node.type] === undefined) {
        return nodesSave
    }

    // Save the extra features of the node
    for (let item=0; item <= editorExtraFeatures[node.type].length; item++) {
        let value = node[editorExtraFeatures[node.type][item]]
        if (value !== undefined) {
            nodesSave.push({
                nodePath: nodePath,
                key: editorExtraFeatures[node.type][item],
                value: value
            })
        }
    }
    return nodesSave
}

/**
 * @description Save extra features not supported by the Markdown language in a JSON object
 * @param notePath The path of the note to save the extra features in
 * @param json The JSON string to save the extra features in
 * @returns A promise that resolves when the extra features are saved
 */
export function saveEditorExtraFeatures(notePath: string, json: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            let jsonObject = JSON.parse(json)
            let nodesSave: NodesSave[] = getNodesToSaveRecursively(jsonObject.root, [], 'root')
            console.log('nodesSave', nodesSave)
            ManageConfig.saveEditorExtraFeatures(notePath, nodesSave)

            resolve()
        } catch (error) {
            reject(error)
        }
    })
}
