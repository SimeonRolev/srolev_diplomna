/* global chrome */

import React, { Component } from 'react';
import { notify } from '../notify';
import search from '../translate/aggregator';
import Collection from '../tools/collection';

class Popup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            word: '',
            url: '',
            notes: '',
            translations: new Collection([], (item) => item.name),
            translation: '',
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
        this.setState({
            loading: true
        })

        const word = 'test';
        const from = 'eng' // Detect language
        const to = 'bul'

        // Search in the dictionary aggregator (Elastic search first ?)
        search(word, from, to).then(results => {
            this.setState({
                translations: new Collection(results, (item) => item.name),
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
        const item = this.state.translations.select(name);
        this.setState({ 
            translations: this.state.translations,
            translation: item.item.result 
        })
    }

    editTranslation = (event) => {
        this.setState({
            translation: event.target.value
        });
    }

    save = () => {
        notify('saveWord')
    }

    render () {
        const { word, url, notes, translation, translations } = this.state;

        return <div>
            <h3>Word:</h3>
            <div id='word'>{word}</div>
            <h3>Url:</h3>
            <div id='url'>{url}</div>
            <h3>Translations:</h3>
            {
                translations.items.map(t => (
                    <div 
                        key={t.item.name}
                        onClick={ () => this.selectTranslation(t.item.name) }
                        style={{ backgroundColor: t.selected ? 'green' : 'transparent' }}
                    >
                        <h4>{ t.item.name }</h4>
                        <p>{ t.item.result }</p>
                    </div>
                ))
            }

            <textarea 
                id='translations'
                value={translation}
                onChange={this.editTranslation}
            ></textarea>
            
            <h3>Notes:</h3>
            <textarea id='notes' defaultValue={notes}></textarea>
            
            <button onClick={this.save}>Save</button>
            <button onClick={this.translate}>Translate</button>
        </div>
    }
}

export default Popup;
