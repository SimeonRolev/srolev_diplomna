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

function App() {
  return <Popup notify={notify}/>;
}

export default App;
