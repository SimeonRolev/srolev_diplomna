import React from 'react';
import ReactDOM from 'react-dom';
import ScannerMatches from './components/ScannerMatches';
import { $, jQuery } from 'jquery';
import './style/scanner.js'

const scanAppRoot = document.createElement('div');
scanAppRoot.id = "scanner-root";
document.body.appendChild(scanAppRoot);

// const markScript = document.createElement('script');
// markScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"
// markScript.charset = "UTF-8"
// document.body.appendChild(markScript);

// const jQueryScript = document.createElement('script');
// jQueryScript.src = "https://code.jquery.com/jquery-1.11.3.min.js"
// jQueryScript.charset = "UTF-8"
// document.head.appendChild(jQueryScript);

window.$ = $;
window.jQuery = jQuery;

function scrollIntoViewIfNeeded(target) {
    var rect = target.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
        // target.scrollIntoView(false);
        target.scrollIntoView({behavior: 'smooth'});
    }
    if (rect.top < 0) {
        target.scrollIntoView({behavior: 'smooth'});
    } 
}

function getWords () {
    // eslint-disable-next-line no-undef
    return window.$.ajax({
        type: "POST",
        dataType: "json",
        data: {action: 'getWords'},
        contentType: "application/json",
        url: "http://127.0.0.1:5000/",
        crossDomain: true
    })
}


setTimeout(() => {try {
    // Expand the script so it matches more non-ui elems and describe it in the text
    getWords().done(data => {
        const myWords = data.map(translation => translation.word)
        // eslint-disable-next-line no-undef
        const marker = new Mark(document.body.querySelectorAll('*:not(script):not(noscript)'))
    
        let scannerPopup = null;    
        let matches = {}
        let currentMatch = null;
    
        function selectCurrentMatch (elem) {
            if (currentMatch) {
                currentMatch.classList.remove('heavy')
                currentMatch.classList.add('light')
            }
            elem.classList.add('heavy')
            elem.classList.remove('light')
            currentMatch = elem;
        }
    
        myWords.forEach(word => {
            marker.mark(word, {
                className: 'mark-highlight--page light',
                each: (elem) => {
                    if (matches[word]) {
                        matches[word].push(elem)
                    } else {
                        matches[word] = [elem]
                    }
    
                    elem.onclick = function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        scrollIntoViewIfNeeded(elem);
                        selectCurrentMatch(elem);
                        const occurrenceIndex = matches[word].indexOf(elem);
                        scannerPopup.setExternal({ word, occurrenceIndex });
                    }
                }
            });
        })
        scannerPopup = ReactDOM.render(<ScannerMatches words={data} matches={matches} />, scanAppRoot)
    }).fail(err => {console.log('error', err)});
} catch (error) {
    console.log('Error with marking: ', error);
}}, 2000)
