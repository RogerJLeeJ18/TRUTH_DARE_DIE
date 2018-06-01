import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'app',
    };
  }
  render() {
    return (
      <div className="container">
        <div className="row">
        <div className="col-xs-10 col-xs-offset-1">
          <span>Hello world!!</span>
        </div>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
