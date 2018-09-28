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
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';
import PageviewIcon from '@material-ui/icons/Pageview';
import CardMedia from '@material-ui/core/CardMedia';
import API_ROOT from '@/utils/cons';
import { toast } from 'react-toastify';
import history from '@/utils/history';

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
class profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      avatar: '',
      readOnly: true,
      avatarURL: '',
      avatarChars: '',
      avatarFile: null,
    };
    this.moment = moment;
    this.currentUserId = localStorage.getItem('userId');
  }

  componentWillMount = () => {
    request({
      method: 'get',
      url: `/users/${this.currentUserId}`,
    })
      .then(response => {
        this.setState({
          firstName: response.firstName,
          lastName: response.lastName,
          username: response.username,
          email: response.email,
          avatar: response.avatar,
        });
        if (response.avatar && response.avatar !== '') {
          this.setState({
            avatarURL: `${API_ROOT}/file-storages/avatar/download/${response.avatar}`,
          });
        } else {
          this.setState({
            avatarChars: response.firstName.substring(0, 1).toUpperCase() + response.lastName.substring(0, 1).toUpperCase(),
          });
        }
      })
      .catch(error => {});
  };

  handleTextChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFileChange = event => {
    this.setState({
      avatarURL: URL.createObjectURL(event.target.files[0]),
      avatarFile: event.target.files[0],
    });
  };

  handleSubmit = () => {
    if (this.state.avatarFile) {
      this.setState({
        error: '',
      });
      const fileData = this.state.avatarFile;
      const data = new FormData();
      data.append('file', fileData);
      data.append('key', 'value');

      request({
        method: 'post',
        url: '/file-storages/avatar/upload',
        data,
      }).then(response => {
        const data = Object.assign({}, this.state);
        delete data.avatarURL;
        delete data.avatarChars;
        delete data.readOnly;
        delete data.avatarFile;
        delete data.error;
        data.avatar = response.result.files.file[0].name;
        request({
          method: 'put',
          url: '/users/update-profile',
          data,
        })
          .then(response => {
            console.log('submitForm', response);
            toast.success('Your profile has been updated successfully!');
          })
          .catch(error => {
            error.data
            && error.data.error
            && error.data.error.message
            && this.setState({ error: error.data.error.message });
          });
      }).catch(error => {
        error.data
        && error.data.error
        && error.data.error.message
        && this.setState({ error: error.data.error.message });
      });
    } else {
      const data = Object.assign({}, this.state);
      delete data.avatarURL;
      delete data.avatarChars;
      delete data.readOnly;
      delete data.avatarFile;
      delete data.error;
      request({
        method: 'put',
        url: '/users/update-profile',
        data,
      })
        .then(response => {
          toast.success('Your profile has been updated successfully!');
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
              My Profile
            </Typography>
            <Paper className={classes.paper}>
              <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
                <Grid container spacing={24}>
                  <CardMedia className={classes.avatarWapper}>
                    <Avatar
                      alt=""
                      style={{ border: 0, objectFit: 'cover' }}
                      backgroundColor="rgba(0,0,0,0)"
                      className={classNames(classes.avatar)}
                      src={this.state.avatarURL}
                    >
                      {this.state.avatarChars}
                    </Avatar>
                    <label htmlFor="avatar-button-file" className={classes.avatarbutton}>
                      <PageviewIcon />
                    </label>
                    <input
                      accept="image/*"
                      className={classes.input}
                      style={{ display: 'none' }}
                      id="avatar-button-file"
                      onChange={this.handleFileChange}
                      type="file"
                    />

                  </CardMedia>
                  <Grid item xs>
                    <Grid container spacing={24}>
                      <Grid item xs>
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="firstName">First Name</InputLabel>
                          <Input
                            id="firstName"
                            name="firstName"
                            autoComplete="firstName"
                            autoFocus
                            onChange={this.handleTextChange}
                            value={this.state.firstName}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs>
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="lastName">Last Name</InputLabel>
                          <Input
                            id="lastName"
                            name="lastName"
                            autoComplete="lastName"
                            autoFocus
                            onChange={this.handleTextChange}
                            value={this.state.lastName}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={24}>
                      <Grid item xs>
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="username">Username</InputLabel>
                          <Input
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            readOnly={this.state.readOnly}
                            onChange={this.handleTextChange}
                            value={this.state.username}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs>
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="email">Email</InputLabel>
                          <Input
                            id="email"
                            name="email"
                            autoComplete="email"
                            readOnly={this.state.readOnly}
                            autoFocus
                            onChange={this.handleTextChange}
                            value={this.state.email}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <FormHelperText id="name-helper-text" error>
                  {this.state.error}
                </FormHelperText>
                <div className={classes.buttonWapper}>
                  <Button type="submit" center variant="raised" color="primary" className={classes.submit}>
                    Update
                  </Button>
                  <Button type="button"
                    center
                    variant="raised"
                    color="success"
                    className={classes.submit}
                    onClick={() => history.push('/change-password')}>
                    Change password
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

profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(profile);
