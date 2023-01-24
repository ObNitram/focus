/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styles from "styles/components/editor/toolbar/editor.toolbar.button.module.scss";

import {ReactNode, useEffect, useState} from 'react';

export interface ButtonProps {
    icon?: ReactNode;
    onClick: () => void;
    alt?: string;
    children?: ReactNode;
    active?: boolean;
    disabled?: boolean;
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
