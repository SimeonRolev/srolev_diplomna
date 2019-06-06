import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import IconButton from '@material-ui/core/IconButton';
import NavigateNext from '@material-ui/icons/NavigateNext';   
import NavigateBefore from '@material-ui/icons/NavigateBefore';   
import Button from '@material-ui/core/Button';

import WordPreviewer from './WordPreviewer';

class ScannerMatches extends Component {
    state = {
        indexes: {
            [this.props.word]: 0
        },
        word: this.props.word
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

    handleMatchClick = (event, word) => {
        const firstOccurence = this.props.matches[word][2];
        firstOccurence.onclick(event);
    }

    handleSetWord = (event) => {
        this.handleNext(event, event.target.value)
    }

    handleNext = (event, word) => {
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

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
        event.nativeEvent.stopImmediatePropagation();

        const index = this.getMatchIndex(word);

        this.setState(oldState => {
            const newIndex = index
                ? index - 1
                : index;
            return { indexes: Object.assign(oldState.indexes, { [word]: newIndex }) } 
        }, () => this.getClickEvent(word)(event))
    }

    close = () => {
        this.props.unmountSelf();
    }

    render () {
        const { word } = this.state;

        return word ?
        <Card style={{ position: "relative", margin: 10, backgroundColor: 'white' }}>
            <CardContent>
                <div style={{ display: 'flex' }}>
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

                    <IconButton onClick={ event => this.handlePrev(event, word) } edge="start" aria-label="Previous">
                        <NavigateBefore />
                    </IconButton>
                    <IconButton onClick={ event => this.handleNext(event, word) } edge="end" aria-label="Next">
                        <NavigateNext />
                    </IconButton>
                </div>

                <WordPreviewer word={ this.state.word } />
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={this.close}
                    style={{ float: 'right' }}
                >
                    Close
                </Button>
            </CardContent>
        </Card> : null;
    }
}

ScannerMatches.propTypes = {

};


class Wrapper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            word: Object.keys(this.props.matches)[0],
            renderChild: true
        };
        this.handleChildUnmount = this.handleChildUnmount.bind(this);
    }

    shouldComponentUpdate (nextProps, nextState) {
        const result = this.state.word !== nextState.word || this.state.renderChild !== nextState.renderChild
        return result;
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
            ? <ScannerMatches key={this.state.word} word={this.state.word} { ...this.props } unmountSelf={this.handleChildUnmount} />
            : null
    }
}

export default Wrapper;