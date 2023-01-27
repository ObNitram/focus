import styles from 'styles/components/main/themeGenerator/themeGenerator.module.scss'
import { ExemplePage } from './ExemplePage'
import { FormContenairTheme } from './FormContenairTheme'
import {MdOutlineDesignServices} from 'react-icons/md';


export default function ThemeGenerator(this:any){
    return (
        <div className={styles.themeGenerator}>
            <h1 className={styles.h1}><MdOutlineDesignServices/>Theme Generator <MdOutlineDesignServices/> </h1>
            <div className={styles.themeGeneratorContenair}>
                <FormContenairTheme></FormContenairTheme>
                <ExemplePage></ExemplePage>
            </div>
        </div>
    )
}