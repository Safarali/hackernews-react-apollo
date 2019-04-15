import React, { Component } from 'react';
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import '../styles/App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
          <div className="content">
              <LinkList/>
              <CreateLink/>
          </div>
      </div>
    );
  }
}

export default App;
