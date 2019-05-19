document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('button').addEventListener('click', countWords, false)
    
    function countWords () {
        chrome.tabs.query({
            currentWindow: true,
            active: true
        },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'hi', handleCountWordsResponse)
        })
    }

    function handleCountWordsResponse (res) {
        const div = document.createElement('div')
        div.textContent = `${res.count} matches found`
        document.body.appendChild(div)
    }

}, false)
