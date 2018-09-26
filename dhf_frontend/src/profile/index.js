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
  },
  avatarbutton: {
    marginTop: 10,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexWrap: 'wrap',
    display: 'flex',
    width: 200,
    flexDirection: 'row',
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
    });
  };
  handleSubmit = () => {
    const data = Object.assign({}, this.state);
    delete data.exchangeList;
    delete data.currencyList;
    delete data.readOnly;
    this.setState({
      error: '',
    });
    request({
      method: 'put',
      url: `/projects/${this.props.match.params.id}`,
      data,
    })
      .then(response => {
        console.log('submitForm', response);
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
                  <CardMedia >
                    <Avatar
                      alt=""
                      style={{border: 0, objectFit: 'cover'}}
                      backgroundColor="rgba(0,0,0,0)"
                      className={classNames(classes.avatar)}
                      src={this.state.avatarURL}
                    >
                      <PageviewIcon size={35} />
                    </Avatar>
                    <input
                      accept="image/*"
                      className={classes.input}
                      style={{ display: 'none' }}
                      id="avatar-button-file"
                      onChange={this.handleFileChange}
                      type="file"
                    />
                    <label htmlFor="avatar-button-file">
                      <Button variant="raised" component="span" className={classes.avatarbutton}>
                        Select photo
                      </Button>
                    </label>
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
                <Button type="submit" center variant="raised" color="primary" className={classes.submit}>
                  Update
                </Button>
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
