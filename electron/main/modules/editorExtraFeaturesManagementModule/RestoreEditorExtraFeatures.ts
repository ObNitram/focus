import { extraFeaturesExtistForNote, getEditorExtraFeatures } from "../ManageConfig"
import * as printMessage from '../OutputModule'
import { TextNodeV1, textFormat } from "../../model/LexicalNodes"
import { NodesSave } from "./SaveEditorExtraFeatures"

function splitTextAtNth(text: string, delimiter: string, n: number): string[] {
    let index = -1
    let currOccurrence = 0
    while (currOccurrence <= n) {
        index = text.indexOf(delimiter, index + 1)
        currOccurrence++
    }

    let textBefore = text.substring(0, index)
    let textAfter = text.substring(index + delimiter.length)

    return [textBefore, textAfter]
}


function restoreExtraFeaturesRecursively(jsonObject: any, nodesSave: NodesSave[], nodePath: string): any {
    for (let nodeToRestore of nodesSave) {
        if (jsonObject.type === 'paragraph') {
            const regex = /\.children\[([a-zA-Z ]+)\]\[(\d+)\]$/;
            const result = regex.exec(nodeToRestore.nodePath)

            if (result) {
                const [, text, i] = result

                let currOccurrence = 0

                if (!jsonObject.children) {
                    continue
                }
                for (let j = 0; j < jsonObject.children.length; j++) {
                    if (jsonObject.children[j].type === 'text') {
                        let textNode = jsonObject.children[j] as TextNodeV1

                        if (textNode.text.includes(text)) {

                            if (currOccurrence === parseInt(i) || jsonObject.children.length < parseInt(i)+1) {
                                // we must break the node in three parts
                                let textParts = splitTextAtNth(textNode.text, text, parseInt(i))

                                let nodeBefore: TextNodeV1 = null
                                let nodeAfter: TextNodeV1 = null

                                if (textParts[0].trim() !== '') {
                                    nodeBefore = new TextNodeV1(textParts[0], textFormat.normal)
                                }
                                let currNode: TextNodeV1 = new TextNodeV1(text, nodeToRestore.key === 'format' ? nodeToRestore.value : textFormat.normal)

                                if (textParts[1].trim() !== '') {
                                    nodeAfter = new TextNodeV1(textParts[1], textFormat.normal)
                                }

                                if (nodeBefore) {
                                    jsonObject.children.splice(j, 0, nodeBefore)
                                    j++
                                }
                                jsonObject.children.splice(j, 1, currNode)
                                j++
                                if (nodeAfter) {
                                    jsonObject.children.splice(j, 0, nodeAfter)
                                    j++
                                }
                                break
                            }
                            currOccurrence++
                        }
                    }
                }
            }
            else if (nodeToRestore.nodePath === nodePath) {
                jsonObject[nodeToRestore.key] = nodeToRestore.value
                nodesSave.shift()
            }
        }
        else if (nodeToRestore.nodePath === nodePath) {
            jsonObject[nodeToRestore.key] = nodeToRestore.value
            nodesSave.shift()
        }
    }
    if (jsonObject.children && jsonObject.type !== 'paragraph') {
        for (let i = 0; i < jsonObject.children.length; i++) {
            let child = jsonObject.children[i]
            let childPath = nodePath + '.children[' + i + ']'
            restoreExtraFeaturesRecursively(child, nodesSave, childPath)
        }
    }
    return jsonObject
}

export async function restoreEditorExtraFeatures(notePath: string, json: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (extraFeaturesExtistForNote(notePath)) {
            let jsonObject = JSON.parse(json)

            getEditorExtraFeatures(notePath).then((nodesSave: NodesSave[]) => {
                if (nodesSave.length > 0) {
                    jsonObject.root = restoreExtraFeaturesRecursively(jsonObject.root, nodesSave, 'root')
                }
                resolve(JSON.stringify(jsonObject))
            })
                .catch((err: any) => {
                    printMessage.printError(err)
                    reject(err)
                })
        } else {
            reject('No editor extra features to restore !')
        }
    })
}
