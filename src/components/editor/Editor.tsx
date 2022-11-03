import React, { Component, ReactElement } from 'react';
import { useState } from 'react'


//import styles from 'styles/app.module.scss'
import styles from 'styles/app.module.scss'

import ButtonEditor from './ButtonEditor';

interface IProps { }

interface IState {
    boldButton: any
}



export default class Editor extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        //console.log("constructor")
        super(props);
        this.state = { boldButton: false }
    }

    render() {
        //console.log("render : " + this.state.boldButton);
        return <div>
            <ButtonEditor func={this.setToBold.bind(this)} state={this.state.boldButton} />
            <div className={styles.texteditor} contentEditable="true" onInput={this.getCaretIndex}></div>
        </div>;
    }

    getCaretIndex(element: React.ChangeEvent<HTMLDivElement>) {
        console.log("Element :" + element.target.innerHTML);
/*
        let position = 0;
        const isSupported = typeof window.getSelection !== "undefined";
        if (isSupported) {
            const selection = window.getSelection();
            if (selection!.rangeCount !== 0) {
                const range = window.getSelection()!.getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element.target);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                position = preCaretRange.toString().length;
            }
        }
        console.log("Caret Index :" + position);
        */
    }

    setToBold(element: React.MouseEvent<HTMLButtonElement>) {
        //console.log("Funct = setToBold()");
        element.preventDefault();
        
        const selection = window.getSelection();
        if (selection!.rangeCount == 0) {//TODO verify if this is the right way to check if there is a selection
            //console.log("No selection");
            return;
        }
        
        if (this.state.boldButton == false) {
            //console.log("add bold")
            this.setState({ boldButton: true });
            const range = selection!.getRangeAt(0);//TODO add management of multiple ranges
            const newNode = document.createElement("b");
            newNode.appendChild(range.extractContents());
            if (newNode.innerHTML == "") {
                //console.log("node is empty");
                newNode.innerHTML = '\&#8203';//TODO correct chrome bug
            }

            range.insertNode(document.createTextNode(' '));//TODO correct chrome bug
            range.insertNode(newNode);

        }
        else {
            //console.log("remove bold");
            this.setState({ boldButton: false });
            const range = selection!.getRangeAt(0);//TODO add management of multiple ranges
            
            let newRange = document.createRange();
            console.log("range.startContainer" + range.startContainer);
            console.log("range.startOffset : " + range.startOffset);
            console.log(range.endContainer);
            console.log("range.endOffset : " + range.endOffset);
            //newRange.setStart(range.endContainer.parentNode!.parentNode!.childNodes[4],0);
            newRange.collapse(true);

            
            selection?.removeAllRanges();
            selection?.addRange(newRange);
        }
       
    }


}
