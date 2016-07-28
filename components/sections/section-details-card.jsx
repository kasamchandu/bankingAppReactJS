import React, { Component, PropTypes } from 'react';
import Card from '../card';
import DeviceLuminaireSelectedIcon from '../icons/device-luminaire-selected-icon';
import DeviceSensorSelectedIcon from '../icons/device-sensor-selected-icon';
import DeviceControllerSelectedIcon from '../icons/device-controller-selected-icon';
import DeviceOtherSelectedIcon from '../icons/device-other-selected-icon';
import { imagePath } from '../../lib/utils';
import styles from './section-details-card.scss';

export default class SectionDetailsCard extends Component {
  static propTypes = {
    section: PropTypes.object,
    devices: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      src: undefined,
      sectionWidth: 0,
      sectionHeight: 0,
      devices: []
    };
  }

  render() {
    const { section, devices } = this.props;
    const { sectionWidth, sectionHeight } = this.state;

    return <Card
      className={styles.container}
      headerText="Section Details">
      <div>
        <div className={styles['image-container']}>
          {section.photoUrl
            ? <img ref="img" className={styles.image} src={section.photoUrl} onLoad={this._handleLoad} />
            : <img className={styles.image} src={imagePath('/images/ic-generic-map-lrg.jpg')} />
          }

          {sectionWidth > 0 && sectionHeight > 0 &&
            devices.map((device, ix) => {
              let DeviceIcon;
              let backgroundColor;

              switch (device.deviceType) {
                case 'LUMINAIRE':
                  DeviceIcon = DeviceLuminaireSelectedIcon;
                  backgroundColor = '#3288BD';
                  break;
                case 'SENSOR':
                  DeviceIcon = DeviceSensorSelectedIcon;
                  backgroundColor = '#49AD47';
                  break;
                case 'CONTROLLER':
                  DeviceIcon = DeviceControllerSelectedIcon;
                  backgroundColor = '#D8222A';
                  break;
                default:
                  DeviceIcon = DeviceOtherSelectedIcon;
                  backgroundColor = '#E16029';
                  break;
              }
              const deviceStyle = {
                width: 16,
                height: 16,
                top: `${device.yLocation / sectionHeight * 100}%`,
                left: `${device.xLocation / sectionWidth * 100}%`,
                backgroundColor
              };

              return <DeviceIcon key={device.id}
                className={styles.device}
                style={deviceStyle}
              />;
            })
          }
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.name}>{section.name}</div>
        {typeof(section.floor) !== 'undefined' &&
          <div className={styles.floor}>
            Floor {`#${section.floor}`}
          </div>
        }
      </div>
    </Card>;
  }

  _handleLoad = () => {
    this.setState({
      sectionWidth: this.refs.img.naturalWidth,
      sectionHeight: this.refs.img.naturalHeight
    });
  };
}
