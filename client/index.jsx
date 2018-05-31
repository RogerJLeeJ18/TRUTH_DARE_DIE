class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'application',
    };
  }
  render() {
    return (
      <div>
        <span>This is the first component</span>
        <div>{this.state.name}</div>
      </div>
    )
  }
}
