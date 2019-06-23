// This script is loaded and embedded in the chrome page


function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

const getSelectionHandler = function (message, _, sendResponse) {
    return {
        word: getSelectionText(),
        url: window.location.href
    }
}

const noSelectionFound = function () {
    alert('You have not selected a word for translation. Note: some sites or elements don\'t support selection.')
}

const saveWord = function (message, _, _) {
    alert(`Successfully saved word "${message.word}"`)
}

const saveContext = function (message, _, _) {
    alert(`Successfully saved new context for "${message.word}"`)
}

const reducers = {
    'getSelection': getSelectionHandler,
    'noSelectionFound': noSelectionFound,
    'saveWord': saveWord,
    'saveContext': saveContext
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    try {
        const action = message.action.split('.')[1]
        const response = reducers[action].call(this, message, sender, sendResponse)
        if (response) {
            chrome.runtime.sendMessage({
                action: `content.${action}`,    
                ...response
            });
        }
        return true
    } catch (err) {
        console.log(`Error occured when trying to call action ${message}`)
        console.log(err)
    }
})
