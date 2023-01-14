import { ipcRenderer } from "electron";
import React, { useEffect, useContext } from "react";
import styles from 'styles/components/main/sidebar.module.scss'

import FileListItem from "./FileListItem";

export interface FileListProps {
    files: any;
    collapsedAll: boolean|null;
    folderToExpand: string|null;
}

export default function FileList(props: FileListProps) {
    const [files, setFiles] = React.useState(props.files);

    const [folderToExpand, setFolderToExpand] = React.useState<string|null>(null);

    const [collapsedAll, setCollapsedAll] = React.useState<boolean|null>(null);

    // update the files state when the props change
    useEffect(() => {
        setFiles(props.files);

        if (props.collapsedAll !== null) {
            setCollapsedAll(props.collapsedAll);
            setFolderToExpand(null);
        }
        else if (props.folderToExpand !== null) {
            setFolderToExpand(props.folderToExpand);
            setCollapsedAll(null);
        }
    }, [props.files, props.collapsedAll, props.folderToExpand]);

    function handleDragOver(event: React.DragEvent<HTMLUListElement>) {
        event.preventDefault();

        // if ctrl key pressed, copy the file
        if (event.ctrlKey) {
            event.dataTransfer.dropEffect = "copy";
        }
        else {
            event.dataTransfer.dropEffect = "move";
        }
    }

    function dropHandler(event: React.DragEvent<HTMLUListElement>) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");

        // if ctrl key pressed, copy the file
        if (event.ctrlKey) {
            ipcRenderer.send('copy-note-or-folder', data)
        }
        else {
            ipcRenderer.send('move-note-or-folder', data)
        }
    }

    return (
        <ul className={styles.sidebar_list} onDragOver={handleDragOver} onDrop={dropHandler}>
            {files?.children.map((item: any) => (
                <FileListItem  key={item.path} item={item} collapsedAll={collapsedAll} renaming={false} folderToExpand={folderToExpand} />
            ))}
        </ul>
    )
}
