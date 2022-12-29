import React, { useEffect } from "react";
import styles from 'styles/sidebar.module.scss'

export interface FileListItemProps {
    item: any;
    collapsed: boolean;
    renaming: boolean;
}

export default function FileListItem(this: any, props: FileListItemProps) {
    const [item, setItem] = React.useState(props.item);
    const [isDirCollapsed, setIsDirCollapsed] = React.useState(true);
    const [renaming, setRenaming] = React.useState(false);

    function expendOrCollapseFolder(e: any) {
        setIsDirCollapsed(!isDirCollapsed);
        e.stopPropagation();
    }

    useEffect(() => {
        setItem(props.item);
        setIsDirCollapsed(props.collapsed)
        setRenaming(false);
    }, [props.item, props.collapsed, props.renaming])

    if (!item) return null;

    if (item.isDirectory) {
        return (
            <li className={`${styles.sidebar_list_folder} ${isDirCollapsed ? styles.sidebar_list_folder_collapsed : styles.sidebar_list_folder_expanded}`}>
                <p onClick={expendOrCollapseFolder} className={styles.sidebar_list_folder_name}>{item.name}</p>
                <ul>
                    {item.children.map((item: any) => (
                        <FileListItem key={item.name} item={item} collapsed={isDirCollapsed} renaming={renaming} />
                    ))}
                </ul>
            </li>
        )
    }

    else {
        return (
            <li className={styles.sidebar_list_file}>
                <input type="text" value={item.name} readOnly={!renaming} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            </li>
        )
    }
}
