
interface IProps {
    func: any;
    state: boolean;
}
interface IState {
}

function ButtonEditor(props: IProps) {
    //console.log("ButtonEditor");
    return <button id='buttonBold' onMouseDown={props.func}>{props.state ? <b>G</b> : 'g'}</button>;
}


export default ButtonEditor;