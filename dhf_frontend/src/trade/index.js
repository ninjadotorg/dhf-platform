import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import ProjectList from './ProjectList';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginLeft: 30,
    float: 'right',
    marginBottom: 30,
  },
  input: {
    display: 'none',
  },
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: 'auto',
    overflow: 'auto',
  },
  tableContainer: {
    height: 'auto',
    marginTop: 20,
  },
});

class trade extends React.Component {
  state = {
    open: true,
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography variant="display1" gutterBottom>
            Select Project
          </Typography>
          <div className={classes.tableContainer}>
            <ProjectList />
          </div>
        </main>
      </React.Fragment>
    );
  }
}

trade.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(trade);
