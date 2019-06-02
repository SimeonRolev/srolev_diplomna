const axios = require('axios');
 
const glosbeApi = axios.create({
    baseURL: 'https://glosbe.com/gapi',
    timeout: 2000
});

class Glosbe {
    supports = ['bul']
    name = 'Glosbe'

    translate (word, from, to) {
        return new Promise(function (resolve, reject) {
            resolve(`1. Translation of ${word} by Glosbe`)
        });
    }

    _translate (word, from, to) {
        return glosbeApi.get('/translate', {
            params: {
                from: from,
                dest: to,
                phrase: word
            }
        })
    }

    parse () {
        // ?
    }
}

export default new Glosbe();
