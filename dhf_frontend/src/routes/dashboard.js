import Login from '../login';
import HomePage from '../homepage';
const dashboardRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/user',
    name: 'Login',
    component: Login,
  },
  { redirect: true, path: '/', to: '/', name: 'HomePage', component: HomePage },
];

export default dashboardRoutes;
