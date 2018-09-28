import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography';
import request from '@/utils/api';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import history from '@/utils/history';
import { toast } from 'react-toastify';


const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
  },
  paper: {
    marginTop: 25,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    padding: 20,
    paddingTop: 10,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  avatar: {
    height: 200,
    width: 200,
    fontSize: 40,
    fontWeight: 900,
    '&:hover + label': {
      display: 'block',
    },
  },
  avatarbutton: {
    color: '#f44336',
    position: 'absolute',
    left: 90,
    top: 90,
    display: 'none',
    cursor: 'pointer',
    background: '#fafafa',
    borderRadius: 5,
    padding: '2px 5px',
    '&:hover': {
      display: 'block',
    },
  },
  avatarWapper: {
    padding: 5,
    textAlign: 'center',
    position: 'relative',
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  buttonWapper: {
    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'row',
  },
  submit: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: '0',
    width: 200,
    '& + button': {
      marginLeft: '10px',
      marginRight: 'auto',
    },
  },
  button: {
    margin: theme.spacing.unit,
    marginLeft: 30,
    float: 'right',
    marginBottom: 30,
    marginTop: 10,
  },

  button2: {
    marginLeft: 30,
    marginBottom: 10,
  },
  input: {
    display: 'none',
  },
  root: {
    flexGrow: 1,
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
});
class changePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.moment = moment;
    this.currentUserId = localStorage.getItem('userId');
  }

  handleTextChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = () => {
    this.setState({
      error: '',
    });
    if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        error: 'Passwords don’t match.',
      });
    } else {
      this.setState({
        error: '',
      });
      const data = Object.assign({}, this.state);
      delete data.error;
      request({
        method: 'put',
        url: '/users/update-password',
        data,
      })
        .then(response => {
          toast.success('Your password has been updated successfully!');
        })
        .catch(error => {
          error.data
          && error.data.error
          && error.data.error.message
          && this.setState({ error: error.data.error.message });
        });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <React.Fragment>
          <CssBaseline />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Typography variant="display1" gutterBottom>
              Change password
            </Typography>
            <Paper className={classes.paper}>
              <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="oldPassword">Current password</InputLabel>
                      <Input
                        id="oldPassword"
                        name="oldPassword"
                        autoComplete="oldPassword"
                        autoFocus
                        onChange={this.handleTextChange}
                        value={this.state.oldPassword}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="newPassword">New password</InputLabel>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        autoComplete="newPassword"
                        onChange={this.handleTextChange}
                        value={this.state.newPassword}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="confirmPassword">Confirm password</InputLabel>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="confirmPassword"
                        onChange={this.handleTextChange}
                        value={this.state.confirmPassword}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <FormHelperText id="name-helper-text" error>
                  {this.state.error}
                </FormHelperText>
                <div className={classes.buttonWapper}>
                  <Button type="submit" center variant="raised" color="primary" className={classes.submit}>
                    Change Password
                  </Button>
                  <Button type="button"
                    center
                    variant="raised"
                    color="success"
                    onClick={() => history.push('/profile')}
                    to="/profile"
                    className={classes.submit}
                  >
                    Cancel
                  </Button>
                </div>
              </ValidatorForm>
            </Paper>
          </main>
        </React.Fragment>
      </div>
    );
  }
}

changePassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(changePassword);
