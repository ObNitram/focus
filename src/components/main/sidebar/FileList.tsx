import React, { useEffect } from "react";
import styles from 'styles/sidebar.module.scss'

import FileListItem from "./FileListItem";

export default function FileList(props: any) {
    const [files, setFiles] = React.useState(props.files);

    // update the files state when the props change
    useEffect(() => {
        setFiles(props.files);
    }, [props.files]);

    if (!files) return null;

    return (
        <ul className={styles.sidebar_list}>
            {files.map((item: any) => (
                <FileListItem key={item.name} item={item} />
            ))}
        </ul>
    )
}
