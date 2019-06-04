import React from 'react';
import ReactDOM from 'react-dom';
import Scanner from './components/Scanner';
import { $, jQuery } from 'jquery';

const scanApp = document.createElement('div');
scanApp.id = "my-extension-root";
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
    marker.mark('Started', {
        each: (elem) => {
            console.log(elem)
            elem.onclick = function () {
                ReactDOM.render(<Scanner />, scanApp)
            }
        } 
    });
} catch (error) {
    console.log('Error with marking: ', error);
}
