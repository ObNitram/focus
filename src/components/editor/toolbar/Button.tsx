/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styles from "styles/components/editor/toolbar/editor.toolbar.button.module.scss";

import {ReactNode} from 'react';

export interface ButtonProps {
    icon?: ReactNode;
    onClick: () => void;
    alt?: string;
    children?: ReactNode;
    active?: boolean;
}

export default function Button(props: ButtonProps) {
    const {icon, onClick, alt} = props;

    return (
        <button className={`${styles.editor_toolbar_button} ${props.active ? styles.active : ''}`} onClick={onClick} title={alt}>
            {icon}
            {props.children}
        </button>
    );
}
