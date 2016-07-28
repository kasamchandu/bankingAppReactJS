import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class Img extends Component {
  static propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    defaultSrc: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    useBackground: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ])
  };

  constructor(props) {
    super(props);
  }

  render() {
    const src = this.props.src || this.props.defaultSrc;
    const { className, style, alt, useBackground } = this.props;

    if (useBackground) {
      const background = {
        backgroundImage: src ? `url(${src})` : undefined,
        backgroundSize: useBackground === true
                      ? 'cover'
                      : useBackground,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      };
      return (<div
        className={className}
        style={Object.assign(background, style)}
      />);
    }

    return (<img
      className={className}
      style={style}
      src={src}
      alt={alt}
    />);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
}
