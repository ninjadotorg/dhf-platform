import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Router , BrowserRouter, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Todo from '@/page/todo';
import Sidebar from '@/Sidebar';
import HomePage from '@/homepage';
import Typography from '@material-ui/core/Typography';
import Register from '@/register';
import createProject from '@/createProject';
import Login from '@/login';
import './style/index.scss';
import history from '@/utils/history';
import projectPage from '@/projectPage';

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  root: {
    display: 'flex',
  },
});

class App extends React.Component {
  componentDidMount() {
    this.props.dispatch({ type: 'TEST_SAGA' });
  }

  PrivateRoute = () => {
    console.log('PrivateRoute');
    const { classes } = this.props;
    return (
      <Route
        render={props => (localStorage.getItem('token') ? (
          <div>
            <React.Fragment>
              <CssBaseline />
              <div className={classes.root}>
                <Sidebar />
                <main className={classes.content}>
                  <div className={classes.appBarSpacer} />
                      <Route path="/create-project" component={createProject} />
                      <Route path="/projects/:id" exact component={projectPage} />
                      <Route path="/" exact component={HomePage} />
                </main>
              </div>
            </React.Fragment>
          </div>
        ) : (
          <Redirect
            to={{
              pathname: '/register',
            }}
          />
        ))
        }
      />
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <this.PrivateRoute path="/" />
            <Route component={() => <div>404 Not found</div>} />
          </Switch>
        </Router>
      </div>
    );
  }
}

App.propTypes = {
  app: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return { app: state.app, user: state.user };
}

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(App));
