// When a page is opened scan for words
// Show popup over the word
// Suggest adding a new context

// Make build export this to the build folder somewhere without hash
// Add it to the manifest.json as content script

import React, { Component } from 'react';
import '../style/scanner';
import { translations, contexts } from '../api';
import { notify } from '../notify';
import Highlighter from "react-highlight-words";

import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Context {
    constructor (data) {
        const { url, notes } = data;
        this.url = url;
        this.notes = notes;
    }
}

// TODO: highlight the word
const ContextItem = ({ data }) => {
    const { word, notes, url } = data;
    return <ListItem>
        <ListItemText
            className='prev-note'
            primary={ 
                <Highlighter
                    searchWords={[ word ]}
                    textToHighlight={notes}
                    highlightClassName='mark-highlight--note'
                >
                </Highlighter>
            }
            secondary={ 
                <Link color="textSecondary" target='_blank' href={url}>{url}</Link>
            }
        >
        </ListItemText>
    </ListItem>
};

class WordPreviewer extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            translation: '',
            prevContexts: [],
            context: 'example context'
        }
    }

    componentDidMount () {
        this.loadWord()
    }
    
    componentDidUpdate (nextProps, nextState) {
        if (this.props.word !== nextProps.word) {
            this.loadWord()
        }
    }

    getWordId = () => {
        return this.props.words.find(item => item.word === this.props.word).id
    }

    getWordTranslation = () => {
        return this.props.words.find(item => item.word === this.props.word).trans
    }
    
    loadWord = () => {
        const translationId = this.getWordId()

        return translations.get(translationId).then(({ data: translationData }) => {
            contexts.get(translationId).then(({ data: contextsData }) => {
                this.setState({ 
                    translation: translationData.trans,
                    prevContexts: contextsData.map(c => new Context({ url: c.url, notes: c.entry }))
                })
            })
        })
    }

    save = () => {
        // notify('saveContext', null, {word: this.props.word})
        translations.update(this.getWordId(), { trans: this.state.translation })
            .then(({data}) => {
                contexts.create({
                    translationId: data.id,
                    entry: this.state.context,
                    url: window.location.href
                }).then(() => {
                    this.loadWord()
                })
            })
            .catch((err) => {
                console.log(err);
                // notify('saveWordFaild', null, {word: this.state.word})
            })
    }

    render () {
        return (
            <React.Fragment>
                <TextField
                    id='translation-field'
                    label="Translations"
                    multiline
                    rowsMax="10"
                    value={this.state.translation}
                    onChange={ e => this.setState({ translation: e.target.value }) }
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                
                <Typography style={{ fontSize: 14 }}
                    color="textSecondary"
                    gutterBottom
                >
                    Saved usages:
                </Typography>
                
                <List style={{ maxHeight: '250px', overflow: 'auto' }}>
                {
                    this.state.prevContexts.map((context, index) => {
                        return <React.Fragment key={index} >
                            <ContextItem data={{ word: this.props.word, ...context }} />
                            <Divider />
                        </React.Fragment>
                    })
                }
                </List>
                
                <TextField
                    id='context-field'
                    label="Add new context:"
                    multiline
                    rowsMax="10"
                    value={this.state.context}
                    onChange={ e => this.setState({ context: e.target.value }) }
                    margin="normal"
                    variant="outlined"
                    fullWidth
                />
                
                <br />
                <Button 
                    variant="outlined"
                    color="primary"
                    disabled={!this.state.context}
                    onClick={this.save}>
                    Save
                </Button>
            </React.Fragment>
        );
    }
}

export default WordPreviewer;