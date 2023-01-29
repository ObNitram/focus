import styles from 'styles/components/main/themeGenerator/FormContenairTheme.module.scss'

import {IoIosArrowDown} from 'react-icons/io'
import React, {useRef, useState} from 'react'
import {gsap} from "gsap"
import {Theme} from 'themetypes'

type FormContenairThemeprops = {
    JSONThemes: Theme[]
}

export function FormContenairTheme(this:any, props:FormContenairThemeprops){
    const [themeSelected, setThemeSelected] = useState<string>('')
    const refNewNameInput = useRef<HTMLInputElement>(null)
    const refNewThemeContenair = useRef<HTMLDivElement>(null)

    const toggleShowTable = (e:React.MouseEvent) => {
        const associatedTable = e.currentTarget.nextElementSibling as HTMLDivElement
        const logo = e.currentTarget.getElementsByTagName('svg')[0] as SVGElement
        if(associatedTable.style.height == '0px') {
            gsap.to(associatedTable, {
                height: 'auto',
                duration: 0.2
            })
            gsap.from(logo, {
                transform: 'rotate(0deg)',
                duration: 0.2
            })
        }else{
            gsap.to(associatedTable, {
                height: '0px',
                duration: 0.2
            })
            gsap.from(logo, {
                transform: 'rotate(-90deg)',
                duration: 0.2
            })
        }
    }

    const createFormErrorElement = (msg:string):HTMLParagraphElement => {
        let errorP = document.createElement('p')
        errorP.classList.add(styles.errorP)
        errorP.innerHTML = msg
        return errorP
    }

    const handleCreateNewTheme = (e:React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if(refNewNameInput == null || refNewNameInput.current == null || refNewThemeContenair == null || refNewThemeContenair.current == null) return
        let errorMessages = refNewThemeContenair.current.getElementsByClassName(styles.errorP)
        while(errorMessages.length > 0) errorMessages[0].remove()
        const name = refNewNameInput.current.value
        if(name == ''){
            refNewThemeContenair.current.appendChild(createFormErrorElement('You must choose a name'))
            return
        }
        let alreadyFound= false;
        props.JSONThemes.forEach((value:Theme) => {
            if(value.name == name){
                refNewThemeContenair.current?.appendChild(createFormErrorElement('The chosen name is not available. A theme already exists with this name.'))
                alreadyFound = true;
                return
            }
        })
        if(alreadyFound){
            refNewNameInput.current.focus()
            return
        }
        console.log(name)
    }


    return(
        <div className={styles.formContenairTheme}>
            <h2>Edit section</h2>
            {themeSelected !== ''
            ? (<form action="">
                <div className={styles.section_Form}>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >
                        General <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/>
                    </h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="backgroundColor">Background Color :</label></td>
                                    <td><input type={'color'} defaultValue='#ffffff' id='backgroundColor'></input></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="caretColor">Caret Color :</label></td>
                                    <td><input type="color"id="caretColor" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Paragraph <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/> </h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="ColorP">Color :</label></td>
                                    <td><input type="color" id="ColorP"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlP">Space before :</label></td>
                                    <td><input type="number" id="mlP"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtP">Space above :</label></td>
                                    <td><input type="number" id="mtP"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbP">Space below :</label></td>
                                    <td><input type="number" id="mbP"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeP">Font size :</label></td>
                                    <td><input type="number" id="fontSizeP"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Bold <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorBold">Color :</label></td>
                                    <td><input type="color" id="colorBold"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeBold">Font size :</label></td>
                                    <td><input type="number" id="fontSizeBold"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Italic <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorItalic">Color :</label></td>
                                    <td><input type="color" id="colorItalic"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeItalic">Font size :</label></td>
                                    <td><input type="number" id="fontSizeItalic"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Underline <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorUnderline">Color :</label></td>
                                    <td><input type="color" id="colorUnderline"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeUnderline">Font size :</label></td>
                                    <td><input type="number" id="fontSizeUnderline"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 1 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH1">Color :</label></td>
                                    <td><input type="color" id="colorH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH1">Space before :</label></td>
                                    <td><input type="number" id="mlH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH1">Space above :</label></td>
                                    <td><input type="number" id="mtH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH1">Space below :</label></td>
                                    <td><input type="number" id="mbH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH1">Font size :</label></td>
                                    <td><input type="number" id="fontSizeH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH1">Font weight :</label></td>
                                    <td><input type="number" id="fontWeightH1" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 2 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH2">Color :</label></td>
                                    <td><input type="color" id="colorH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH2">Space before :</label></td>
                                    <td><input type="number" id="mlH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH2">Space above :</label></td>
                                    <td><input type="number" id="mtH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH2">Space below :</label></td>
                                    <td><input type="number" id="mbH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH2">Font size :</label></td>
                                    <td><input type="number" id="fontSizeH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH2">Font weight :</label></td>
                                    <td><input type="number" id="fontWeightH2" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 3 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH3">Color :</label></td>
                                    <td><input type="color" id="colorH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH3">Space before :</label></td>
                                    <td><input type="number" id="mlH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH3">Space above :</label></td>
                                    <td><input type="number" id="mtH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH3">Space below :</label></td>
                                    <td><input type="number" id="mbH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH3">Font size :</label></td>
                                    <td><input type="number" id="fontSizeH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH3">Font weight :</label></td>
                                    <td><input type="number" id="fontWeightH3" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 4 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH4">Color :</label></td>
                                    <td><input type="color" id="colorH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH4">Space before :</label></td>
                                    <td><input type="number" id="mlH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH4">Space above :</label></td>
                                    <td><input type="number" id="mtH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH4">Space below :</label></td>
                                    <td><input type="number" id="mbH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH4">Font size :</label></td>
                                    <td><input type="number" id="fontSizeH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH4">Font weight :</label></td>
                                    <td><input type="number" id="fontWeightH4" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 5 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH5">Color :</label></td>
                                    <td><input type="color" id="colorH5" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH5">Space before :</label></td>
                                    <td><input type="number" id="mlH5" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH5">Space above :</label></td>
                                    <td><input type="number" id="mtH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH5">Space below :</label></td>
                                    <td><input type="number" id="mbH5" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH5">Font size :</label></td>
                                    <td><input type="number" id="fontSizeH5" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH5">Font weight :</label></td>
                                    <td><input type="number" id="fontWeightH5" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 6 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH6">Color :</label></td>
                                    <td><input type="color" id="colorH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH6">Space before :</label></td>
                                    <td><input type="number" id="mlH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH6">Space above :</label></td>
                                    <td><input type="number" id="mtH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH6">Space below :</label></td>
                                    <td><input type="number" id="mbH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH6">Font size :</label></td>
                                    <td><input type="number" id="fontSizeH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH6">Font weight :</label></td>
                                    <td><input type="number" id="fontWeightH6" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Quote <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="mlQuote">Space before :</label></td>
                                    <td><input type="number" id="mlQuote"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbQuote">Space below :</label></td>
                                    <td><input type="number" id="mlQuote"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeQuote">Font size :</label></td>
                                    <td><input type="number" id="fontSizeQuote" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="colorQuote">Color :</label></td>
                                    <td><input type="color" id="colorQuote"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="borderLeftColorQuote">Border left color :</label></td>
                                    <td><input type="number" id="borderLeftColorQuote" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="borderLeftWidthQuote">Border left width :</label></td>
                                    <td><input type="number" id="borderLeftWidthQuote" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="borderLeftStyle">Border left style :</label></td>
                                    <td><select id="borderLeftStyle" defaultValue={'solid'}>
                                            <option value="none">none</option>
                                            <option value="dotted">Dotted</option>
                                            <option value="dashed">Dashed</option>
                                            <option value="solid">Solid</option>
                                            <option value="double">Doble</option>
                                        </select></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="plQuote">Padding left : :</label></td>
                                    <td><input type="number" id="plQuote"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Link <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="fontSizeLink">Font size :</label></td>
                                    <td><input type="number" id="fontSizeLink" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="colorLink">Color :</label></td>
                                    <td><input type="color" id="colorLink"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="textDecorationLink">Text decoration :</label></td>
                                    <td>
                                        <select id="textDecorationLink" defaultValue={'none'}>
                                            <option value="none">None</option>
                                            <option value="underline">Underline</option>
                                            <option value="overline">Overline</option>
                                            <option value="line-through">Line-Through</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="linkHoverColor">Color on hover :</label></td>
                                    <td><input type="color" id="linkHoverColor" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="textDecorationLinkHover">Text decoration :</label></td>
                                    <td>
                                        <select id="textDecorationLinkHover" defaultValue={'none'}>
                                            <option value="none">None</option>
                                            <option value="underline">Underline</option>
                                            <option value="overline">Overline</option>
                                            <option value="line-through">Line-Through</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Bulleted list <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="plUl">Space before :</label></td>
                                    <td><input type="number" id="plUl" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbUl">Space below :</label></td>
                                    <td><input type="number" id="mbUl" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtUl">Space above :</label></td>
                                    <td><input type="number" id="mtUl" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Ordered list <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="plOl">Space before :</label></td>
                                    <td><input type="number" id="plOl" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbOl">Space below :</label></td>
                                    <td><input type="number" id="mbOl" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtOl">Space above :</label></td>
                                    <td><input type="number" id="mtOl" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>)
            : (<form className={styles.form_SelectTheme}>
                <h4>Please select a Theme : </h4>
                {props.JSONThemes.length !== 1 
                    ? (
                        <div>
                            <select id="selectTheme">
                                {props.JSONThemes.map((value:Theme) => {
                                    return (<option value={value.name}>{value.name}</option>)
                                })}
                            </select>
                            <button>Modify</button>
                        </div>
                        )
                    
                    : (<p>No availables themes</p>)
                }
                <h4>Or create a new theme : </h4>
                <div className={styles.newThemeContenair} ref={refNewThemeContenair}>
                    <input ref={refNewNameInput} type="text" placeholder='Name'/>
                    <button onClick={(e) => handleCreateNewTheme(e)}>Create</button>
                </div>
            </form>)}
        </div>
    )
}