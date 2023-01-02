import { ipcRenderer } from "electron";
import React, { useEffect } from "react";
import styles from 'styles/sidebar.module.scss'

import Dropdown from '../../generic/Dropdown'

export interface FileListItemProps {
    item: any;
    collapsed: boolean;
    renaming: boolean;
}

export default function FileListItem(this: any, props: FileListItemProps) {
    const [item, setItem] = React.useState(props.item);
    const [isDirCollapsed, setIsDirCollapsed] = React.useState(true);
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
        setIsDirCollapsed(!isDirCollapsed)
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
        setItem(props.item);
        setIsDirCollapsed(props.collapsed)
        setRenaming(false)
    }, [props.item, props.collapsed])

    if (!item) return null;

    if (item.isDirectory) {
        return (
            <li className={`${styles.sidebar_list_folder} ${isDirCollapsed ? styles.sidebar_list_folder_collapsed : styles.sidebar_list_folder_expanded}`} id={item.path}>
                <p onClick={handleClickDirectory} className={styles.sidebar_list_folder_name}>{item.name}</p>
                <Dropdown items={dropdownRightClickItems} onItemSelect={(dropdownItem: any) => {handleDropdownItemClick(dropdownItem, item.path)}} hidden={dropdownHidden} />
                <ul>
                    {item.children.map((item: any) => (
                        <FileListItem key={item.name} item={item} collapsed={true} renaming={false} />
                    ))}
                </ul>
            </li>
        )
    }

    else {
        return (
            <li className={styles.sidebar_list_file} onContextMenu={() => setDropdownHidden(!dropdownHidden)} id={item.path}>
                <Dropdown items={dropdownRightClickItems} onItemSelect={(dropdownItem: any) => {handleDropdownItemClick(dropdownItem, item.path)}} hidden={dropdownHidden} />
                <input type="text" value={item.name} readOnly={!renaming} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            </li>
        )
    }
}
