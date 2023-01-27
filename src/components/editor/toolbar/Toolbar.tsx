import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState, useEffect, useCallback, useRef } from "react";

import {
    HeadingTagType,
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    $isQuoteNode,
} from '@lexical/rich-text';

import {
    $setBlocksType_experimental,
} from '@lexical/selection';

import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
} from '@lexical/list';

import {
    $createCodeNode,
    $isCodeNode,
} from '@lexical/code';

import {
    $getSelection,
    NodeSelection,
    RangeSelection,
    GridSelection,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    $isRangeSelection,
    DEPRECATED_$isGridSelection,
    $createParagraphNode,
    COMMAND_PRIORITY_CRITICAL,
    FORMAT_ELEMENT_COMMAND,
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
    TextNode,
    ElementNode,
    $isParagraphNode,
    ParagraphNode,
    CAN_UNDO_COMMAND,
    CAN_REDO_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';

import { getSelectedNode } from '../utils/getSelectedNode';

import styles from "styles/components/editor/toolbar/editor.toolbar.module.scss";

import Button from "./Button";
import Selector from "./Selector";
import Divider from "./Divider";

import { FaIndent, FaLink, FaOutdent, FaRedo, FaUndo } from "react-icons/fa";
import { sanitizeUrl } from "../utils/url";

const dropdownTextFormatItems = [
    {
        title: 'Normal',
        selected: false,
        key: 'normal'
    },
    {
        title: 'Heading 1',
        selected: false,
        key: 'heading-1'
    },
    {
        title: 'Heading 2',
        selected: false,
        key: 'heading-2'
    },
    {
        title: 'Heading 3',
        selected: false,
        key: 'heading-3'
    },
    {
        title: 'Heading 4',
        selected: false,
        key: 'heading-4'
    },
    {
        title: 'Heading 5',
        selected: false,
        key: 'heading-5'
    },
    {
        title: 'Heading 6',
        selected: false,
        key: 'heading-6'
    },
    {
        title: 'Bullet List',
        selected: false,
        key: 'bullet-list'
    },
    {
        title: 'Numbered List',
        selected: false,
        key: 'numbered-list'
    },
    {
        title: 'Quote',
        selected: false,
        key: 'quote'
    },
    {
        title: 'Code',
        selected: false,
        key: 'code'
    },
]

const dropdownTextAlignItems = [
    {
        title: 'Left',
        selected: false,
        key: 'left'
    },
    {
        title: 'Center',
        selected: false,
        key: 'center'
    },
    {
        title: 'Right',
        selected: false,
        key: 'right'
    },
    {
        title: 'Justify',
        selected: false,
        key: 'justify'
    }
]

let currTextFormatKey = 'normal';
let currTextFormatTitle = 'Normal';

let currTextAlignKey = 'left';
let currTextAlignTitle = 'Left';

export interface ToolBarProps {
    isSaved:boolean

}

export default function Toolbar(this:any, props:ToolBarProps) {
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isLink, setIsLink] = useState(false);

    const [dropdownTextFormatClosed, setDropdownTextFormatClosed] = useState(true);
    const [dropdownTextAlignClosed, setDropdownTextAlignClosed] = useState(true);

    const [currTextFormat, setCurrTextFormat] = useState('Normal');
    const [currTextAlign, setCurrTextAlign] = useState('Left');

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const dropdownTextFormatRef = useRef<HTMLDivElement>(null);
    const dropdownTextAlignRef = useRef<HTMLDivElement>(null);

    function updateCurrentTextFormatSelection(node: TextNode | ElementNode, parent: ElementNode | null) {
        if ($isHeadingNode(parent) || $isHeadingNode(node)) {
            let headingLevel = $isHeadingNode(parent) ? parent.getTag() : node.getTag();
            headingLevel = headingLevel.replace('h', '');

            currTextFormatKey = 'heading-' + headingLevel;
            currTextFormatTitle = 'Heading ' + headingLevel;

            setCurrTextFormat(currTextFormatTitle);
        }
        else if ($isListNode(parent) || $isListNode(node)) {
            let isNumbered = $isListNode(parent) ? parent.getListType() === 'number' : node.getListType() === 'number';

            currTextFormatKey = isNumbered ? 'numbered-list' : 'bullet-list';
            currTextFormatTitle = isNumbered ? 'Numbered List' : 'Bullet List';

            setCurrTextFormat(currTextFormatTitle);
        }
        else if ($isQuoteNode(parent) || $isQuoteNode(node)) {
            currTextFormatKey = 'quote';
            currTextFormatTitle = 'Quote';

            setCurrTextFormat(currTextFormatTitle);
        }
        else if ($isCodeNode(parent) || $isCodeNode(node)) {
            currTextFormatKey = 'code';
            currTextFormatTitle = 'Code';

            setCurrTextFormat(currTextFormatTitle);
        }
        else {
            currTextFormatKey = 'normal';
            currTextFormatTitle = 'Normal';

            setCurrTextFormat(currTextFormatTitle);
        }
    }

    function getAlignmentFromNumber(num: number) {
        switch (num) {
            case 1:
                return 'left';
            case 2:
                return 'center';
            case 3:
                return 'right';
            case 4:
                return 'justify';
            default:
                return 'left';
        }
    }

    function updateCurrentTextAlignSelection(node: TextNode | ElementNode, parent: ElementNode | null) {
        if ($isParagraphNode(parent) || $isParagraphNode(node)) {
            let textAlign = $isParagraphNode(parent) ? getAlignmentFromNumber(parent.getFormat()) : getAlignmentFromNumber(node.getFormat());

            currTextAlignKey = textAlign;
            currTextAlignTitle = textAlign.charAt(0).toUpperCase() + textAlign.slice(1);

            setCurrTextAlign(currTextAlignTitle);
        }
        else if ($isHeadingNode(parent) || $isHeadingNode(node)) {
            let textAlign = $isHeadingNode(parent) ? getAlignmentFromNumber(parent.getFormat()) : getAlignmentFromNumber(node.getFormat());

            currTextAlignKey = textAlign;
            currTextAlignTitle = textAlign.charAt(0).toUpperCase() + textAlign.slice(1);

            setCurrTextAlign(currTextAlignTitle);
        }
        else {
            currTextAlignKey = 'left';
            currTextAlignTitle = 'Left';

            setCurrTextAlign(currTextAlignTitle);
        }
    }

    const updateToolbar = useCallback(() => {
        const selection: null | RangeSelection | NodeSelection | GridSelection = $getSelection();

        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));

            const node = getSelectedNode(selection)
            const parent = node.getParent();

            // update text format selector title
            updateCurrentTextFormatSelection(node, parent);

            // update text align selector title
            updateCurrentTextAlignSelection(node, parent);

            // Update links
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }
        }
    }, [activeEditor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar();
                    setActiveEditor(newEditor);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
        );
    }, [editor, updateToolbar]);

    useEffect(() => {
        document.addEventListener('mousedown', clickOutsideDropdown);

        return () => {
            mergeRegister(
                activeEditor.registerUpdateListener(({ editorState }) => {
                    editorState.read(() => {
                        updateToolbar();
                    });
                })
            );

            document.removeEventListener('mousedown', clickOutsideDropdown);
        }
    }, [activeEditor, editor, updateToolbar]);

    const clickOutsideDropdown = (e: MouseEvent) => {
        if (dropdownTextFormatRef.current && !dropdownTextFormatRef.current.contains(e.target as Node)) {
            setDropdownTextFormatClosed(true);
        }
        if (dropdownTextAlignRef.current && !dropdownTextAlignRef.current.contains(e.target as Node)) {
            setDropdownTextAlignClosed(true);
        }
    }

    const formatParagraph = () => {
        editor.update(() => {
            const selection = $getSelection();
            if (
                $isRangeSelection(selection) ||
                DEPRECATED_$isGridSelection(selection)
            )
                $setBlocksType_experimental(selection, () => $createParagraphNode());
        });
    };

    const formatHeading = (headingSize: HeadingTagType) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
                $setBlocksType_experimental(selection, () => $createHeadingNode(headingSize));
            }
        })
    }

    const formatQuote = () => {
        editor.update(() => {
            const selection = $getSelection();
            if (
                $isRangeSelection(selection) ||
                DEPRECATED_$isGridSelection(selection)
            ) {
                $setBlocksType_experimental(selection, () => $createQuoteNode());
            }
        });
    };

    const formatCode = () => {
        editor.update(() => {
            let selection = $getSelection();

            if (
                $isRangeSelection(selection) ||
                DEPRECATED_$isGridSelection(selection)
            ) {
                if (selection.isCollapsed()) {
                    $setBlocksType_experimental(selection, () => $createCodeNode());
                } else {
                    const textContent = selection.getTextContent();
                    const codeNode = $createCodeNode();
                    selection.insertNodes([codeNode]);
                    selection = $getSelection();
                    if ($isRangeSelection(selection))
                        selection.insertRawText(textContent);
                }
            }
        });
    };

    const insertLink = useCallback(() => {
        if (!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);

    function handleDropdownTextFormatItemCLick(item: any) {
        if (item.key === currTextFormatKey) {
            if (currTextFormatKey === 'bullet-list' || currTextFormatKey === 'numbered-list') {
                console.log('remove list');
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            }
            return;
        }

        switch (item.key) {
            case 'normal':
                formatParagraph();
                break;
            case 'heading-1':
                formatHeading('h1');
                break;
            case 'heading-2':
                formatHeading('h2');
                break;
            case 'heading-3':
                formatHeading('h3');
                break;
            case 'heading-4':
                formatHeading('h4');
                break;
            case 'heading-5':
                formatHeading('h5');
                break;
            case 'heading-6':
                formatHeading('h6');
                break;
            case 'bullet-list':
                console.log('add list');
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                break;
            case 'numbered-list':
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                break;
            case 'quote':
                formatQuote();
                break;
            case 'code':
                formatCode();
                break;
        }

        currTextFormatKey = item.key;
        currTextFormatTitle = item.title;
    }

    function handleDropdownTextAlignItemCLick(item: any) {
        if (item.key === currTextAlignKey) {
            return;
        }

        switch (item.key) {
            case 'left':
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                break;
            case 'center':
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                break;
            case 'right':
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                break;
            case 'justify':
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                break;
            case 'indent':
                editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
                break;
            case 'outdent':
                editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
                break;
        }

        currTextAlignKey = item.key;
        currTextAlignTitle = item.title;
    }

    function handleTextFormatBtnClick(event: any) {
        setDropdownTextFormatClosed(!dropdownTextFormatClosed);
    }

    function handleTextAlignBtnClick(event: any) {
        setDropdownTextAlignClosed(!dropdownTextAlignClosed);
    }

    function handleUndo() {
        activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
    }

    function handleRedo() {
        activeEditor.dispatchCommand(REDO_COMMAND, undefined);
    }

    return (
        <div className={styles.editor_toolbar}>
            <Button disabled={!canUndo} onClick={handleUndo} alt="Undo (Ctrl+Z)" icon={<FaUndo />} />
            <Button disabled={!canRedo} onClick={handleRedo} alt="Redo (Ctrl+Y)" icon={<FaRedo />} />
            <Divider />

            <Selector title={currTextFormat} closed={dropdownTextFormatClosed} items={dropdownTextFormatItems} onItemSelect={handleDropdownTextFormatItemCLick} onClick={handleTextFormatBtnClick} alt="Text format" ref={dropdownTextFormatRef} />
            <Button onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"); }} alt="Bold (Ctrl+B)" active={isBold}>B</Button>
            <Button onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"); }} alt="Italic (Ctrl+I)" active={isItalic}>I</Button>
            <Button onClick={() => { editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline"); }} alt="Underline (Ctrl+U)" active={isUnderline}>U</Button>
            <Divider />
            <Button onClick={insertLink} alt="Link (Ctrl+K)" active={isLink}><FaLink /></Button>
            <Divider />
            <Selector title={currTextAlign} closed={dropdownTextAlignClosed} items={dropdownTextAlignItems} onItemSelect={handleDropdownTextAlignItemCLick} onClick={handleTextAlignBtnClick} alt="Text align" ref={dropdownTextAlignRef} />
            <Button onClick={() => { editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined); }} alt="Indent" active={false} icon={<FaIndent />} />
            <Button onClick={() => { editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined); }} alt="Outdent" active={false} icon={<FaOutdent />} />
            {!props.isSaved && <div className={styles.div_saved} title="This note is not saved"></div>}
        </div>
    )
}
