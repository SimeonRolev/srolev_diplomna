/* global chrome */

import React, { Component } from 'react';

import { notify } from '../notify';
import search from '../translate/aggregator';
import Collection from '../tools/collection';
import WithLoading from '../components/Loading';
import iso6392 from 'iso-639-2';

const PopupContext = React.createContext(); 

const getUserBrowserLanguage = function () {
    const userLanguage6932 = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)
    const userLanguage6931 = iso6392.find(lang => lang.iso6391 === userLanguage6932.substring(0, 2)).iso6392B
    return userLanguage6931;
}

const detectWordLanguage = function (word) {
    return 'eng'
}

class Popup extends Component {

    constructor(props) {
        super(props)

        this.state = {
            word: null,
            from: 'eng', // Detect word language
            to: 'bgn', // getUserBrowserLanguage()
            translations: new Collection([], (item) => item.name),
            translation: '',
            url: null,
            notes: '',
            loading: false
        }
        this.receivers = {
            'getSelection': this.onGetSelection
        }
    }

    componentDidMount () {
        try {
            chrome.runtime.onMessage.addListener(this.messageHandler)
        } catch {
            console.log("Can't load chrome.runtime messages.")
        }
        notify('getSelection')
    }
    
    messageHandler = (message, sender, sendResponse) => {
        const action = message.action.split('.')[1]
        if (message.action.split('.')[0] === 'background') {
            this.receivers[action].call(this, message)
        }
    }

    translate = () => {
        this.setState({ loading: true })
        const { word, from, to } = this.state;

        search(word, from, to).then(results => {
            this.setState({
                translations: new Collection(results, (item) => item.name),
                loading: false
            }, () => results.length && this.selectTranslation(results[0].name))
        })
    }

    onGetSelection = (message) => {
        const word = message.word;
        
        if (word) {
            this.setState({
                word: word,
                from: detectWordLanguage(word),
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
        this.setState({ translation: event.target.value });
    }

    editNotes = (event) => {
        this.setState({ notes: event.target.value });
    }

    handleFromChange = (event) => {
        this.setState({ from: event.target.value }, this.translate)
    }

    handleToChange = (event) => {
        this.setState({ to: event.target.value }, this.translate)
    }

    save = () => {
        notify('saveWord')
    }

    static LanguagePreferences = (props) => {
        return <PopupContext.Consumer>
            {context => <div className='from-to-btns'>
                <label>
                    From:
                    <select value={context.from} onChange={props.handleFromChange}>
                        <option value='eng'>English</option>
                        <option value='bul'>Bulgarian</option>
                    </select>
                </label>
                <label>
                    To:
                    <select value={context.to} onChange={props.handleToChange}>
                        <option value='eng'>English</option>
                        <option value='bul'>Bulgarian</option>
                    </select>
                </label>
            </div>
            }
        </PopupContext.Consumer>
    }

    static WordContext = props => {
        return <PopupContext.Consumer>
            
        </PopupContext.Consumer>
    }

    renderContents = () => {
        const { word, url, notes, translation, translations } = this.state;

        return <PopupContext.Provider value={this.state}>
            <span>Word:</span>
            <div id='word'>{word}</div>

            <hr/>
            <Popup.LanguagePreferences
                handleFromChange={ this.handleFromChange }
                handleToChange={ this.handleToChange }
            />
            
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
            
            <hr/>
            <h3>Notes:</h3>
            <textarea 
                id='notes'
                value={notes}
                onChange={this.editNotes}
            ></textarea>
            
            <hr/>
            <span>Found at url:</span>
            <div id='url'>{url}</div>
            
            <hr/>
            <button onClick={this.save}>Save</button>
            <button onClick={this.translate}>Translate</button>
        </PopupContext.Provider>
    }


    render () {
        return <WithLoading loading={this.state.loading} render={this.renderContents}/>
    }
}

export default Popup;
