import { init } from '@rematch/core';
import * as models from './models';
import { routerReducer } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware } from 'redux';
const history = createHistory();
const routeMiddleWare = routerMiddleware(history);
const routerEnhancer = applyMiddleware(routeMiddleWare);
const store = init({
  models,
//   redux: {
//       reducers: {
//         router: routerReducer
//       },
//       enhancers: [ routerEnhancer() ]
//   } 
})

export default store