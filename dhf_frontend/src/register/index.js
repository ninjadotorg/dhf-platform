import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import { Link } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import request from '@/utils/api';
import FormHelperText from '@material-ui/core/FormHelperText';
import Header from 'components/Header/Header.jsx';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import image from 'assets/img/bg7.jpg';
import { ReCaptcha } from 'react-recaptcha-google';

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


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      error: '',
      reCaptchaResponse: '',

    };
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  componentDidMount() {
    if (this.captchaDemo) {
      console.log("started, just a second...")
      this.captchaDemo.reset();
      // this.captchaDemo.execute();
    }
  }

  handleChange = event => {
    this.setState({ password: event.target.value });
  };

  handleChangeEmail = event => {
    const email = event.target.value;
    this.setState({ email });
  };

  handleTextChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = () => {
    const data = {
      firstName: this.state.firstName,
      email: this.state.email,
      lastName: this.state.lastName,
      username: this.state.username,
      password: this.state.password,
      userType: 'user',
      emailVerified: true,
      'g-recaptcha-response': this.state.reCaptchaResponse
    };
    this.setState({
      error: '',
    });
    request({
      method: 'post',
      url: 'users',
      data,
    })
      .then(response => {
        return this.props.history.push({
          pathname: '/verify',
          state: { email: response.email },
        });
      })
      .catch(error => {
        error.data
          && error.data.error
          && error.data.error.message
          && this.setState({ error: error.data.error.message });
      });
  };

  onLoadRecaptcha() {
      if (this.captchaDemo) {
          this.captchaDemo.reset();
          // this.captchaDemo.execute();
      }
  }
  verifyCallback(reCaptchaResponse) {
    // Here you will get the final reCaptchaResponse!!!  
    console.log(reCaptchaResponse, "<= your recaptcha token");
    this.setState({ reCaptchaResponse })
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div style={{ backgroundColor: '#fff' }}>
          <CssBaseline />
          <Header
            brand="Ninja Fund"
            rightLinks={<HeaderLinks />}
          />
          <div
            className={classes.pageHeader}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top center',
            }}
          />
          <main className={classes.layout}>
            <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
              <Typography variant="headline">Register</Typography>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="firstname">First Name</InputLabel>
                <Input
                  id="firstname"
                  name="firstName"
                  autoComplete="firstname"
                  autoFocus
                  onChange={this.handleTextChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="lastName">Last Name</InputLabel>
                <Input
                  id="lastName"
                  name="lastName"
                  autoComplete="lastName"
                  autoFocus
                  onChange={this.handleTextChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={this.handleTextChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  label="Email *"
                  onChange={this.handleChangeEmail}
                  name="email"
                  value={this.state.email}
                  validators={['required', 'isEmail']}
                  errorMessages={['this field is required', 'email is not valid']}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextValidator
                  label="Create new password *"
                  onChange={this.handleChange}
                  name="password"
                  type="password"
                  validators={['required']}
                  errorMessages={['this field is required']}
                  value={this.state.password}
                />
              </FormControl>
              <FormHelperText id="name-helper-text" error>
                {this.state.error}
              </FormHelperText>
              <ReCaptcha
                  ref={(el) => {this.captchaDemo = el;}}
                  size="normal"
                  render="explicit"
                  sitekey="6LfgU3cUAAAAAGmXWJkMeQhL-WwhoOSiVRiEfJNQ"
                  onloadCallback={this.onLoadRecaptcha}
                  verifyCallback={this.verifyCallback}
              />
              <Button type="submit" fullWidth variant="raised" color="primary" className={classes.submit}>
                  Register
              </Button>

              <Typography color="primary" style={{ marginTop: 30, textAlign: 'center' }}>
                <Link to="/login">Already registered, Click here to Login</Link>
              </Typography>
            </ValidatorForm>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
