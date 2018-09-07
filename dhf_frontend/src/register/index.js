import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import { Redirect } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import request from '@/utils/api';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});
// {
//   "firstName": "string",
//   "lastName": "string",
//   "userType": "user",
//   "username": "string",
//   "email": "string",
//   "emailVerified": true,
//   "id": "string"
// }

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
      userType: 'trader',
      emailVerified: false,
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
          pathname: '/login',
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

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant="headline">Register as a trader</Typography>
            <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
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
              <Button type="submit" fullWidth variant="raised" color="primary" className={classes.submit}>
                Register
              </Button>
            </ValidatorForm>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
