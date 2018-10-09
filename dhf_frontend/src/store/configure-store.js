import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './root-reducer';

export default function configureStore({ history }) {
  const routeMiddleWare = routerMiddleware(history);
  const reduxDEC = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  const composeEnhancers = (process.env.NODE_ENV !== 'production' && reduxDEC) ? reduxDEC({}) : compose;
  const store = createStore(rootReducer, composeEnhancers(
		applyMiddleware(routeMiddleWare),
	));

  return store;
}
