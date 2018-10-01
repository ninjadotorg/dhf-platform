import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Wallet from '@material-ui/icons/AccountBalanceWallet';
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
    <ListItem component={Link} to="/wallet" button>
      <ListItemIcon>
        <Wallet />
      </ListItemIcon>
      <ListItemText primary="Wallet" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListItem component={Link} to="/profile" button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="My Profile" />
    </ListItem>
  </div>
);
