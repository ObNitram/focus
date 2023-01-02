import { ipcRenderer } from "electron";
import React, { useEffect } from "react";
import styles from 'styles/sidebar.module.scss'

import Dropdown from '../../generic/Dropdown'

export interface FileListItemProps {
    item: any;
    collapsedAll: boolean;
    renaming: boolean;
}

export default function FileListItem(this: any, props: FileListItemProps) {
    const [item, setItem] = React.useState(props.item);
    const [dirCollapsed, setDirCollapsed] = React.useState(true);
    const [dirCollapsedAll, setDirCollapsedAll] = React.useState(true);
    const [renaming, setRenaming] = React.useState(false);
    const [dropdownHidden, setDropdownHidden] = React.useState(true);

    const dropdownRightClickItems = [
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

    function handleClickDirectory() {
        setDirCollapsed(!dirCollapsed)
        setDropdownHidden(true)
    }

    function handleDropdownItemClick(item: any, fileOrFolderPath: string) {
        setDropdownHidden(true)
        if (item.key === 'rename') {
            setRenaming(true);
        }
        else if (item.key === 'delete') {
            ipcRenderer.send('delete-note-or-folder', fileOrFolderPath)
        }
    }

    useEffect(() => {
        setDirCollapsedAll(props.collapsedAll);
        if (props.collapsedAll) {
            setDirCollapsed(true);
        }

        setItem(props.item);
        setRenaming(false)
    }, [props.item, props.collapsedAll])

    if (!item) return null;

    if (item.isDirectory) {
        return (
            <li className={`${styles.sidebar_list_folder} ${dirCollapsed && dirCollapsedAll ? styles.sidebar_list_folder_collapsed : styles.sidebar_list_folder_expanded}`} id={item.path}>
                <div onClick={handleClickDirectory} onContextMenu={(e) => {e.preventDefault(); setDropdownHidden(!dropdownHidden)}}>
                    <p className={styles.sidebar_list_folder_name}>
                        {item.name}
                    </p>
                </div>
                <Dropdown items={dropdownRightClickItems} onItemSelect={(dropdownItem: any) => {handleDropdownItemClick(dropdownItem, item.path)}} hidden={dropdownHidden} />
                <ul className={styles.sidebar_list_folder_children}>
                    {item.children.map((item: any) => (
                        <FileListItem key={item.name} item={item} collapsedAll={dirCollapsedAll} renaming={false} />
                    ))}
                </ul>
            </li>
        )
    }

    else {
        return (
            <li className={styles.sidebar_list_file} id={item.path} onContextMenu={(e) => {e.preventDefault(); setDropdownHidden(!dropdownHidden)}}>
                <Dropdown items={dropdownRightClickItems} onItemSelect={(dropdownItem: any) => {handleDropdownItemClick(dropdownItem, item.path)}} hidden={dropdownHidden} />
                <input type="text" value={item.name} readOnly={!renaming} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            </li>
        )
    }
}
