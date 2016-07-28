import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Page from '../page';
import CustomerEditForm from '../customer/customer-edit-form';
import styles from './new-customer-page.scss';
import { createNewCustomer } from '../../actions';

class NewCustomerPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    id: PropTypes.string,
    isSaving: PropTypes.bool,
    customers: PropTypes.array,
    customersById: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    id: 'new',
    isSaving: false,
    customers: [],
    customersById: {}
  };

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Page>
        <header className={styles['header-text']}>
          Add Customer
        </header>

        <CustomerEditForm
          isSaving={this.props.isSaving}
          onSubmit={this._handleFormSubmit}
          onCancel={this._handleCancel}
        />
      </Page>
    );
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
    // Create customer
    const { dispatch } = this.props;
    const { name, webpage, files } = customerData;

    if (name) {
      dispatch(
        createNewCustomer({ name, webpage, files })
      );
    }
  };
}

function mapStateToProps(state) {
  const {
    id,
    isSaving,
    items: customers,
    customersById
  } = state.customers || { id: 'new', isSaving: false, customers: [], customersById: {} };

  return {
    id,
    isSaving,
    customers,
    customersById
  };
}

export default connect(mapStateToProps)(NewCustomerPage);
