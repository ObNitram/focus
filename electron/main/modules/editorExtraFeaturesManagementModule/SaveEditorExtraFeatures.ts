import * as ManageConfig from "../ManageConfig"
import { Node, TextNodeV1 } from "../../model/LexicalNodes"
import { editorExtraFeatures } from "../../model/EditorExtraFeatures"

export interface NodesSave {
    nodePath: string
    key: string
    value: any,
}

function getNodesToSaveRecursively(node: Node, nodesSave: NodesSave[], nodePath: string): NodesSave[] {
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i]
            let childPath = nodePath + '.children[' + i + ']'

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
    if (editorExtraFeatures[node.type] === undefined) {
        return nodesSave
    }
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
