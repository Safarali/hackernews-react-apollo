import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import Header from './Header';
import '../styles/App.css';


class App extends Component {
  render() {
    return (
      <div className="container">
          <div className="content">
              <Header/>
              <div className="ph3 pv1 background-gray">
                <Switch>
                  <Route exact path="/" component={LinkList} />
                  <Route exact path="/create" component={CreateLink} />
                </Switch>
              </div>
          </div>
      </div>
    );
  }
}

export default App;