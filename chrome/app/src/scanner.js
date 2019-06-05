import React from 'react';
import ReactDOM from 'react-dom';
import Scanner from './components/Scanner';
import { $, jQuery } from 'jquery';
import './style/scanner.js'

const scanApp = document.createElement('div');
scanApp.id = "scanner-root";
document.body.appendChild(scanApp);

const markScript = document.createElement('script');
markScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js"
markScript.charset = "UTF-8"
document.body.appendChild(markScript);

window.$ = $;
window.jQuery = jQuery;

try {
    // eslint-disable-next-line no-undef
    const marker = new Mark(document.body)
    const myWords = ['fall', 'reverse'];

    const scannerPopup = ReactDOM.render(<Scanner />, scanApp);

    myWords.forEach(word => {
        marker.mark(word, {
            className: 'mark-highlight--page',
            each: (elem) => {
                elem.onclick = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    scannerPopup.setWord(elem.innerText);
                }
            } 
        });
    })
} catch (error) {
    console.log('Error with marking: ', error);
}
