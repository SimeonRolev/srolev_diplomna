/* global chrome */

import React, { Component } from 'react';
import { notify } from '../notify';

class Popup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            word: '',
            url: '',
            notes: ''
        }
    }

    componentDidMount () {
        chrome.runtime.onMessage.addListener(this.messageHandler)
        notify('getSelection')
    }

    messageHandler = (message, sender, sendResponse) => {
        console.log('App.js received a message: ', message)
    }

    fillInForm = (resp) => {
        if (resp.word) {
            this.setState({
                word: resp.word,
                url: resp.url
            })
        } else {
            notify('noSelectionFound')
        }
    }

    save = () => {
        notify('saveWord')
    }

    render () {
        const { word, url, notes } = this.state;

        return <div>
            <h3>Word:</h3>
            <div id='word'>{word}</div>
            <h3>Url:</h3>
            <div id='url'>{url}</div>
            <h3>Notes:</h3>
            <textarea id='notes'>{notes}</textarea>
            
            <button onClick={this.save}>Save</button>
        </div>
    }
}

export default Popup;
