/**
 * Create the store with dynamic reducers
 */

import { configureStore, StoreEnhancer } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { rtkQueryMiddleware } from './rtkQueryMiddleware';
import { createReducer } from './reducers';

export function configureAppStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;
  // Create the store with saga middleware
  const middlewares = [sagaMiddleware, ...rtkQueryMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ] as StoreEnhancer[];

  const store = configureStore({
    reducer: createReducer(),
    middleware: gDM => gDM().concat(middlewares),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: gDE => gDE().concat(enhancers),
  });

  return store;
}
