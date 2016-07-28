import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';
import CustomerCard from './customer-card';
import Spinner from '../spinner';
import { fetchCustomers } from '../../actions';
import styles from './provisioning-customer-card.scss';
const { BASE_URL } = process.env;

class ChooseCustomerPopup extends Component {
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

    return (
       <section className={styles['page-body']}>
          {isFetching && <div className="text-center">
            <Spinner color="#ccc" width={60} height={60} />
          </div>}

          {!isFetching &&
          <div className={styles.container}>
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
            </div>
          </div>}
      </section>
    );
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

export default connect(mapStateToProps)(ChooseCustomerPopup);
