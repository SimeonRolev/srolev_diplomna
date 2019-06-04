import glosbe from './dicts/glosbe';
import dummy from './dicts/dummy';

const dicts = {
    'eng': [glosbe, dummy], // List of axios instances
    'bul': []
}

const search = function (word, from , to) {
    return Promise.all(dicts[from].map(dictInstance => {
        if (dictInstance.supports.includes(to)) {
            return dictInstance.translate(word, from, to).then(res => ({
                name: dictInstance.name,
                result: res
            }))
        }
        return new Promise((resolve, reject) => {
            resolve([])
        });
    }))
}

export default search;
