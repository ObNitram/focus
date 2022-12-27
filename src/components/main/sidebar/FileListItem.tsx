import React, { useEffect } from "react";
import styles from 'styles/sidebar.module.scss'

export default function FileListItem(this: any, props: any) {
    const [item, setItem] = React.useState(props.item);
    const [isDirCollapsed, setIsDirCollapsed] = React.useState(true);

    function expendOrCollapseFolder(e: any) {
        setIsDirCollapsed(!isDirCollapsed);
        e.stopPropagation();
    }

    useEffect(() => {
        setItem(props.item);
        setIsDirCollapsed(props.collapsed)
    }, [props.item, props.collapsed]);

    if (!item) return null;

    if (item.isDirectory) {
        return (
            <li onClick={expendOrCollapseFolder} className={`${styles.sidebar_list_folder} ${isDirCollapsed ? styles.sidebar_list_folder_collapsed : styles.sidebar_list_folder_expanded}`}>
                <p className={styles.sidebar_list_folder_name}>{item.name}</p>
                <ul>
                    {item.children.map((item: any) => (
                        <FileListItem key={item.name} item={item} />
                    ))}
                </ul>
            </li>
        )
    }

    else {
        return (
            <li className={styles.sidebar_list_file}>
                <p>{item.name}</p>
            </li>
        )
    }
}
