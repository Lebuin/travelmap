import ReactDOM from 'react-dom';


function FormattedDate(props) {
  return <React.Fragment>{props.date.toLocaleString()}</React.Fragment>;
}


class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      running: true,
    };
    this.interval = null;

    this.bind();
  }

  bind() {
    this.tick = this.tick.bind(this);
    this.toggleRunning = this.toggleRunning.bind(this);
  }

  componentDidMount() {
    if(this.state.running) {
      this.start();
    }
  }

  componentWillUnmount() {
    this.stop();
  }


  start() {
    if(!this.interval) {
      this.interval = setInterval(this.tick, 1000);
      this.tick();
    }
  }

  stop() {
    if(this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }


  toggleRunning() {
    let running = !this.state.running;
    this.setState({
      running: running,
    });
    running ? this.start() : this.stop();
  }


  tick() {
    this.setState({
      date: new Date(),
    });
  }


  render() {
    return (
      <div>
        <h1>Clock</h1>
        <div>It is now <FormattedDate date={this.state.date} /></div>
        <button onClick={this.toggleRunning}>{this.state.running ? 'Stop' : 'Start'}</button>
      </div>
    );
  }
}


ReactDOM.render(<Clock />, document.getElementById('root'));
