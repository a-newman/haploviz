import React, { Component } from 'react';
import logo from './logo.svg';
import UserInp from './components/UserInp/component.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <UserInp />
      </div>
    );
  }
}

export default App;
