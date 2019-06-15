import React from 'react';
import Global from './Global';
import logo from '../assets/logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Global />
      </header>
    </div>
  );
}

export default App;
