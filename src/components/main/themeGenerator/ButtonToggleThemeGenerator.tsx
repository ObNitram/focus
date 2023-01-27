import {MdOutlineDesignServices} from 'react-icons/md';
import styles from 'styles/components/main/themeGenerator/buttonToggleThemeGenerator.module.scss'


type ButtonToggleThemeGeneratorProps = {
    toggleThemeGenerator: () => void,
    title: string
}

export function ButtonToggleThemeGenerator(this:any, props:ButtonToggleThemeGeneratorProps) {
    
    return (
        <button title={props.title} className={styles.buttonToggleThemeGenerator} onClick={() => props.toggleThemeGenerator()}>
            <MdOutlineDesignServices size={"30px"}></MdOutlineDesignServices>
        </button>
    );
}