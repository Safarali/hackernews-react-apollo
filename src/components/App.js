import React, { Component } from 'react';
import LinkList from './LinkList';
import '../styles/App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
          <div className="content">
              <LinkList/>
          </div>
      </div>
    );
  }
}

export default App;
