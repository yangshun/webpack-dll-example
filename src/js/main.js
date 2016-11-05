import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require('react-autobind');
require('redux');
require('react-redux');
require('react-router-redux');
require('redux-logger');
require('redux-thunk');

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
