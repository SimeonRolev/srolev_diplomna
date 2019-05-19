// This one is loaded and embedded in the chrome page
// Read the page contents from here

// Handle a request to the contents of the page by the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Request would be the message that was sent
    const re = RegExp('bear', 'gi')
    const matches = document.documentElement.innerHTML.match(re)
    const matchesCount = matches ? matches.length : 0
    sendResponse({
        count: matchesCount
    }); 
    return true;
})
