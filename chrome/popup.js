document.addEventListener('DOMContentLoaded', function () {

    function notifyActiveTab (actionName, responseCallback, receiverArgs) {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        },
        function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { 
                    action: actionName,
                    args: receiverArgs 
                },
                responseCallback
            )
        })
    }

    function fillInForm (resp) {
        if (resp.word) {
            let word = document.getElementById('word').textContent = resp.word
            let urlDiv = document.getElementById('url').textContent = resp.url
            let notes = document.getElementById('notes')  // textarea
    
            // TODO: add translations widget that requests the translation aggregator
            document.getElementById('save-btn').onclick = function () {
                save({ word, urlDiv, notes })
            }
        } else {
            notifyActiveTab('noSelectionFound')
        }
    }

    function getSelected () {
        notifyActiveTab('getSelection', fillInForm)
    }
    
    function save (contents) {
        notifyActiveTab('saveWord', null, contents)
    }

    getSelected()
}, false)
