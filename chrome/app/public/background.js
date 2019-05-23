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

// chrome.browserAction.onClicked.addListener(function(tab) {
//     // Send a message to the active tab
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         var activeTab = tabs[0];
//         chrome.tabs.sendMessage(activeTab.id, {action: 'test'});
//     });
// });