import { ipcRenderer } from "electron";
import React, { useEffect, useRef } from "react";
import styles from 'styles/components/main/sidebar.module.scss'

import Dropdown from '../../generic/Dropdown'

export interface FileListItemProps {
    item: any;
    folderToExpand: string | null; // this is the path of the folder to expand (used when creating a new note or folder)
    collapsedAll: boolean | null;  // this is used when collapsing/expanding all folders
    renaming: boolean;
}

export default function FileListItem(this: any, props: FileListItemProps) {
    const [item, setItem] = React.useState(props.item);
    const [folderToExpand, setFolderToExpand] = React.useState<string | null>(null);
    const [dirCollapsed, setDirCollapsed] = React.useState<boolean | null>(true);
    const [dirCollapsedAll, setDirCollapsedAll] = React.useState<boolean | null>(null);
    const [renaming, setRenaming] = React.useState(false);
    const [dropdownHidden, setDropdownHidden] = React.useState(true);

    const refItem = useRef<HTMLLIElement>(null);

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
        },
        {
            title: 'Show in Explorer',
            selected: false,
            key: 'show-in-explorer'
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
        }
    ]

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

        if (!props.item.isDirectory && props.item.name.endsWith('.md')) {
            props.item.name = props.item.name.slice(0, -3) // hide the .md extension
        }
        setItem(props.item);
        setRenaming(false);


        // Event listeners
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEnterKeyPressed);

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEnterKeyPressed);
    }, [props.item, props.collapsedAll, props.folderToExpand]);

    const handleClickOutside = (event: MouseEvent) => {
        const itemInclick = !refItem.current || refItem.current.contains(event.target as Node);
        if (itemInclick) {
            return;
        }
        setDropdownHidden(true);

        const isItemRenaming = refItem.current && refItem.current.querySelector('input')?.readOnly === false;
        if (isItemRenaming) {
            doRenaming();
        }
    };

    const handleEnterKeyPressed = (event: KeyboardEvent) => {
        const isItemRenaming = refItem.current && refItem.current.contains(event.target as Node);

        if (isItemRenaming && event.key === 'Enter') {
            doRenaming();
        }
    }

    function doRenaming() {
        setRenaming(false);
        ipcRenderer.send('rename-note-or-folder', item.path, refItem.current?.querySelector('input')?.value)
    }

    function handleClickDirectory() {
        setDirCollapsed(!dirCollapsed)
        setDirCollapsedAll(null)
        setDropdownHidden(true)
    }

    function handleDropdownItemClickCommon(item: any, fileOrFolderPath: string): boolean {
        setDropdownHidden(true)
        if (item.key === 'rename') {
            setRenaming(true);

            // Focus on the input and select the text
            if (refItem.current) {
                let input = refItem.current.querySelector('input');
                if (input) {
                    input.focus();
                    input.select();
                }
            }
            return true;
        }
        else if (item.key === 'delete') {
            ipcRenderer.send('delete-note-or-folder', fileOrFolderPath)
            return true;
        }
        else if (item.key === 'show-in-explorer') {
            ipcRenderer.send('show-in-explorer', fileOrFolderPath)
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

    if (!item) return null;

    if (item.isDirectory) {
        return (
            <li className={`${styles.sidebar_list_folder} ${dirCollapsed === false || dirCollapsedAll === false ? styles.sidebar_list_folder_expanded : styles.sidebar_list_folder_collapsed}`} id={item.path} ref={refItem}>
                <div onClick={handleClickDirectory} onContextMenu={(e) => { setDropdownHidden(!dropdownHidden) }}>
                    <span className={styles.sidebar_list_folder_name}>
                        <input type="text" value={item.name} readOnly={!renaming} onChange={(e) => setItem({ ...item, name: e.target.value })} />
                    </span>
                </div>
                <Dropdown items={dropdownRightClickFolderItems} onItemSelect={(dropdownItem: any) => { handleDropdownItemClickFolder(dropdownItem, item.path) }} hidden={dropdownHidden} />
                <ul className={styles.sidebar_list_folder_children}>
                    {item.children.map((item: any) => (
                        <FileListItem key={item.path} item={item} collapsedAll={dirCollapsedAll} renaming={false} folderToExpand={folderToExpand} />
                    ))}
                </ul>
            </li>
        )
    }

    else {
        return (
            <li className={styles.sidebar_list_file} id={item.path} onContextMenu={(e) => { setDropdownHidden(!dropdownHidden) }} ref={refItem}>
                <Dropdown items={dropdownRightClickCommonItems} onItemSelect={(dropdownItem: any) => { handleDropdownItemClickCommon(dropdownItem, item.path) }} hidden={dropdownHidden} />
                <input type="text" value={item.name} readOnly={!renaming} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            </li>
        )
    }
}
