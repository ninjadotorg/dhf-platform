import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Wallet from '@material-ui/icons/AccountBalanceWallet';
import LocalAtm from '@material-ui/icons/LocalAtm';
import AccountBalance from '@material-ui/icons/AccountBalance';
import Assignment from '@material-ui/icons/Assignment';
import BarChart from '@material-ui/icons/BarChart';
import Person from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/PermIdentity';
import { Link } from 'react-router-dom';

export const mainListItems = (pathName, activeMenuItem) => (
  <div>
    <ListItem component={Link} to="/dashboard" button>
      <ListItemIcon style={pathName === '/dashboard' ? { color: '#35C37D' } : {}}>
        <Assignment />
      </ListItemIcon>
      <ListItemText primary="My Projects" classes={{ primary: (pathName === '/dashboard' || pathName.indexOf('trade') == 1) ? activeMenuItem : '' }} />
    </ListItem>
    <ListItem component={Link} to="/fund-allocation" button>
      <ListItemIcon style={pathName === '/fund-allocation' ? { color: '#35C37D' } : {}}>
        <AccountBalance />
      </ListItemIcon>
      <ListItemText primary="Fund Allocation" classes={{ primary: pathName === '/fund-allocation' ? activeMenuItem : '' }} />
    </ListItem>
    <ListItem component={Link} to="/report" button>
      <ListItemIcon style={pathName === '/report' ? { color: '#35C37D' } : {}}>
        <BarChart />
      </ListItemIcon>
      <ListItemText primary="Report" classes={{ primary: pathName === '/report' ? activeMenuItem : '' }} />
    </ListItem>
  </div>
);

export const secondaryListItems = (pathName, activeMenuItem) => (
  <div>
    <ListItem component={Link} to="/profile" button>
      <ListItemIcon style={pathName === '/profile' ? { color: '#35C37D' } : {}}>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Account & setting" classes={{ primary: pathName === '/profile' ? activeMenuItem : '' }} />
    </ListItem>
    <ListItem component={Link} to="/wallet" button>
      <ListItemIcon style={pathName === '/wallet' ? { color: '#35C37D' } : {}}>
        <Wallet />
      </ListItemIcon>
      <ListItemText primary="Wallet" classes={{ primary: pathName === '/wallet' ? activeMenuItem : '' }} />
    </ListItem>
    {/* <ListItem component={Link} to="/invest" button>
      <ListItemIcon>
        <LocalAtm />
      </ListItemIcon>
      <ListItemText primary="Invest" />
    </ListItem>
    <ListItem component={Link} to="/my-invest" button>
      <ListItemIcon>
        <AccountBalance />
      </ListItemIcon>
      <ListItemText primary="My Invest" />
    </ListItem> */}
  </div>
);
