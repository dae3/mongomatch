import React, { Component } from 'react';
import './App.css';
import CollectionList from './CollectionList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">temnames</h1>
        </header>
				<CollectionList />
      </div>
    );
  }
}

export default App;
