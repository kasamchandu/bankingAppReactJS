import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Page from '../page';
import Card from '../card';
import PrevIcon from '../icons/prev-icon';
import NextIcon from '../icons/next-icon';
import Breadcrumbs from '../layout/breadcrumbs';
import SectionPresenceChartCard from '../services/section-presence-chart-card';
import HeatmapChartCard from '../services/heat-map-chart-card';
import api from '../../lib/api';
import styles from './space-management-page.scss';
const { BASE_URL } = process.env;

export default class SpaceManagementPage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object,
    customer: PropTypes.object,
    location: PropTypes.object,
    visibleSlides: PropTypes.number
  };

  static defaultProps = {
    visibleSlides: 3
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      customer: props.customer || {},
      location: props.location || {},
      sections: [],
      devices: [],
      activeIndex: 0,
      activeHeatmapSectionIndex: undefined,
      isPageLoaded: true
    };
  }

  render() {
    const { customerId, locationId } = this.props.params;
    const { visibleSlides } = this.props;
    const {
      customer,
      location,
      sections,
      devices,
      activeIndex,
      activeHeatmapSectionIndex,
      isPageLoaded
    } = this.state;
    const customerName = customer.name || '';
    const locationName = location.name || '';
    const address = [location.street, location.city].join(', ');

    let breadcrumbs = [
      { name: 'Home', href: BASE_URL || '/' },
      { name: customerName, href: `${BASE_URL}/customers/${customerId}` },
    ];
    if (!locationId) {
      breadcrumbs.push({
        name: 'Space Management Details',
        href: `${BASE_URL}/customers/${customerId}/space`
      });
    } else {
      breadcrumbs.push({
        name: `${locationName} - ${address}`,
        href: `${BASE_URL}/customers/${customerId}/locations/${locationId}`
      });
      breadcrumbs.push({
        name: 'Space Management Details',
        href: `${BASE_URL}/customers/${customerId}/locations/${locationId}/space`
      });
    }

    const classNames = {
      container: cx('container', styles.container),
      row: cx('row', styles.row)
    };
    const isSlideshowAtBeginning = activeIndex <= 0;
    const isSlideshowAtEnd = activeIndex >= (sections.length - visibleSlides);
    const slideStyle = {
      transform: `translate3d(${activeIndex * -1 * 33.4}%, 0, 0)`
    };

    const isAtBeginning = sections.length === 0
                        || activeHeatmapSectionIndex === 0;
    const isAtEnd = sections.length === 0
                  || activeHeatmapSectionIndex === (sections.length - 1);

    return (
      <Page>
        <Breadcrumbs links={breadcrumbs} />

        <div className={classNames.container}>
          <Card headerText="Space Management Details">
            <section className={styles.wrapper}>

              <div className={styles['slideshow-container']}>
                <div className={styles.slideshow}>
                  <div className={styles.slides} style={slideStyle}>
                    {sections.map((section, ix) => (
                      <div key={section.id} className={styles.slide}>
                        <SectionPresenceChartCard
                          section={section}
                          width="100%"
                          isVisible={ix >= activeIndex && ix <= activeIndex + 2}
                        />
                      </div>
                    ))}
                  </div>

                  {!isSlideshowAtBeginning && (
                  <span
                    className={styles.prev}
                    onClick={this._handlePrevSlideClick}
                  >
                    <PrevIcon isPageLoaded={isPageLoaded} />
                  </span>)}

                  {!isSlideshowAtEnd && (
                  <span
                    className={styles.next}
                    onClick={this._handleNextSlideClick}
                  >
                    <NextIcon isPageLoaded={isPageLoaded} />
                  </span>)}
                </div>
              </div>

              {sections.length > 0 && (
              <div className={classNames.row}>
                <div className="col-xs-12">
                  <section className="">
                    <HeatmapChartCard
                      section={sections[activeHeatmapSectionIndex]}
                      devices={devices}
                    />

                    {!isAtBeginning && (
                    <span
                      className={styles.prev}
                      onClick={this._handlePrevSectionClick}
                    >
                      <PrevIcon isPageLoaded={isPageLoaded} />
                    </span>)}

                    {!isAtEnd && (
                    <span
                      className={styles.next}
                      onClick={this._handleNextSectionClick}
                    >
                      <NextIcon isPageLoaded={isPageLoaded} />
                    </span>)}
                  </section>
                </div>
              </div>)}
            </section>
          </Card>
        </div>

      </Page>
    );
  }

  componentDidMount() {
    const { params } = this.props;
    const { customerId, locationId } = params;
    const sectionEndpoint = locationId
                          ? `/locations/${locationId}/sections`
                          : `/customers/${customerId}/sections`;

    if (customerId) {
      api.get(`/customers/${customerId}`)
        .then(res => {
          this.setState({ customer: res.body });
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (locationId) {
      api.get(`/locations/${locationId}`)
        .then(res => {
          this.setState({ location: res.body });
        })
        .catch(error => {
          console.log(error);
        });
    }

    api.get(sectionEndpoint)
      .then(res => {
        const sections = res.body;
        const hasSection = sections && sections.length > 0;

        this.setState({
          sections,
          activeHeatmapSectionIndex: hasSection ? 0 : undefined
        });

        if (hasSection) {
          return api.get(`/sections/${sections[0].id}/devices`);
        }
      })
      .then(res => {
        this.setState({ devices: res.body });
      })
      .catch(error => {
        console.log(error);
      });
  }

  _handlePrevSlideClick = () => {
    const { activeIndex } = this.state;

    if (activeIndex > 0) {
      this.setState({
        activeIndex: activeIndex - 1
      });
    }
  };

  _handleNextSlideClick = () => {
    const { activeIndex, sections } = this.state;
    const { visibleSlides } = this.props;

    if (activeIndex < (sections.length - visibleSlides)) {
      this.setState({
        activeIndex: activeIndex + 1
      });
    }
  };

  _handlePrevSectionClick = (e) => {
    e.preventDefault();

    const { sections, activeHeatmapSectionIndex } = this.state;
    const prevIndex = activeHeatmapSectionIndex - 1;
    const sectionId = sections[prevIndex].id;

    this.setState({
      activeHeatmapSectionIndex: prevIndex,
      devices: []
    });

    this._getDevices(sectionId);
  };

  _handleNextSectionClick = (e) => {
    e.preventDefault();

    const { sections, activeHeatmapSectionIndex } = this.state;
    const nextIndex = activeHeatmapSectionIndex + 1;
    const sectionId = sections[nextIndex].id;

    this.setState({
      activeHeatmapSectionIndex: nextIndex,
      devices: []
    });

    this._getDevices(sectionId);
  };

  _getDevices = (sectionId) => {
    api.get(`/sections/${sectionId}/devices`)
      .then(res => {
        this.setState({ devices: res.body });
      })
      .catch(error => {
        console.log(error);
      });
  };
}
