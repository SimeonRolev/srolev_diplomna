import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ScannerMatches extends Component {
    state = {
        indexes: {}
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
        return <div> {
            Object.keys(this.props.matches).map(word => {
                return <div key={word} onClick={ event => this.handleNext(event, word) }>
                    {word}
                    <button onClick={ event => this.handleNext(event, word) }>Next</button>
                    <button onClick={ event => this.handlePrev(event, word) }>Prev</button>
                </div>
            })
        }</div>

    }
}

ScannerMatches.propTypes = {

};

export default ScannerMatches;