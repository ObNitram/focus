import { forwardRef, ReactNode } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

import Dropdown, { DropdownItem } from "../../generic/Dropdown";

import styles from 'styles/components/editor/toolbar/editor.toolbar.selector.module.scss';

export interface SelectorProps {
    title: string;
    alt?: string;
    icon?: ReactNode;
    closed: boolean;
    onClick: (event: any) => void;

    items: Array<DropdownItem>;
    onItemSelect: (item: DropdownItem) => void;
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
