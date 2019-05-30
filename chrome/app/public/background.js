// App.js notify calls this method
// It sends the message to the content.js script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const sentBy = message.action.split('.')[0] // Message might be from app or from content
    if (sentBy === 'app') {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                message,
                null,
                message.responseCallback
            )
        })
    } else if (sentBy === 'content') {
        const action = message.action.split('.')[1]
        chrome.runtime.sendMessage({
            ...message,
            action: `background.${action}`
        });
    }
})
