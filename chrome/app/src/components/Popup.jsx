/* global chrome */

import React, { Component } from 'react';
import { notify } from '../notify';
import search from '../translate/aggregator';

class Popup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            word: '',
            url: '',
            notes: '',
            translations: [],
            selectedTranslation: null,
            loading: false
        }
        this.receivers = {
            'getSelection': this.onGetSelection
        }
    }

    componentDidMount () {
        // chrome.runtime.onMessage.addListener(this.messageHandler)
        notify('getSelection')
    }
    
    messageHandler = (message, sender, sendResponse) => {
        const action = message.action.split('.')[1]
        if (message.action.split('.')[0] === 'background') {
            this.receivers[action].call(this, message)
        }
    }

    translate = () => {
        const word = 'test';
        // Detect language
        const from = 'eng'
        const to = 'bul'

        // Search in the dictionary aggregator (Elastic search first ?)
        search(word, from, to).then(results => {
            console.log(results)
            this.setState({
                translations: results,
                loading: false
            })
        })
    }

    onGetSelection = (message) => {
        const word = message.word;
        
        if (word) {
            this.setState({
                word: word,
                url: message.url,
                loading: true
            })

            this.translate();
            // Suggest notes?
        } else {
            notify('noSelectionFound')
        }
    }

    selectTranslation = (name) => {
        this.setState({selectTranslation: name})
    }

    save = () => {
        notify('saveWord')
    }

    render () {
        const { word, url, notes, translations, selectedTranslation } = this.state;

        return <div>
            <h3>Word:</h3>
            <div id='word'>{word}</div>
            <h3>Url:</h3>
            <div id='url'>{url}</div>
            <h3>Translations:</h3>
            {
                translations.map(t => (
                    <div onClick={ () => this.selectTranslation(t.name) }>
                        <h4>{ t.name }</h4>
                        <p>{ t.result }</p>
                    </div>
                ))
            }


            <textarea id='translations' defaultValue={selectedTranslation && translations[selectedTranslation].result}></textarea>
            <h3>Notes:</h3>
            <textarea id='notes' defaultValue={notes}></textarea>
            
            <button onClick={this.save}>Save</button>
            <button onClick={this.translate}>Translate</button>
        </div>
    }
}

export default Popup;
