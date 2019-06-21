/* global chrome */

import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import lightBlue from '@material-ui/core/colors/lightBlue';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { notify } from '../notify';
import search from '../translate/aggregator';
import Collection from '../tools/collection';
import WithLoading from './Loading';
import iso6392 from 'iso-639-2';

const PopupContext = React.createContext(); 

const getUserBrowserLanguage = function () {
    const userLanguage6932 = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)
    const userLanguage6931 = iso6392.find(lang => lang.iso6391 === userLanguage6932.substring(0, 2)).iso6392B
    return userLanguage6931;
}

// TODO
const detectWordLanguage = function (word) {
    return 'eng'
}

const TranslationItem = ({ selected, name, result, selectTranslation }) => {
    return (
        <ListItem
            key={name}
            onClick={ () => selectTranslation(name) }
            style={{ backgroundColor: selected ? lightBlue[100] : 'transparent' }}
        >
            <ListItemText
                primary={name}
                secondary={result}
            ></ListItemText>
        </ListItem>
    )
}

class Translator extends Component {

    constructor(props) {
        super(props)

        this.state = {
            word: 'test',
            from: 'eng', // Detect word language
            to: 'bul', // getUserBrowserLanguage()
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
                <FormControl>
                    <InputLabel htmlFor="from-select">From</InputLabel>
                    <Select
                        value={context.from}
                        onChange={props.handleFromChange}
                        inputProps={{
                            id: 'from-select',
                        }}
                    >
                        <MenuItem value={'eng'}>English</MenuItem>
                        <MenuItem value={'bul'}>Bulgarian</MenuItem>
                    </Select>
                </FormControl>
                
                <FormControl>
                    <InputLabel htmlFor="to-select">To</InputLabel>
                    <Select
                        value={context.to}
                        onChange={props.handleToChange}
                        inputProps={{
                            id: 'to-select',
                        }}
                    >
                        <MenuItem value={'eng'}>English</MenuItem>
                        <MenuItem value={'bul'}>Bulgarian</MenuItem>
                    </Select>
                </FormControl>
            </div>
            }
        </PopupContext.Consumer>
    }

    renderContents = () => {
        const { word, url, translations } = this.state;

        return (
            <Card style={{ width: 420 }}>
                <CardContent>
                    <PopupContext.Provider value={this.state}>
                        <Typography variant="h5" component="h2">{ word }</Typography>

                        <br />

                        <Translator.LanguagePreferences
                            handleFromChange={ this.handleFromChange }
                            handleToChange={ this.handleToChange }
                        />

                        <List
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Translations:
                                </ListSubheader>
                            }
                        >
                            {
                                translations.items.map(t => (
                                    <TranslationItem
                                        selected={t.selected}
                                        name={t.item.name}
                                        result={t.item.result}
                                        selectTranslation={ () => this.selectTranslation(t.item.name) }
                                    />
                                ))
                            }
                        </List>

                        <TextField
                            label="Translation"
                            multiline
                            rowsMax="10"
                            value={this.state.translation}
                            onChange={this.editTranslation}
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />

                        <Divider />

                        <TextField
                            label="In what context did you see this word?"
                            multiline
                            rowsMax="10"
                            value={this.state.notes}
                            onChange={ this.editNotes }
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        />
                        
                        <span>Found at url:</span>
                        <Link color="textSecondary" target='_blank' href={url}>{url}</Link>
                        <br />
                        
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={this.save}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.translate}
                            style={{ float: 'right' }}
                        >
                            Translate
                        </Button>

                    </PopupContext.Provider>
                </CardContent>
            </Card>
        )
    }


    render () {
        return <WithLoading loading={this.state.loading} render={this.renderContents}/>
    }
}

export default Translator;
