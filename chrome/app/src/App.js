import React from 'react';
import './App.css';
import Popup from './components/Popup'
import WordPreviewer from './components/WordPreviewer'
import ScannerMatches from './components/ScannerMatches'

function App() {
  return <Popup />;
  // return <WordPreviewer word={'test'} />;
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
