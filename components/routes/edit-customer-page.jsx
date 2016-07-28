import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Page from '../page';
import Spinner from '../spinner';
import CustomerEditForm from '../customer/customer-edit-form';
import styles from './edit-customer-page.scss';
import api from '../../lib/api';
import { fetchCustomerIfNeeded, updateCustomerInformation } from '../../actions';

class EditCustomerPage extends Component {
  static propTypes = {
    params: PropTypes.object,
    dispatch: PropTypes.func,
    isFetching: PropTypes.bool,
    isSaving: PropTypes.bool,
    customers: PropTypes.array,
    customersById: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    isFetching: false,
    isSaving: false,
    customers: [],
    customersById: {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      contact: {}
    };
  }

  render() {
    const { customerId } = this.props.params;
    const { isFetching, customersById } = this.props;
    const customer = customersById[customerId];
    const { contact } = this.state;

    return (
      <Page>
        <header className={styles['header-text']}>
          Edit Customer
        </header>

        {isFetching
          ? <div className="text-center">
              <Spinner width={60} height={60} />
            </div>
          : <CustomerEditForm
              {...customer}
              contact={contact}
              isSaving={this.props.isSaving}
              onSubmit={this._handleFormSubmit}
              onCancel={this._handleCancel}
            />}
      </Page>
    );
  }

  componentDidMount() {
    const { customerId } = this.props.params;
    const { dispatch } = this.props;

    if (customerId) {
      dispatch(fetchCustomerIfNeeded(customerId));
    }

    api.get(`/customers/${customerId}/contacts`, {})
      .then(res => {
        this.setState({ contact: res.body[0] });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isSaving && !nextProps.isSaving) {
      // Redirect to home page on successful creation
      this.context.router.goBack();
    }
  }

  _handleCancel = () => {
    this.context.router.goBack();
  };

  _handleFormSubmit = (customerData) => {
    // Update customer
    const { dispatch } = this.props;
    const { customerId } = this.props.params;
    const { id, name, webpage, files, shouldDelete } = customerData;

    dispatch(updateCustomerInformation({ id, name, webpage, files, shouldDelete }));
  };
}

function mapStateToProps(state) {
  const {
    isFetching,
    isSaving,
    items: customers,
    customersById
  } = state.customers || { isFetching: false, customers: [], customersById: {} };

  return {
    isFetching,
    isSaving,
    customers,
    customersById
  };
}

export default connect(mapStateToProps)(EditCustomerPage);
