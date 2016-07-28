import api from '../lib/api';
import {
  FETCH_CUSTOMERS,
  RECEIVE_CUSTOMERS,
  FETCH_CUSTOMERS_FAILURE,
  FETCH_CUSTOMER,
  RECEIVE_CUSTOMER,
  SAVE_CUSTOMER,
  SAVED_CUSTOMER,
  FETCH_CUSTOMER_FAILURE
} from '../constants/action-types';

/** action creators **/
export function requestCustomers() {
  return { type: FETCH_CUSTOMERS };
}

export function requestCustomer() {
  return { type: FETCH_CUSTOMER };
}

export function requestSaveCustomer() {
  return { type: SAVE_CUSTOMER };
}

export function receiveSavedCustomer() {
  return { type: SAVED_CUSTOMER };
}

export function receiveCustomers(customers) {
  return { type: RECEIVE_CUSTOMERS, customers };
}

export function receiveCustomer(customer) {
  return { type: RECEIVE_CUSTOMER, customer };
}

export function fetchCustomersFailure(error) {
  return { type: FETCH_CUSTOMERS_FAILURE, error };
}

export function fetchCustomerFailure(error) {
  return { type: FETCH_CUSTOMER_FAILURE, error };
}


/** actions **/
export function fetchCustomers() {
  return (dispatch) => {
    dispatch(requestCustomers());

    api.get('/customers', {})
      .then(res => {
        dispatch(receiveCustomers(res.body));
      })
      .catch(error => {
        dispatch(fetchCustomersFailure(error));
      });
  };
}

function fetchCustomer(customerId) {
  return (dispatch) => {
    dispatch(requestCustomer());

    api.get(`/customers/${customerId}`, {})
      .then(res => {
        dispatch(receiveCustomer(res.body));
      })
      .catch(error => {
        dispatch(fetchCustomerFailure(error));
      });
  };
}

function createCustomer(customer) {
  return (dispatch) => {
    dispatch(requestSaveCustomer());

    const { name, webpage, files } = customer;
    api.multipart({
      method: 'POST',
      endpoint: '/customers',
      data: { name, webpage },
      files
    }).then(res => {
      dispatch(receiveSavedCustomer());
      dispatch(receiveCustomer(res.body));
    }).catch(error => {
      dispatch(fetchCustomerFailure(error));
    });
  };
}

function updateCustomer(customer) {
  return (dispatch) => {
    dispatch(requestSaveCustomer());

    const { id, name, webpage, files, shouldDelete } = customer;

    api.multipart({
      method: 'PUT',
      endpoint: `/customers/${customer.id}`,
      data: { id, name, webpage, shouldDelete },
      files
    }).then(res => {
      dispatch(receiveSavedCustomer());
      dispatch(receiveCustomer(res.body));
    }).catch(error => {
      dispatch(fetchCustomerFailure(error));
    });
  };
}

function shouldFetchCustomers(state) {
  const customers = state.customers.items;
  if (!customers || customers.length === 0) {
    return true;
  }

  return false;
}

function shouldFetchCustomer(state, customerId) {
  const customers = state.customers.customersById;

  if (customers[customerId]) {
    return false;
  }

  return true;
}

export function fetchCustomersIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchCustomers(getState())) {
      return dispatch(fetchCustomers());
    }
  };
}

export function fetchCustomerIfNeeded(customerId) {
  return (dispatch, getState) => {
    if (shouldFetchCustomer(getState(), customerId)) {
      return dispatch(fetchCustomer(customerId));
    }
  };
}

export function createNewCustomer(customer) {
  return (dispatch, getState) => {
    return dispatch(createCustomer(customer));
  };
}

export function updateCustomerInformation(customer) {
  return (dispatch, getState) => {
    return dispatch(updateCustomer(customer));
  };
}
