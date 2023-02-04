export type Theme = {
    name: string
    general: {
        'background-color': string,
        'caret-color' : string,
    }
    paragraph: {
        'color': string,
        'margin-left': string,
        'margin-top': string,
        'margin-bottom': string,
        'font-size':string
    },
    bold: {
        'color': string,
        'font-size': string
    },
    italic: {
        'color': string,
        'font-size': string
    }
    underline: {
        'color': string,
        'font-size': string
    },
    h1: {
        'color': string,
        'margin-left': string,
        'margin-top': string,
        'margin-bottom': string,
        'font-size': string,
        'font-weight': string
    },
    h2: {
        'color': string,
        'margin-left': string,
        'margin-top': string,
        'margin-bottom': string,
        'font-size': string,
        'font-weight': string
    },
    h3: {
        'color': string,
        'margin-left': string,
        'margin-top': string,
        'margin-bottom': string,
        'font-size': string,
        'font-weight': string
    },
    h4: {
        'color': string,
        'margin-left': string,
        'margin-top': string,
        'margin-bottom': string,
        'font-size': string,
        'font-weight': string
    },
    h5: {
        'color': string,
        'margin-left': string,
        'margin-top': string,
        'margin-bottom': string,
        'font-size': string,
        'font-weight': string
    },
    h6: {
        'color': string,
        'margin-left': string,
        'margin-top': string,
        'margin-bottom': string,
        'font-size': string,
        'font-weight': string
    },
    quote: {
        'margin-left': string,
        'margin-bottom': string,
        'font-size': string,
        'color': string,
        'border-left-color': string,
        'border-left-width': string,
        'border-left-style': string,
        'padding-left': string
    },
    link: {
        'font-size': string,
        'color': string,
        'text-decoration': string
        'linkHover': {
            'color': string,
            'text-decoration': string
        },
    },
    ul: {
        'color': string,
        'padding-left': string,
        'margin-bottom': string,
        'margin-top': string
    },
    ol: {
        'color': string,
        'padding-left': string,
        'margin-bottom': string,
        'margin-top': string 
    },
    code: {
        'margin-top': string,
        'margin-bottom': string,
        'background-color': string,
        'font-size': string
    }
}

export const defaultTheme:Theme = {
    name: 'default',
    general: {
        'background-color': '#1e1e1e',
        'caret-color': '#ffffff',
    },
    paragraph: {
        'color': '#ffffff',
        'font-size': '15px',
        'margin-bottom': '8px',
        'margin-left': '0',
        'margin-top': '0',
    },
    bold: {
        'color': '#ffffff',
        'font-size': '15px',
    },
    italic: {
        'color': '#ffffff',
        'font-size': '15px',
    },
    underline: {
        'color': '#ffffff',
        'font-size': '15px',
    },
    h1: {
        'color': '#ffffff',
        'margin-left': '0px',
        'margin-top': '20px',
        'margin-bottom': '20px',
        'font-size': '30px',
        'font-weight': '700'
    },
    h2: {
        'color': '#ffffff',
        'margin-left': '0px',
        'margin-top': '18px',
        'margin-bottom': '18px',
        'font-size': '22.5px',
        'font-weight': '700'
    },
    h3: {
        'color': '#ffffff',
        'margin-left': '0px',
        'margin-top': '17px',
        'margin-bottom': '17px',
        'font-size': '17.55px',
        'font-weight': '700'
    },
    h4: {
        'color': '#ffffff',
        'margin-left': '0px',
        'margin-top': '19px',
        'margin-bottom': '19px',
        'font-size': '15px',
        'font-weight': '700'
    },
    h5: {
        'color': '#ffffff',
        'margin-left': '0px',
        'margin-top': '20px',
        'margin-bottom': '20px',
        'font-size': '12.45px',
        'font-weight': '700'
    },
    h6: {
        'color': '#ffffff',
        'margin-left': '0px',
        'margin-top': '23px',
        'margin-bottom': '23px',
        'font-size': '10.05px',
        'font-weight': '700'
    },
    quote: {
        'margin-left': '20px',
        'margin-bottom': '10px',
        'font-size': '15px',
        'color': '#C1C2C4',
        'border-left-color': '#CED0D4',
        'border-left-width': '4px',
        'border-left-style': 'solid',
        'padding-left': '16px'
    },
    link: {
        'font-size': '15px',
        'color': '#2E86FF',
        'text-decoration': 'none',
        'linkHover': {
            'color': '#2E86FF',
            'text-decoration': 'underline'
        },
    },
    ul: {
        'color': '#ffffff',
        'padding-left': '14px',
        'margin-bottom': '15px',
        'margin-top': '15px'
    },
    ol: {
        'color': '#ffffff',
        'padding-left': '14px',
        'margin-bottom': '15px',
        'margin-top': '15px' 
    },
    code: {
        'margin-top' : '8px',
        'margin-bottom' : '8px',
        'background-color': '#a5a5a588',
        'font-size': '13px'
    }
}