/* global chrome */

const notify = function (actionName, responseCallback, receiverArgs) {
    try {
        chrome.runtime.sendMessage(
        'lmkogeccaibbphgfghallpflabohoahj',
        {
            action: `app.${actionName}`,
            ...receiverArgs
        },
        null,
        responseCallback) 
    } catch {
        console.log('Can not load chrome messaging kit.')
    } finally {
        return actionName
    }
}

export { notify };