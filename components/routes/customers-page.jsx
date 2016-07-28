import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';
import cx from 'classnames';
import Page from '../page';
import Breadcrumbs from '../layout/breadcrumbs';
import CustomerCard from '../customer/customer-card';
import Card from '../card';
import Spinner from '../spinner';
import Img from '../img';
import { imagePath } from '../../lib/utils';
import { fetchCustomers } from '../../actions';
import styles from './customers-page.scss';
const { BASE_URL } = process.env;

class CustomersPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isFetching: PropTypes.bool,
    customers: PropTypes.array,
    customersById: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    isFetching: false,
    customers: [],
    customersById: {}
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { isFetching, customers, customersById } = this.props;
    const breadcrumbs = [
      { name: 'Home', href: BASE_URL || '/' }
    ];
    const classNames = {
      container: cx('container', styles.container),
    };

    return (<Page>
      <Breadcrumbs links={breadcrumbs} />

      <section className={styles['page-body']}>
        <div className={classNames.container}>
          <div className={styles.header}>
            Choose Customer
          </div>
        </div>

        <div className={classNames.container}>
          {isFetching && <div className="text-center">
            <Spinner color="#ccc" width={60} height={60} />
          </div>}

          {!isFetching &&
          <div className={styles['customer-grid']}>
            <div className="col-xs-12">
              {customers.map(customerId => {
                const customer = customersById[customerId];
                return (<div key={customerId} className="col-xs-4 col-sm-4">
                  <CustomerCard {...customer}
                    onHeaderClick={this._handleCardHeaderClick}
                    onClick={this._handleCardClick}
                  />
                </div>);
              })}
              <div className="col-xs-4 col-sm-4">
                <Card
                  headerText="Add Customer"
                  onHeaderClick={this._handleAddCustomerCardClick}
                >
                  <div className={styles['image-wrapper']} onClick={this._handleAddCustomerCardClick}>
                    <Img
                      className={styles['plus-btn']}
                      src={imagePath('/images/plus.png')}
                      useBackground
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>}
        </div>
      </section>

    </Page>);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCustomers());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  _handleCardHeaderClick = (id) => {
    this.context.router.push(`${BASE_URL}/customers/${id}/edit`);
  };

  _handleCardClick = (id) => {
    this.context.router.push(`${BASE_URL}/customers/${id}`);
  };

  _handleAddCustomerCardClick = () => {
    this.context.router.push(`${BASE_URL}/customers/new`);
  };

  loadCustomers = (error, res) => {
    this.setState({ customers: res.body });
  };
}

function mapStateToProps(state) {
  const {
    isFetching,
    items: customers,
    customersById
  } = state.customers || { isFetching: false, customers: [], customersById: {} };

  return {
    isFetching,
    customers,
    customersById
  };
}

export default connect(mapStateToProps)(CustomersPage);
