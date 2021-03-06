import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import request from '@/utils/api';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import FormHelperText from '@material-ui/core/FormHelperText';
import { compose } from 'recompose';
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import image from 'assets/img/bg7.jpg';

const styles = theme => ({
  layout: {
    width: '50%',
    display: 'block', // Fix IE11 issue.
    backgroundColor: 'white',
    float: 'right',
    zIndex: '2',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    paddingTop: '20vh',
    color: '#FFFFFF',
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '400px', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
    margin: '90px 80px',
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  pageHeader: {
    minHeight: '100vh',
    maxHeight: '100vh',
    display: 'inherit',
    position: 'absolute',
    top: 0,
    width: '50%',
    float: 'left',
    margin: '0',
    bottom: '0',
    padding: '0',
    border: '0',
    alignItems: 'center',
    '&:before': {
      background: 'rgba(0, 0, 0, 0.5)',
    },
    '&:before,&:after': {
      position: 'absolute',
      zIndex: '1',
      width: '100%',
      height: '100%',
      display: 'block',
      left: '0',
      top: '0',
      content: '""',
    },
  },
});


class Verify extends React.Component {
  constructor(props) {
    super(props);
    const email = this.props.history.location.state && this.props.history.location.state.email
      ? this.props.history.location.state.email
      : '';
    this.state = {
      email,
      password: '',
      error: '',
      success: false,
      successMsg: '',
    };
  }

  componentDidMount() {}

  handleChange = event => {
    this.setState({ password: event.target.value });
  };

  handleChangeEmail = event => {
    const email = event.target.value;
    this.setState({ email });
  };

  fetchUserDetails =(userId) => {
    request({
      method: 'get',
      url: `users/${userId}`,
      data: {
        id: userId,
      },
    })
      .then(response => {
        localStorage.setItem('user', JSON.stringify(response));
        this.setState({
          successMsg: 'Login Successful. Redirecting to dashboard..',
          success: true,
        });
      })
      .catch(error => {
        console.log(error.data.error.message);
        error.data
          && error.data.error
          && error.data.error.message
          && this.setState({ error: error.data.error.message });
        return null;
      });
  }

  handleSubmit = () => {
    const data = {
      email: this.state.email,
      password: this.state.password,
      userType: 'user',
      emailVerified: false,
    };
    this.setState({
      error: '',
      success: false,
      successMsg: '',
    });
    request({
      method: 'post',
      url: 'users/login',
      data,
    })
      .then(response => {
        this.fetchUserDetails(response.userId);
        localStorage.setItem('token', response.id);
        localStorage.setItem('userId', response.userId);
      })
      .catch(error => {
        console.log(error.data.error.message);
        error.data
          && error.data.error
          && error.data.error.message
          && this.setState({ error: error.data.error.message });
        return null;
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div style={{ backgroundColor: '#fff' }}>
          <CssBaseline />
          {/* <Header
            brand="Ninja Fund"
            rightLinks={<HeaderLinks />}
          /> */}
          <div
            className={classes.pageHeader}
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
              backgroundImage: `url(${image})`,
            }}
          />
          <main className={classes.layout}>

            <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
              <Typography variant="h5" bold>Verify your account</Typography>

              <Typography variant="subheading" style={{ marginTop: 10, marginBottom: 10 }}>Thank you for your registration. Please check your inbox to verify your account.</Typography>
              <FormHelperText id="name-helper-text" error>
                {this.state.error}
              </FormHelperText>
              <Button type="submit" fullWidth variant="raised" color="primary" component={Link} to="/login">
                Login
              </Button>
            </ValidatorForm>
            <div />
          </main>

        </div>
      </React.Fragment>
    );
  }
}

Verify.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(withStyles(styles))(Verify);
