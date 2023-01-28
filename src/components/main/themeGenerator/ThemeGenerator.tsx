import styles from 'styles/components/main/themeGenerator/themeGenerator.module.scss'
import { ExemplePage } from './ExemplePage'
import { FormContenairTheme } from './FormContenairTheme'
import {MdOutlineDesignServices} from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';

type ThemeGeneratorProps = {
    closeThemeGenerator : () => void
}

export default function ThemeGenerator(this:any, props:ThemeGeneratorProps){
    return (
        <div className={styles.themeGenerator}>
            <h1 className={styles.h1}>
                <MdOutlineDesignServices/>Theme Generator <MdOutlineDesignServices/>
                <AiOutlineClose title='Close Theme Generator' className={styles.btnClose} onClick={() => props.closeThemeGenerator()}/>
            </h1>
            <div className={styles.themeGeneratorContenair}>
                <FormContenairTheme></FormContenairTheme>
                <ExemplePage></ExemplePage>
            </div>
        </div>
    )
}