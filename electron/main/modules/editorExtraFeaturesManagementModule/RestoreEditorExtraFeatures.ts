import { editorExtraFeatures } from "../../model/EditorExtraFeatures"
import { extraFeaturesExtistForNote, getEditorExtraFeature, initConfigEditorExtraFeature } from "../ManageConfig"
import * as printMessage from '../OutputModule'
import { Node } from "../../model/LexicalNodes"

function exploreEachNodeRecursively(jsonObject: Node, element: Node, notePath: string, nodePath: string): Node {
    if (editorExtraFeatures[element.type]) {
        const extraFeature = editorExtraFeatures[element.type]
        extraFeature.forEach((feature: string) => {
            const value = getEditorExtraFeature(notePath, nodePath, feature)
            if (value) {
                element[feature] = value
                printMessage.printOK('Editor extra feature restored: ' + feature + ' = ' + value)
            }
        })
    }
    if (element.children) {
        element.children.forEach((child: Node) => {
            jsonObject = exploreEachNodeRecursively(jsonObject, child, notePath, nodePath + '.children[' + element.children.indexOf(child) + ']')
        })
    }
    return jsonObject
}

export async function restoreEditorExtraFeatures(notePath: string, json: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!initConfigEditorExtraFeature()) {
            reject('Failed to init config editor extra feature')
        }
        if (extraFeaturesExtistForNote(notePath)) {
            let jsonObject = JSON.parse(json)
            jsonObject = exploreEachNodeRecursively(jsonObject, jsonObject.root, notePath, 'root')

            resolve(JSON.stringify(jsonObject))
        } else {
            reject('No editor extra features to restore !')
        }
    })
}
