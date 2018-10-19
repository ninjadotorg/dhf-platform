import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Sidebar from '@/Sidebar';
import HomePage from '@/homepage';
import Register from '@/register';
import createProject from '@/project';
import editProject from '@/project/editProject';
import wallet from '@/wallet';
import invest from '@/invest';
import myInvest from '@/myInvest';
import Login from '@/login';
import './style/index.scss';
import history from '@/utils/history';
import trade from '@/trade';
import LandingPage from '@/LandingPage/LandingPage';
import tradePage from '@/trade/tradePage';
import profile from '@/profile';
import changePassword from '@/changePassword';
import fundAllocation from '@/fundAllocation';
import Test from '@/test';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#35C37D',
      main: '#35C37D',
      dark: '#35C37D',
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#35C37D',
      main: '#35C37D',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#35C37D',
    },
    // error: will use the default color
  },
  overrides: {
    MuiButton: {
      // Name of the rule
      root: {
        // Some CSS
        background: 'rgba(53, 195, 125, 100)',
        borderRadius: 0,
        border: 0,
        colorInherit: '#fff',
        color: 'white',
        height: 40,
        padding: '0 30px',
        boxShadow: '4px 9px 26px 0 rgba(16,124,71,0.10)',
        '&:hover': {
          textDecoration: 'none',
          backgroundColor: '#35C37D',
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: '#35C37D',
          },
        },
      },
      textPrimary: {
        color: '#fff',
      },
      textSecondary: {
        color: '#fff',
      },
      contained: {
        color: '#fff',
      },
      outlined: {
        '&:hover': {
          backgroundColor: '#35C37D',
        },
      },
      containedPrimary: {
        color: '#fff',
      },

      containedSecondary: {
        color: '#fff',
      },

      raised: {
        color: '#fff',
      },

      colorInherit: {
        color: '#fff',
      },

    },
  },
  typography: {
    fontFamily: 'azo-sans-web',
    // The default font size of the Material Specification.
    fontSize: 14, // px
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    // Tell Material-UI what's the font-size on the html element.
    // 16px is the default font-size used by browsers.
    htmlFontSize: 16,
  },
});
// font-family: "azo-sans-web" !important;
const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: 'auto',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 'auto',
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
    const { classes } = this.props;
    return (
      <Route
        render={props => (localStorage.getItem('token') ? (
          <div>
            <React.Fragment>
              <CssBaseline />
              <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnVisibilityChange={false}
                draggable
                pauseOnHover={false}
              />
              <div className={classes.root}>
                <Sidebar />
                <main className={classes.content}>
                  <div className={classes.appBarSpacer} />
                  <Route path="/create-project" component={createProject} />
                  <Route path="/project/:id" component={editProject} />
                  <Route path="/wallet" exact component={wallet} />
                  <Route path="/invest" exact component={invest} />
                  <Route path="/my-invest" exact component={myInvest} />
                  <Route path="/my-project" exact component={trade} />
                  <Route path="/trade/:id" exact component={tradePage} />
                  <Route path="/dashboard" exact component={HomePage} />
                  <Route path="/fund-allocation" exact component={fundAllocation} />
                  <Route path="/profile" exact component={profile} />
                  <Route path="/change-password" exact component={changePassword} />
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
      <MuiThemeProvider theme={theme}>
        <div>
          <Router history={history}>
            <Switch>
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/" exact component={LandingPage} />
              <Route path="/test" component={Test} />
              <this.PrivateRoute path="/" />
              <Route component={() => <div>404 Not found</div>} />
            </Switch>
          </Router>
        </div>
      </MuiThemeProvider>
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
