import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from './data/reducers';

export const initializeMocks = (initialState = {}) => {
  const reduxStore = createStore(reducers, initialState, applyMiddleware(thunk));
  return { reduxStore };
};
