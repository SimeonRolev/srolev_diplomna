import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import IconButton from '@material-ui/core/IconButton';
import NavigateNext from '@material-ui/icons/NavigateNext';   
import NavigateBefore from '@material-ui/icons/NavigateBefore';   

class ScannerMatches extends Component {
    state = {
        indexes: {},
        word: Object.keys(this.props.matches)[0]
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
        }, () => this.getClickEvent(word)(event))
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

    render () {
        const { word } = this.state;

        return <div>
                <FormControl>
                    <InputLabel htmlFor="detected-occurs">Do you remember these?</InputLabel>
                    <Select
                        value={this.state.word}
                        onChange={ e => this.setState({ word: e.target.value }) }
                        inputProps={{
                            id: 'detected-occurs'
                        }}
                    >
                        { Object.keys(this.props.matches).map(word => <MenuItem key={word} value={word}>{word}</MenuItem>) }
                    </Select>
                </FormControl>

                <br />
                <IconButton onClick={ event => this.handlePrev(event, word) } edge="start" aria-label="Previous">
                    <NavigateBefore />
                </IconButton>
                <IconButton onClick={ event => this.handleNext(event, word) } edge="end" aria-label="Next">
                    <NavigateNext />
                </IconButton>
        </div>
    }
}

ScannerMatches.propTypes = {

};

export default ScannerMatches;