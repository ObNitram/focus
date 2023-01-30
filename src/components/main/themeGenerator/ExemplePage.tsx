import styles from 'styles/components/main/themeGenerator/exemplePage.module.scss'
import crossEditorStyles from 'styles/components/editor/editor.module.scss'

export function ExemplePage(this:any) {
    return(
        <div className={styles.exemplePage + ' editor_general ' +crossEditorStyles.editor_inner_input}>
            <div className={`${crossEditorStyles.editor_inner_input}` }>
                <h1 className={`editor_h1 ltr`} dir="ltr"><span >I am a title 1</span></h1>
                
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <span >Lorem ipsum dolor sit amet consectetur </span>
                    <strong className="editor_bold" >adipisicing </strong>
                    <span >elit. Aperiam, est omnis officiis enim mollitia aliquam natus atque </span>
                    <em className="editor_italic">expedita </em>
                    <span>ipsa autem facilis possimus blanditiis saepe labore alias libero velit quaerat deleniti modi optio, quis sequi! Similique velit dolor voluptas cupiditate esse!</span>
                </p>
                
                <h2 className="editor_h2 ltr" dir="ltr"><span>I am a Title 2</span></h2>
                
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <span >Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum </span>
                    <em className="editor_italic" >corporis</em>
                    <span >, maiores illum eligendi quis explicabo</span>
                </p>
                
                <ul className="editor_ul">
                    <li value="1" className="ltr" dir="ltr"><span >An exemple</span></li>
                    <li value="2" className="ltr" dir="ltr"><span >A another li exemple</span></li>
                    <li value="3" className="ltr" dir="ltr"><span >A third li item</span></li>
                </ul>
                
                <h2 className="editor_h2 ltr" dir="ltr"><span >A second h2</span></h2>

                <ol className="editor_ol">
                    <li value="1" className="ltr" dir="ltr"><span>Ordered li 1</span></li>
                    <li value="2" className="ltr" dir="ltr"><span>Ordered li 2</span></li>
                    <li value="3" className="ltr" dir="ltr"><span>Ordered li 4</span></li>
                </ol>
                
                <h3 className="editor_h3 ltr" dir="ltr"><span >A first h3</span></h3>
                
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <span >Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sed eaque sequi accusantium! Voluptatum aperiam, perferendis totam pariatur quisquam nostrum dignissimos dolor! Voluptate unde, placeat sequi nemo illo culpa.</span>
                </p>
                
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <span >A paragraph with a link ! : </span>
                    <a href="https://www.google.com" className="editor_link ltr" dir="ltr"><span >www.google.com</span></a>
                </p>
                
                <h3 className="editor_h3 ltr" dir="ltr"><span >A second h3</span></h3>

                <blockquote className="editor_quote ltr" dir="ltr"><span data-lexical-text="true">Bonjour ceci est une quote, </span><br/><span >Elle fait plusieurs lignes c'est cool.</span></blockquote>
                
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <span >Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sed eaque sequi accusantium! </span>
                    <strong className="editor_bold" >Voluptatum </strong>
                    <span >aperiam, perferendis totam pariatur quisquam nostrum dignissimos dolor! </span>
                    <strong className="editor_bold" >Voluptate </strong>
                    <span >unde, placeat sequi nemo illo culpa.Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sed eaque sequi accusantium! Voluptatum aperiam, perferendis totam pariatur </span>
                    <em className="editor_italic" >quisquam </em>
                    <span >nostrum dignissimos dolor! Voluptate unde, placeat sequi nemo illo culpa.</span>
                </p>
                
                <h1 className="editor_h1 ltr" dir="ltr"><span >A second H1</span></h1>
                <h2 className="editor_h2 ltr" dir="ltr"><span >Its a h2 !</span></h2>
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <span className={`editor_underline`}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</span>
                    <span > Culpa sed eaque sequi accusantium! Voluptatum aperiam, perferendis totam pariatur quisquam nostrum dignissimos dolor! Voluptate unde, placeat sequi nemo illo culpa.Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa sed eaque sequi accusantium! Voluptatum aperiam, perferendis totam pariatur quisquam nostrum dignissimos dolor! Voluptate unde, placeat sequi nemo illo culpa.</span>
                </p>
                
                <h4 className="editor_h4 ltr" dir="ltr"><span >This is a h4 !</span></h4>
                
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <strong className="editor_bold" >An entire bold sentence !</strong>
                </p>
                
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <em className="editor_italic" >An entire italic sentence !</em>
                </p>
                
                <p className={`editor_paragraph ltr`} dir="ltr">
                    <span className={`editor_underline`}>An entire underline sentence !</span>
                </p>
                
                <h5 className="editor_h5 ltr" dir="ltr"><span >This is a h5 ! </span></h5>
                
                <h6 className="editor_h6 ltr" dir="ltr"><span >This is a h6 !</span></h6>
                </div>
        </div>
    )
}