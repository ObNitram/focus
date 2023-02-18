/**
 * @file Button.tsx
 * @description The button component for the editor toolbar.
 */

import styles from "styles/components/editor/toolbar/editor.toolbar.button.module.scss";

import {ReactNode, useEffect, useState} from 'react';

export interface ButtonProps {
    icon?: ReactNode;         // The icon to display in the button.
    onClick: () => void;      // The function to call when the button is clicked.
    alt?: string;             // The alt text to display when the button is hovered.
    children?: ReactNode;     // The children to display in the button.
    active?: boolean;         // Is the button active?: boolean;
    disabled?: boolean;       // Is the button disabled?: boolean;
}

export default function Button(props: ButtonProps) {
    const {icon, onClick, alt} = props;
    const [isActive, setIsActive] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        setIsActive(props.active || false);
    }, [props.active]);

    return (
        <button className={`${styles.editor_toolbar_button} ${isActive ? styles.editor_toolbar_button_active : ''} ${isDisabled ? styles.editor_toolbar_button_disabled : ''}`} onClick={onClick} title={alt}>
            {icon}
            {props.children}
        </button>
    );
}
