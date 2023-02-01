import * as ManageConfig from "../ManageConfig"
import { Node } from "../../model/LexicalNodes"
import { editorExtraFeatures } from "../../model/EditorExtraFeatures"

export interface NodesSave {
    nodePath: string
    key: string
    value: any
}

function getNodesToSaveRecursively(node: Node, nodesSave: NodesSave[], nodePath: string): NodesSave[] {
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i]
            let childPath = nodePath + '.children[' + i + ']'
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
        if (!ManageConfig.initConfigEditorExtraFeature()) {
            reject('Failed to init config editor extra feature')
        }
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
