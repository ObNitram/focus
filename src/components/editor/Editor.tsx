import React, { Component } from 'react';
import { useState } from 'react'


//import styles from 'styles/app.module.scss'
import styles from 'styles/app.module.scss'




const doc = [{ "type": "h1", "value": "Hello world in h1" },
{ "type": "h2", "value": "Hello world in h2" },
{ "type": "text", "value": "Hello world" },];


const Editor: React.FC = () => {

    return <div>
        <input type="button" value="G" onMouseDown={setToBold}/>
        <input type="button" value="I" />
        <input type="button" value="S" />
        <div className={styles.texteditor} contentEditable="true" onInput={getCaretIndex}></div>
    </div>;

}

export default Editor

function getCaretIndex(element: React.ChangeEvent<HTMLDivElement>) {
    console.log("Element :" + element.target.innerHTML);

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
}

function setToBold(element: React.MouseEvent<HTMLInputElement>) {
    element.preventDefault()
    console.log("Bold");

    const selection = window.getSelection();
    const range = selection!.getRangeAt(0);
    const newNode = document.createElement("b");
    newNode.appendChild(range.extractContents());
    range.insertNode(newNode);
   
}

function Components(item: any) {
    switch (item.type) {
        case "h1":
            return <h1>{item.value}</h1>
        case "h2":
            return <h2>{item.value}</h2>
        case "text":
            return <p>{item.value}</p>
        default:
            return <p>{item.value}</p>
    }
}

