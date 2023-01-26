import { Theme, defaultTheme } from "./ThemeType";

export function convertThemeForStyle(theme:Theme):string{
    let css:string = ''
    for(const selector in theme){
        let newCssProperty = ''
        if(selector != 'link'){
            newCssProperty = `\n.editor_${selector}{\n`
            for(const property in theme[selector]){
                newCssProperty += `\t${property}: ${theme[selector][property]};\n`
            }
            newCssProperty+= '}'
        }
        css+=newCssProperty
    }
    let newCssProperty = '\n.editor_link{\n';
    for(const property in theme['link']){
        if(property != 'linkHover'){
            newCssProperty +=  `\t${property}: ${theme['link'][property]};\n`
        }
    }
    newCssProperty += '}\n'
    newCssProperty+= '.editor_link:hover{\n'
    for(const property in theme['link']['linkHover']){
        newCssProperty +=  `\t${property}: ${theme['link']['linkHover'][property]};\n`
    }
    newCssProperty += '}'
    css += newCssProperty
    console.log(css)
    return css
}