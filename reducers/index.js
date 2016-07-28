import customers from './customers';

const initialState = {
  user: null,
  customers: {
    isFetching: false,
    isSaving: false,
    items: [],
    customersById: {}
  }
};

const rootReducer = function(state = initialState, action) {
  return {
    customers: customers(state.customers, action)
  };
}

export default rootReducer;
