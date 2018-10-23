import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Wallet from '@material-ui/icons/AccountBalanceWallet';
import LocalAtm from '@material-ui/icons/LocalAtm';
import AccountBalance from '@material-ui/icons/AccountBalance';
import PeopleIcon from '@material-ui/icons/PermIdentity';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <div>
    <ListItem component={Link} to="/dashboard" button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="My Projects" />
    </ListItem>
    <ListItem component={Link} to="/fund-allocation" button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Fund Allocation" />
    </ListItem>
    <ListItem component={Link} to="/report" button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Report" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListItem component={Link} to="/profile" button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Account & setting" />
    </ListItem>
    <ListItem component={Link} to="/wallet" button>
      <ListItemIcon>
        <Wallet />
      </ListItemIcon>
      <ListItemText primary="Wallet" />
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
