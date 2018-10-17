/*eslint-disable*/
import React from 'react';
// react components for routing our app without refresh
import { Link } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
// @material-ui/icons
import { Apps, CloudDownload } from '@material-ui/icons';
import { compose } from 'recompose';

// core components
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx';
import Button from '@material-ui/core/Button';

import headerLinksStyle from 'assets/jss/material-kit-react/components/headerLinksStyle.jsx';

function HeaderLinks({ ...props }) {
  const { classes } = props;
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        {/* <CustomDropdown
          noLiPadding
          buttonText="Components"
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={Apps}
          dropdownList={[
            <Link to="/" className={classes.dropdownLink}>
              All components
            </Link>,
            <a
              href="https://creativetimofficial.github.io/material-kit-react/#/documentation"
              target="_blank"
              className={classes.dropdownLink}
            >
              Documentation
            </a>
          ]}
        /> */}
      </ListItem>
      <ListItem className={classes.listItem}>
        {!localStorage.getItem('token') && props.location.pathname != "/register" && (
          <Link to="/register"  className={classes.navLink}>
            {' '}
            Register
          </Link>
        )}
      </ListItem>
      <ListItem className={classes.listItem}>
        {localStorage.getItem('token') ? (
          <Link to="/dashboard"  className={classes.navLink}>
            {' '}
            Dashboard
          </Link>
        ) : (
          props.location.pathname != "/login" &&
            <Button type="submit" variant="raised" color="primary" component={Link} to='/login'>
            Login
          </Button>
        )}
      </ListItem>
    </List>
  );
}

export default compose(
  withRouter,
  withStyles(headerLinksStyle),
)(HeaderLinks);
