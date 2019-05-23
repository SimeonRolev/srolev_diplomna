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

const getSelectionHandler = function (_, _, sendResponse) {
    sendResponse({
        word: getSelectionText(),
        url: window.location.href
    }); 
}

const noSelectionFound = function () {
    alert('You have not selected a word for translation. Note: some sites or elements don\'t support selection.')
}

const saveWord = function (message, _, _) {
    alert(`Successfully saved word "${message}"`)
}

const reducers = {
    'getSelection': getSelectionHandler,
    'noSelectionFound': noSelectionFound,
    'saveWord': saveWord,
    'test': function() {console.log('test')}
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(`Content listener received event ${message.action}`)
    try {
        reducers[message.action].call(this, message, sender, sendResponse)
        return true
    } catch (err) {
        console.log(`Error occured when trying to call action ${message}`)
        console.log(err)
    }
})
