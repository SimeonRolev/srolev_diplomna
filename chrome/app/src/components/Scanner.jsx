// When a page is opened scan for words
// Show popup over the word
// Suggest adding a new context

// Make build export this to the build folder somewhere without hash
// Add it to the manifest.json as content script

import React, { Component } from 'react';

class Context {
    constructor (data) {
        const { url, notes } = data;
        this.url = url;
        this.notes = notes;
    }
}

class Scanner extends Component {
    constructor (props) {
        super(props);
        this.state = { 
            visible: false,
            word: null,
            translation: 'Translation text',
            contexts: [
                new Context({ url: 'testURL1', notes: 'Example Notes'}),
                new Context({ url: 'testURL2', notes: 'Example Notes2'}),
                new Context({ url: 'testURL3', notes: 'Example Notes3'})
            ]
        }
    }

    // Translate this word
    searchTranslation () {
    }

    // Search for context of this word
    searchContexts () { 
    }

    render() {
        return (
            <div>
                {
                    this.state.contexts.map((context, index) => {
                        return <div key={index}>
                            <div>{context.notes}</div>
                            <div>{context.url}</div>
                        </div>
                    })
                }
            </div>
        );
    }
}

Scanner.propTypes = {

};

export default Scanner;