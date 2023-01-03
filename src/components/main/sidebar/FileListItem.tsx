import { ipcRenderer } from "electron";
import React, { useEffect } from "react";
import styles from 'styles/sidebar.module.scss'

import Dropdown from '../../generic/Dropdown'

export interface FileListItemProps {
    item: any;
    folderToExpand: string|null;
    collapsedAll: boolean|null;
    renaming: boolean;
}

export default function FileListItem(this: any, props: FileListItemProps) {
    const [item, setItem] = React.useState(props.item);
    const [folderToExpand, setFolderToExpand] = React.useState<string|null>(null);
    const [dirCollapsed, setDirCollapsed] = React.useState<boolean|null>(true);
    const [dirCollapsedAll, setDirCollapsedAll] = React.useState<boolean|null>(null);
    const [renaming, setRenaming] = React.useState(false);
    const [dropdownHidden, setDropdownHidden] = React.useState(true);

    const dropdownRightClickCommonItems = [
        {
            title: 'Rename',
            selected: false,
            key: 'rename'
        },
        {
            title: 'Delete',
            selected: false,
            key: 'delete'
        }
    ]

    const dropdownRightClickFolderItems = [...dropdownRightClickCommonItems,
    {
        title: 'Create note',
        selected: false,
        key: 'create-note'
    },
    {
        title: 'Create folder',
        selected: false,
        key: 'create-folder'
    }]

    function handleClickDirectory() {
        setDirCollapsed(!dirCollapsed)
        setDirCollapsedAll(null)
        setDropdownHidden(true)
    }

    function handleDropdownItemClickCommon(item: any, fileOrFolderPath: string): boolean {
        setDropdownHidden(true)
        if (item.key === 'rename') {
            setRenaming(true);
            return true;
        }
        if (item.key === 'delete') {
            ipcRenderer.send('delete-note-or-folder', fileOrFolderPath)
            return true;
        }

        return false;
    }

    function handleDropdownItemClickFolder(item: any, fileOrFolderPath: string) {
        if (handleDropdownItemClickCommon(item, fileOrFolderPath)) {
            return;
        }
        if (item.key === 'create-note') {
            ipcRenderer.send('create-note', fileOrFolderPath)
        }
        else if (item.key === 'create-folder') {
            ipcRenderer.send('create-folder', fileOrFolderPath)
        }
    }

    useEffect(() => {
        if (props.folderToExpand !== null) {
            setFolderToExpand(props.folderToExpand);

            if (props.folderToExpand === item.path) {
                setDirCollapsed(false);
            }
        }
        else if (props.collapsedAll !== null) {
            setDirCollapsedAll(props.collapsedAll);
            setDirCollapsed(props.collapsedAll);
        }

        setItem(props.item);
        setRenaming(false)
    }, [props.item, props.collapsedAll, props.folderToExpand]);

    if (!item) return null;

    if (item.isDirectory) {
        return (
            <li className={`${styles.sidebar_list_folder} ${dirCollapsed === false || dirCollapsedAll === false ? styles.sidebar_list_folder_expanded : styles.sidebar_list_folder_collapsed}`} id={item.path}>
                <div onClick={handleClickDirectory} onContextMenu={(e) => {e.preventDefault(); setDropdownHidden(!dropdownHidden)}}>
                    <p className={styles.sidebar_list_folder_name}>
                        {item.name}
                    </p>
                </div>
                <Dropdown items={dropdownRightClickFolderItems} onItemSelect={(dropdownItem: any) => {handleDropdownItemClickFolder(dropdownItem, item.path)}} hidden={dropdownHidden} />
                <ul className={styles.sidebar_list_folder_children}>
                    {item.children.map((item: any) => (
                        <FileListItem key={item.name} item={item} collapsedAll={dirCollapsedAll} renaming={false} folderToExpand={folderToExpand} />
                    ))}
                </ul>
            </li>
        )
    }

    else {
        return (
            <li className={styles.sidebar_list_file} id={item.path} onContextMenu={(e) => {e.preventDefault(); setDropdownHidden(!dropdownHidden)}}>
                <Dropdown items={dropdownRightClickCommonItems} onItemSelect={(dropdownItem: any) => {handleDropdownItemClickCommon(dropdownItem, item.path)}} hidden={dropdownHidden} />
                <input type="text" value={item.name} readOnly={!renaming} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            </li>
        )
    }
}
