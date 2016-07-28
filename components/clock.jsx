import React, { Component, PropTypes } from 'react';
const moment = require('moment');  // can't use ES6 import

export default class Clock extends Component {
  static propTypes = {
    format: PropTypes.string.isRequired,
    interval: PropTypes.number.isRequired, // in milliseconds
    className: PropTypes.string,
    style: PropTypes.object
  };

  static deafultProps = {
    format: 'MMMM DD, YYYY HH:mm',
    interval: 5000
  };

  constructor(props) {
    super(props);

    this.state = {
      // currentTime in unix timestamp
      currentTime: Date.now()
    };
  }

  render() {
    const { format, className, style } = this.props;
    const { currentTime } = this.state;
    const now = moment(currentTime);

    return (
      <time
        dateTime={now.format()}
        className={className}
        style={style}
      >
        {now.format(format)}
      </time>
    );
  }

  componentDidMount() {
    const { interval } = this.props;

    this.interval = setInterval(this._tick, interval);
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  _tick = () => {
    this.setState({
      currentTime: Date.now()
    });
  };
}
