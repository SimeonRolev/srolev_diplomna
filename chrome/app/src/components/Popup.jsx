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
        this.receivers = {
            'getSelection': this.onGetSelection
        }
    }

    componentDidMount () {
        chrome.runtime.onMessage.addListener(this.messageHandler)
        notify('getSelection')
    }
    
    messageHandler = (message, sender, sendResponse) => {
        const action = message.action.split('.')[1]
        if (message.action.split('.')[0] === 'background') {
            this.receivers[action].call(this, message)
        }
    }

    onGetSelection = (message) => {
        if (message.word) {
            this.setState({
                word: message.word,
                url: message.url
            })
        } else {
            // notify('noSelectionFound')
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
