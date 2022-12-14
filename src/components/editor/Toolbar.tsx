import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState, useEffect, useCallback } from "react";

import { 
    $getSelection, 
    NodeSelection,
    RangeSelection,
    GridSelection,
    FORMAT_TEXT_COMMAND, 
    SELECTION_CHANGE_COMMAND } from "lexical";
import { mergeRegister } from "@lexical/utils";

import styles from "styles/editor.toolbar.module.scss";

const LowPriority = 1;

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection : null | RangeSelection | NodeSelection | GridSelection = $getSelection();

        const temp: RangeSelection = selection as RangeSelection;

        if (temp) {
            setIsBold(temp.hasFormat("bold"));
            setIsItalic(temp.hasFormat("italic"));
            setIsUnderline(temp.hasFormat("underline"));
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
              editorState.read(() => {
                updateToolbar();
              });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                  updateToolbar();
                  return false;
                },
                LowPriority
              )
            );
    }, [editor, updateToolbar]);

    return (
        <div className={styles.editorToolbar}>
            <button onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");}}
                className={styles.toolbarItem + " " + styles.spaced + " " + (isBold ? styles.active : "")}
                aria-label="Format Bold">B
            </button>

            <button onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");}}
                className={styles.toolbarItem + " " + styles.spaced + " " + (isItalic ? styles.active : "")}
                aria-label="Format Italics">I
            </button>

            <button onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");}}
                className={styles.toolbarItem + " " + styles.spaced + " " + (isUnderline ? styles.active : "")}
                aria-label="Format Underline">U
            </button>
        </div>
    )
}