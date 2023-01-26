import { initConfigEditorExtraFeature, saveEditorExtraFeature } from "../ManageConfig"
import { Node } from "../../model/LexicalNodes"
import { editorExtraFeatures } from "../../model/EditorExtraFeatures"

function exploreEachNodeRecursively(notePath: string, nodePath: string, element: Node) {
    let extraFeature = editorExtraFeatures[element.type]
    if (extraFeature) {
        extraFeature.forEach((feature: string) => {
            saveEditorExtraFeature(notePath, nodePath, feature, element[feature])
        })
    }
    if (element.children) {
        element.children.forEach((child: Node) => {
            exploreEachNodeRecursively(notePath, nodePath + '.children[' + element.children.indexOf(child) + ']', child)
        })
    }
}

export function saveEditorExtraFeatures(notePath: string, json: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!initConfigEditorExtraFeature()) {
            reject('Failed to init config editor extra feature')
        }
        try {
            let jsonObject = JSON.parse(json)
            exploreEachNodeRecursively(notePath, 'root', jsonObject.root)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}
