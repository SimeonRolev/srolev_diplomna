// When a page is opened scan for words
// Show popup over the word
// Suggest adding a new context

// Make build export this to the build folder somewhere without hash
// Add it to the manifest.json as content script

import React, { Component } from 'react';
import '../style/scanner';
import Highlighter from "react-highlight-words";

import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
            context: ''
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
    
    loadWord () {
        // Call api here
        this.setState({
            translation: 'Translation of word ' + this.props.word,
            prevContexts: [
                new Context({ url: 'https://example.com', notes: `Once upon a time you have found ${this.props.word} somewhere so you cant check it out again here ...`}),
                new Context({ url: 'https://example.com', notes: `Once upon a time you have found ${this.props.word} somewhere so you cant check it out again here ...`}),
                new Context({ url: 'https://example.com', notes: `Once upon a time you have found ${this.props.word} somewhere so you cant check it out again here ...`}),
            ]
        })
    }

    close = () => {
        this.props.unmountSelf();
    }

    render () {
        return (
            <Card style={{ position: "relative", margin: 10, backgroundColor: 'white' }}>
                <CardContent>
                    <Typography style={{ fontSize: 14 }}
                        color="textSecondary"
                        gutterBottom
                    >
                        You have seen this before!
                    </Typography>

                    <Typography variant="h5" component="h2">{ this.props.word }</Typography>

                    <TextField
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
                    <Button variant="outlined" color="primary">
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={this.close}
                        style={{ float: 'right' }}
                    >
                        Close
                    </Button>
                </CardContent>
            </Card>
        );
    }
}

class Wrapper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            word: null,
            renderChild: true
        };
        this.handleChildUnmount = this.handleChildUnmount.bind(this);
    }

    setWord = (word) => {
        this.setState({
            word: word,
            renderChild: true
        });
    }

    handleChildUnmount () {
        this.setState({renderChild: false});
    }

    // BUG: click on one word and without closing the popup, click on another
    // Only the word gets updated, but the inner contents of the popup don't
    render () {
        return (this.state.renderChild && this.state.word)
            ? <WordPreviewer word={ this.state.word } unmountSelf={this.handleChildUnmount} />
            : null
    }
}

export default Wrapper;