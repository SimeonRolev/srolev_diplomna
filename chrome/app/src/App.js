/* global chrome */

import React from 'react';
import './App.css';
import Popup from './components/Popup'


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

// Add runtime listener for messages
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('App.js received a message: ', message)
})

function App() {
  return <Popup notify={notify}/>;
}

export default App;
