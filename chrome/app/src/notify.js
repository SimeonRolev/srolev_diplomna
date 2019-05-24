/* global chrome */

const notify = function (actionName, responseCallback, receiverArgs) {
    chrome.runtime.sendMessage(
        'lmkogeccaibbphgfghallpflabohoahj',
        {
            action: actionName
        },
        null,
        responseCallback
    )
}

export { notify };