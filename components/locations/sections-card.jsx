import React, { Component, PropTypes } from 'react';
import PrevIcon from '../icons/prev-icon';
import NextIcon from '../icons/next-icon';
import Card from '../card';
import SectionCard from './section-card';
import styles from './sections-card.scss';

export default class SectionsCard extends Component {
  static propTypes = {
    sections: PropTypes.array.isRequired,
    visibleSlides: PropTypes.number,
    onSectionClick: PropTypes.func
  };

  static defaultProps = {
    visibleSlides: 3
  };

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      isPageLoaded: true
    };
  }

  render() {
    const { sections, visibleSlides } = this.props;
    const { activeIndex, isPageLoaded } = this.state;
    const isAtBeginning = activeIndex <= 0;
    const isAtEnd = activeIndex >= (sections.length - visibleSlides);
    const slideStyle = {
      transform: `translate3d(${activeIndex * -1 * 33.4}%, 0, 0)`
    };

    return <Card headerText="Sections" className={styles.sections}>
      <div className={styles.slideshow}>
        <div className={styles.slides} style={slideStyle}>
          {sections.map(section => {
            return <div key={section.id} className={styles.slide}>
              <SectionCard
                {...section}
                onClick={this._handleSectionClick.bind(this, section)}
              />
            </div>;
          })}
        </div>

        {!isAtBeginning &&
        <span
          className={styles.prev}
          disabled={isAtBeginning}
          onClick={this._handlePrevClick}>
          <PrevIcon isPageLoaded={isPageLoaded} />
        </span>}

        {!isAtEnd &&
        <span
          className={styles.next}
          disabled={isAtEnd}
          onClick={this._handleNextClick}>
          <NextIcon isPageLoaded={isPageLoaded} />
        </span>}
      </div>
    </Card>;
  }

  _handleSectionClick = (section) => {
    this.props.onSectionClick && this.props.onSectionClick(section);
  };

  _handlePrevClick = () => {
    const { activeIndex } = this.state;

    if (activeIndex > 0) {
      this.setState({
        activeIndex: activeIndex - 1
      });
    }
  };

  _handleNextClick = () => {
    const { activeIndex } = this.state;
    const { sections, visibleSlides } = this.props;

    if (activeIndex < (sections.length - visibleSlides)) {
      this.setState({
        activeIndex: activeIndex + 1
      });
    }
  };
}
