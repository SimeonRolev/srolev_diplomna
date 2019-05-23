// App.js notify calls this method
// It sends the message to the content.js script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Background')
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        console.log('tabs: ', tabs, message)
        chrome.tabs.sendMessage(
            tabs[0].id,
            message,
            null,
            message.responseCallback
        )
    })
})

// After the content.js script has done its work
// it sends a message back to this handler
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log('Background received message from content: ', message)
        chrome.runtime.sendMessage(message);
    }
);
