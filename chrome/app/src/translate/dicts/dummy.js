class Dummy {
    supports = ['bul']
    name = 'Dummy'

    translate (word, from, to) {
        return new Promise(function (resolve, reject) {
            resolve(`1. Translation of ${word} by Dummy`)
        });
    }

    parse () {
        // ?
    }
}

export default new Dummy();
