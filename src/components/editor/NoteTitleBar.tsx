import styles from 'styles/components/editor/editor.noteTitleBar.module.scss'

export interface NoteTitleBarProps {
    noteName: string;
    noteSaved: boolean;
}

export default function NoteTitleBar(props: NoteTitleBarProps) {
    return (
        <div className={styles.editor_container_notetitlebar}>
            <div className={!props.noteSaved ? styles.editor_container_notetitlebar_indicator : styles.editor_container_notetitlebar_indicator_hidden}/>
            <p>{props.noteName}</p>
        </div>
    )
}
