/**
 * @file Selector.tsx
 * @description The selector component for the editor toolbar.
 */

import { forwardRef, ReactNode } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

import Dropdown, { DropdownItem } from "../../generic/Dropdown";

import styles from 'styles/components/editor/toolbar/editor.toolbar.selector.module.scss';

export interface SelectorProps {
    title: string;                 // The title to display in the selector.
    alt?: string;                  // The alt text to display when the selector is hovered.
    icon?: ReactNode;              // The icon to display in the selector.
    closed: boolean;               // Is the selector closed?
    onClick: (event: any) => void; // The function to call when the selector is clicked.

    items: Array<DropdownItem>;                 // The items to display in the dropdown.
    onItemSelect: (item: DropdownItem) => void; // The function to call when an item is selected.
}

const Selector = (props: SelectorProps, ref: any) => {
    return (
        <div onClick={props.onClick} ref={ref} className={`${styles.editor_toolbar_selector} ${props.closed ? styles.closed : ''}`} title={props.alt}>
            {props.icon}
            <p>{props.title}</p>
            <Dropdown items={props.items} onItemSelect={props.onItemSelect} hidden={props.closed} />
            { props.closed ? <AiOutlineDown /> : <AiOutlineUp /> }
        </div>
    )
}

export default forwardRef(Selector);
