import Login from '../login';
import HomePage from '../homepage';
// import UserProfile from "views/UserProfile/UserProfile";
// import TableList from "views/TableList/TableList";
// import Typography from "views/Typography/Typography";
// import Icons from "views/Icons/Icons";
// import Maps from "views/Maps/Maps";
// import Notifications from "views/Notifications/Notifications";
// import Upgrade from "views/Upgrade/Upgrade";

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
