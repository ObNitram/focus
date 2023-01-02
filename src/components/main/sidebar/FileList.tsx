import React, { useEffect } from "react";
import styles from 'styles/sidebar.module.scss'

import FileListItem from "./FileListItem";

export default function FileList(props: any) {
    const [files, setFiles] = React.useState(props.files);
    const [collapsed, setCollapsed] = React.useState(true);

    // update the files state when the props change
    useEffect(() => {
        setFiles(props.files);
        setCollapsed(props.collapsed);
    }, [props.files, props.collapsed]);

    if (!files) return null;

    return (
        <ul className={styles.sidebar_list}>
            {files.map((item: any) => (
                <FileListItem  key={item.path} item={item} collapsedAll={collapsed} renaming={false} />
            ))}
        </ul>
    )
}
