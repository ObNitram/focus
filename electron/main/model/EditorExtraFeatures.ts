/**
 * @description Extra features for editor
 * Basically, these are all the features supported by the editor that are not supported by the Markdown language
 * The key is the type of the node, and the value is the feature name
 * @example 'paragraph': ['format'] means that the paragraph node supports the format feature
 */
export const editorExtraFeatures = {
    'paragraph': ['format'],
    'text': ['format'],
    'heading': ['format'],
}
