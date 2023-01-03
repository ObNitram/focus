import React, { useEffect } from "react";
import styles from 'styles/sidebar.module.scss'

import FileListItem from "./FileListItem";

export interface FileListProps {
    files: any;
    collapsedAll: boolean;
    collapse: boolean|null;
    folderToCollapseOrExpand: string|null;
}

export default function FileList(props: FileListProps) {
    const [files, setFiles] = React.useState(props.files);

    const [folderToCollapseOrExpand, setFolderToCollapseOrExpand] = React.useState<string|null>(null);
    const [collapse, setCollapse] = React.useState(false);

    const [collapsedAll, setCollapsedAll] = React.useState(true);

    // update the files state when the props change
    useEffect(() => {
        setFiles(props.files);
        setCollapsedAll(props.collapsedAll);

        if (props.folderToCollapseOrExpand) {
            setFolderToCollapseOrExpand(props.folderToCollapseOrExpand);
        }
        if (props.collapse !== null) {
            setCollapse(props.collapse);
        }
    }, [props.files, props.collapsedAll, props.collapse, props.folderToCollapseOrExpand]);

    if (!files) return null;

    return (
        <ul className={styles.sidebar_list}>
            {files.map((item: any) => (
                <FileListItem  key={item.path} item={item} collapsedAll={collapsedAll} renaming={false} collapse={item.path === folderToCollapseOrExpand ? collapse : null} />
            ))}
        </ul>
    )
}
