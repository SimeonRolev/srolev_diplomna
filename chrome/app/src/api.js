import $ from 'jquery';

window.$ = $;

export const api = {
    updateTranslation: function (wordId, trans) {
        return window.$.ajax({
            type: "POST",
            dataType: "json",
            data: {
                action: 'updateTranslation',
                wordId: wordId,
                trans: trans
            },
            contentType: "application/json",
            url: "http://127.0.0.1:5000/",
            crossDomain: true
        })
    },
    saveTranslation: function (user, word, trans, from, to, context, url) {
        return window.$.ajax({
            type: "POST",
            dataType: "json",
            data: {
                action: 'saveTranslation',
                userId: user,
                word: word,
                trans: trans,
                from: from,
                to: to,
                context: context,
                url: url
            },
            contentType: "application/json",
            url: "http://127.0.0.1:5000/",
            crossDomain: true
        })
    },
    saveContext: function (translationId, entry, url) {
        return window.$.ajax({
            type: "POST",
            dataType: "json",
            data: {
                action: 'saveContext',
                translationId: translationId,
                entry: entry,
                url: url
            },
            contentType: "application/json",
            url: "http://127.0.0.1:5000/",
            crossDomain: true
        })
    },
    getContexts: function (translationId) {
        return window.$.ajax({
            type: "POST",
            dataType: "json",
            data: {
                action: 'getContexts',
                translationId: translationId
            },
            contentType: "application/json",
            url: "http://127.0.0.1:5000/",
            crossDomain: true
        })
    }
}
