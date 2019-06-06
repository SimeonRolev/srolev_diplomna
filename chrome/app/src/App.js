import React from 'react';
import './App.css';
import Popup from './components/Popup'
import WordPreviewer from './components/WordPreviewer'
import ScannerMatches from './components/ScannerMatches'


const renderComponent = 'Popup';

function App() {
  if (renderComponent === 'ScannerMatches') {
    require('./scanner');
    return <div>
      <div style={ {height: 1000} }> Falling in reverse </div>
      <div style={ {height: 1000} }> Falling in reverse </div>
    </div>
  } else if (renderComponent === 'WordPreviewer') {
    return <WordPreviewer word={'test'} />;
  }
  return <Popup />
  // return <ScannerMatches matches={{
  //   'fall': [
  //     {onclick: function() { console.log('clicked 1 fall')}},
  //     {onclick: function() { console.log('clicked 2 fall')}},
  //     {onclick: function() { console.log('clicked 3 fall')}}
  //   ],
  //   'reverse': [
  //     {onclick: function() { console.log('clicked 1 reverse')}},
  //     {onclick: function() { console.log('clicked 2 reverse')}},
  //     {onclick: function() { console.log('clicked 3 reverse')}}
  //   ]
  // }} />;
}

export default App;
