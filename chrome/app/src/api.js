import axios from 'axios';

export const api = {
    updateTranslation: function (wordId, trans) {
        return axios({
            method: 'post',
            data: {
                action: 'updateTranslation',
                wordId: wordId,
                trans: trans
            },
            url: "http://127.0.0.1:5000/"
        })
    },
    saveTranslation: function (user, word, trans, from, to, context, url) {
        return axios({
            method: 'post',
            url: "http://127.0.0.1:5000/",
            data: {
                action: 'saveTranslation',
                userId: user,
                word: word,
                trans: trans,
                from: from,
                to: to,
                context: context,
                url: url
            }
        })
    },
    saveContext: function (translationId, entry, url) {
        return axios({
            method: 'post',
            data: {
                action: 'saveContext',
                translationId: translationId,
                entry: entry,
                url: url
            },
            url: "http://127.0.0.1:5000/"
        })
    },
    getContexts: function (translationId) {
        return axios({
            method: 'post',
            data: {
                action: 'getContexts',
                translationId: translationId
            },
            url: "http://127.0.0.1:5000/"
        })
    },
    getWords: function (userId=1) {
        return axios({
            method: 'post',
            data: {action: 'getWords'},
            url: "http://127.0.0.1:5000/"
        })
    }
}
