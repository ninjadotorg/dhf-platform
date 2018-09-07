import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import { Redirect } from 'react-router-dom';
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

class Login extends React.Component {
  constructor(props) {
    super(props);
    const email = this.props.history.location.state && this.props.history.location.state.email
      ? this.props.history.location.state.email
      : '';
    this.state = {
      email,
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

  handleSubmit = () => {
    const data = {
      email: this.state.email,
      password: this.state.password,
      userType: 'trader',
      emailVerified: false,
    };
    this.setState({
      error: '',
    });
    request({
      method: 'post',
      url: 'users/login',
      data,
    })
      .then(response => {
        localStorage.setItem('token', response.id);
        return this.props.history.push({
          pathname: '/',
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
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant="headline">Login</Typography>
            <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
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
                  label="Enter password *"
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
                Submit
              </Button>
            </ValidatorForm>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
