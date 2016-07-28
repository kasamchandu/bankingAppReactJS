import React, { Component, PropTypes } from 'react';

export default class Icon extends Component {
  static propTypes = {
    src: PropTypes.string,
    hoverSrc: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      src: this.props.src || ''
    };
  }

  render() {
    const { className, style, hoverSrc } = this.props;
    const { src } = this.state;

    return (
      <img
        className={className}
        src={src}
        style={Object.assign({ width: 16 }, style)}
        onMouseEnter={hoverSrc ? this._handleMouseEnter : undefined}
        onMouseLeave={hoverSrc ? this._handleMouseLeave : undefined}
        onMouseUp={hoverSrc ? this._handleMouseEnter : undefined}
      />
    );
  }

  componentWillReceiveProps(nextProps) {
    const { isPageLoaded } = this.props;

    if (!isPageLoaded) {
      this.setState({ src: nextProps.src });
    }
  }

  _handleMouseEnter = () => {
    this.setState({ src: this.props.hoverSrc });
  };

  _handleMouseLeave = () => {
    this.setState({ src: this.props.src });
  };
}
