import React from 'react';
import ReactDOM from 'react-dom';
import Scanner from './components/Scanner';
import ScannerMatches from './components/ScannerMatches';
import { $, jQuery } from 'jquery';
import './style/scanner.js'

const scanAppRoot = document.createElement('div');
scanAppRoot.id = "scanner-root";
document.body.appendChild(scanAppRoot);

const scanMatchesRoot = document.createElement('div');
scanMatchesRoot.id = "scanner-matches-root";
document.body.appendChild(scanMatchesRoot);

const markScript = document.createElement('script');
markScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"
markScript.charset = "UTF-8"
document.body.appendChild(markScript);

window.$ = $;
window.jQuery = jQuery;

try {
    // eslint-disable-next-line no-undef
    const marker = new Mark(document.body.querySelectorAll('*:not(script):not(noscript)'))
    const myWords = ['fall', 'reverse'];

    const scannerPopup = ReactDOM.render(<Scanner />, scanAppRoot);
    let matches = {}

    myWords.forEach(word => {
        marker.mark(word, {
            className: 'mark-highlight--page',
            each: (elem) => {
                if (matches[word]) {
                    matches[word].push(elem)
                } else {
                    matches[word] = [elem]
                }

                elem.onclick = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    elem.scrollIntoView({block: 'end', behavior: 'smooth'});
                    scannerPopup.setWord(elem.innerText);
                }
            },
            done: () => {
                console.log(matches);
                ReactDOM.render(<ScannerMatches matches={matches} />, scanMatchesRoot);
            }
        });
    })
} catch (error) {
    console.log('Error with marking: ', error);
}
