import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import NavigateNext from '@material-ui/icons/NavigateNext';   
import NavigateBefore from '@material-ui/icons/NavigateBefore';   
import Button from '@material-ui/core/Button';

import WordPreviewer from './WordPreviewer';
import { Typography } from '@material-ui/core';

class ScannerMatches extends Component {
    state = {
        indexes: {
            [this.props.word]: this.props.occurrenceIndex
        },
        word: this.props.word,
        expanded: true
    }

    getMatchIndex = (word) => {
        return this.state.indexes.hasOwnProperty(word)
            ? this.state.indexes[word]
            : -1
    }

    getClickEvent = (word, index) => {
        const i = index ? index : this.getMatchIndex(word);
        return this.props.matches[word][i].onclick
    }

    handleSetWord = (event) => {
        this.handleNext(event, event.target.value)
    }

    handleNext = (event, word) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            event.nativeEvent.stopImmediatePropagation();
        } catch {}

        const index = this.getMatchIndex(word);
        const occurrances = this.props.matches[word].length;

        this.setState(oldState => {
            const newIndex = index < occurrances - 1
                ? index + 1
                : index;
            return { indexes: Object.assign(oldState.indexes, { [word]: newIndex }) } 
        }, () => setTimeout( () => this.getClickEvent(word)(event), 0))
    }

    handlePrev = (event, word) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            event.nativeEvent.stopImmediatePropagation();
        } catch {}

        const index = this.getMatchIndex(word);

        this.setState(oldState => {
            const newIndex = index
                ? index - 1
                : index;
            return { indexes: Object.assign(oldState.indexes, { [word]: newIndex }) } 
        }, () => this.getClickEvent(word)(event))
    }

    toggleExpand = () => {
        this.setState(({ expanded }) => ({ expanded: !expanded }), () => console.log(this.state.expanded))
    }

    close = () => {
        this.props.unmountSelf();
    }

    render () {
        const { word, expanded } = this.state;
        const currentOccurrence = this.state.indexes[word];
        const occurrencesCount = this.props.matches[word].length;

        return word ?
            <Card style={{ 
                position: "relative",
                margin: 10,
                backgroundColor: 'white'
            }}>
                <CardActions disableSpacing>
                    <IconButton
                        aria-expanded={expanded}
                        onClick={ this.toggleExpand }
                        aria-label="Expand"
                    >
                        <NavigateNext />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto">
                    <CardContent>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FormControl style={{ flex: 1 }}>
                                <InputLabel htmlFor="detected-occurs">You have seen these before:</InputLabel>
                                <Select
                                    value={this.state.word}
                                    onChange={ this.handleSetWord }
                                    inputProps={{
                                        id: 'detected-occurs'
                                    }}
                                >
                                    { Object.keys(this.props.matches).map(word => <MenuItem key={word} value={word}>{word}</MenuItem>) }
                                </Select>
                            </FormControl>

                            <IconButton id='navigate-prev' onClick={ event => this.handlePrev(event, word) } edge="start" aria-label="Previous">
                                <NavigateBefore />
                            </IconButton>
                            
                            <Typography id='occurrence-number' style={{ fontSize: 14 }} color="textSecondary">
                                { currentOccurrence + 1 } / { occurrencesCount } 
                            </Typography>
                            
                            <IconButton id='navigate-next' onClick={ event => this.handleNext(event, word) } edge="end" aria-label="Next">
                                <NavigateNext />
                            </IconButton>
                        </div>

                        <WordPreviewer words={this.props.words} word={ this.state.word } />
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.close}
                            style={{ float: 'right' }}
                        >
                            Close
                        </Button>
                    </CardContent>
                </Collapse>
            </Card> : null;
    }
}

ScannerMatches.propTypes = {

};


class Wrapper extends React.Component {
    constructor(props) {
        super(props)
        this.verified = this.props.matches && Object.keys(this.props.matches).length
        this.state = {
            word: this.verified ? Object.keys(this.props.matches)[0] : null,
            occurrenceIndex: 0,
            renderChild: this.verified
        };
        this.handleChildUnmount = this.handleChildUnmount.bind(this);
    }

    setExternal = (state) => {
        this.setState({
            ...state,
            renderChild: true
        });
    }

    handleChildUnmount = () => {
        this.setState({renderChild: false});
    }

    render () {
        return (this.state.renderChild && this.state.word)
            ? <ScannerMatches
                key={`${this.state.word}${this.state.occurrenceIndex}`}
                word={this.state.word}
                occurrenceIndex={this.state.occurrenceIndex}
                { ...this.props }
                unmountSelf={this.handleChildUnmount}
            />
            : null
    }
}

export default Wrapper;
export { ScannerMatches };