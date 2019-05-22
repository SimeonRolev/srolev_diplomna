/* global chrome */

import React from 'react';
import './App.css';
import Popup from './components/Popup'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showHeader: true};
    this.handleClick = this.handleClick.bind(this);
    chrome.runtime.sendMessage('lmkogeccaibbphgfghallpflabohoahj',{action: "popupOpen"});

  }

  handleClick() {
    console.log('clicked');
    this.setState( prevState => ({
      showHeader: !prevState.showHeader
    }));
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.state.showHeader && <h2>Welcome to React Jon</h2>}
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.handleClick}>
          {this.state.showHeader ? "HIDE" : "SHOW"}
        </button>
      </div>
    );
  }
}

export default App;
