import React from 'react';
import './App.css';
import Translator from './components/Translator'
import WordPreviewer from './components/WordPreviewer'
import ScannerMatches from './components/ScannerMatches'


const renderComponent = 'Translator';
// const renderComponent = 'ScannerMatches';

function App() {
  if (renderComponent === 'ScannerMatches') {
    require('./scanner');
    return <div>
      <div style={ {height: 1000} }> Falling in reverse </div>
      <div style={ {height: 1000} }> Falling in reverse 2</div>
      <div style={ {height: 1000} }> Falling in reverse 3</div>
      <div style={ {height: 1000} }> Falling in reverse 4</div>
      <div style={ {height: 1000} }> Falling in reverse 5</div>
    </div>
  } else if (renderComponent === 'WordPreviewer') {
    return <WordPreviewer word={'test'} />;
  }
  return <Translator />
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
