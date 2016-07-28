import {
  FETCH_CUSTOMERS,
  FETCH_CUSTOMER,
  RECEIVE_CUSTOMERS,
  RECEIVE_CUSTOMER,
  SAVE_CUSTOMER,
  SAVED_CUSTOMER
} from '../constants/action-types';

const initialState = {
  isFetching: false,
  isSaving: false,
  items: [],
  customersById: {}
};

export default function customers(state = initialState, action) {
  switch (action.type) {
    case FETCH_CUSTOMERS:
    case FETCH_CUSTOMER:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_CUSTOMERS:
      return {
        ...state,
        isFetching: false,
        items: action.customers.map(customer => customer.id),
        customersById: action.customers.reduce((result, current) => {
          result[current.id] = current;
          return result;
        }, {})
      };
    // TODO: Separate add action from fetch action
    // Add customer id to items
    // and add { customerId: customer }  to customersById
    case RECEIVE_CUSTOMER:
      return {
        ...state,
        isFetching: false,
        isSaving: false,
        items: state.customersById[action.customer.id]
             ? [...state.items]
             : [...state.items, action.customer.id],
        customersById: {
          ...state.customersById,
          [action.customer.id]: action.customer
        }
      };
    case SAVE_CUSTOMER:
      return {
        ...state,
        isSaving: true
      };
    case SAVED_CUSTOMER:
      return {
        ...state,
        isSaving: false
      };
    default:
      return state;
  }
}
