import React from "react";

import styles from 'styles/components/generic/buttons/iconButton.module.scss'

export interface IconButtonProps {
    title: string;
    onClick: () => void;
    icon: React.ReactNode;
    children?: React.ReactNode;
}

export default function IconButton(props: IconButtonProps) {
    return (
        <button className={styles.icon_button} title={props.title} onClick={props.onClick}>
            {props.icon}
            {props.children}
        </button>
    )
}
