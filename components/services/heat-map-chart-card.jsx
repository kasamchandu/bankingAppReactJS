import React, { Component, PropTypes } from 'react';
import Heatmap from 'heatmap.js';
import Card from '../card';
import { imagePath } from '../../lib/utils';
import api from '../../lib/api';
import Clock from '../clock';
import { filterSensors, transform } from '../../lib/heatmap-helper';
import styles from './heat-map-chart-card.scss';

export default class HeatmapChartCard extends Component {
  static propTypes = {
    devices: PropTypes.array,
    section: PropTypes.object,
    max: PropTypes.number
  };

  static defaultProps = {
    devices: [],
    max: 100,
  };

  constructor(props) {
    super(props);

    // keep track of requests
    this._promises = [];

    this.state = {
      isGettingPlatformError: false
    };
  }

  render() {
    const { section } = this.props;

    return (
      <Card
        headerText={`Live Heat Map: ${section.name}`}
        action={<Clock format="MMMM DD, YYYY HH:mm" interval={5000} />}
        className={styles.card}
      >
        <section className={styles.body}>

          <div className={styles.container}>
            {section &&
            <img ref="floor"
              src={section.photoUrl || imagePath('/images/ic-generic-map-lrg.jpg')}
              onLoad={this._onFloorImageLoad}
              style={{ width: '100%', height: 'auto', padding: '20' }}
            />}

            {section &&
            <div ref="heatmap"
              className={styles.heatmap}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            />}
          </div>

        </section>
      </Card>
    );
  }

  componentDidMount() {
    this._getData(this.props.section.id);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState.isGettingPlatformError) {
      this.setState({ isGettingPlatformError: false });
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Clear all pending requests
    this._promises.forEach(promise => {
      promise.cancel();
    });

    this._getData(nextProps.section.id);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Clear all pending requests
    this._promises.forEach(promise => {
      promise.cancel();
    });
    this._promises = undefined;
    delete this._promises;
  }

  _onFloorImageLoad = () => {
    // Delete canvas for previously rendered heatmap
    if (this.heatmap) {
      const node = this.refs.heatmap;
      node.removeChild(node.lastChild);
    }

    // Initialize heatmap
    this.heatmap = Heatmap.create({
      container: this.refs.heatmap,
      radius: 40
    });
  };

  _pollData = () => {
    const { section } = this.props;
    const { isGettingPlatformError } = this.state;
    const DELAY = 5000;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (section && !isGettingPlatformError) {
      this.timeoutId = setTimeout(() => {
        this._getData(section.id);
      }, DELAY);
    }
  };

  _setData = (data) => {
    if (this.heatmap) {
      const computedData = this._computeData(data);

      this.heatmap.setData({
        max: this.props.max,
        data: computedData
      });

      this._pollData();
    }
  };

  _computeData = (data) => {
    const { devices, section } = this.props;
    const { photoWidth, photoHeight } = section;
    const { offsetWidth: canvasWidth, offsetHeight: canvasHeight } = this.refs.floor;

    return transform({
      data,
      devices: filterSensors(devices),
      originalDimension: {
        w: photoWidth,
        h: photoHeight
      },
      displayDimension: {
        w: canvasWidth,
        h: canvasHeight
      }
    });
  };

  _getData = (sectionId) => {
    const req = api.get(`/ts/sections/${sectionId}?type=PRESENCE&filter=LAST`);

    this._promises.push(req);

    req.then(res => {
      this._setData(res.body);
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      if (this._promises) {
        this._promises.pop();
      }
    });
  };
}
