import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import request from '@/utils/api';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import history from '@/utils/history';
import WalletList from '@/wallet/walletList';

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
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
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
class wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyCode: '',
      error: '',
      success: '',
    };
  }

  componentWillMount = () => {};

  handleTimeChange = event => {
    const time = moment(event.target.value);
    this.setState({
      [event.target.id]: time.unix(),
    });
  };

  handleTextChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleExchangeChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleSubmit = () => {
    const data = Object.assign({}, this.state);
    delete data.error;
    delete data.success;
    this.setState({
      error: '',
      success: '',
    });
    request({
      method: 'post',
      url: '/link-to-wallet/verify',
      data,
    })
      .then(response => {
        console.log('submitForm', response);
        this.setState({
          success :response.success
        })
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
              Wallet
              {' '}
            </Typography>
            <Paper className={classes.paper}>
              <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="verifyCode">Verify Code</InputLabel>
                      <Input
                        id="verifyCode"
                        name="verifyCode"
                        autoComplete="verifyCode"
                        autoFocus
                        placeholder="Enter 8 character secret key"
                        onChange={this.handleTextChange}
                        type="text"
                        inputProps={{
                          maxlength: '8',
                          minlength: '8',
                        }}
                        value={this.state.verifyCode}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required>
                      <Button
                        type="submit"
                        center
                        variant="raised"
                        color="primary"
                        className={classes.submit}
                        fullWidth
                      >
                        Link to Wallet
                      </Button>
                    </FormControl>
                  </Grid>
                </Grid>
                <FormHelperText id="name-helper-text" error>
                  {this.state.error}
                </FormHelperText>
              </ValidatorForm>
              <WalletList success={this.state.success}/>
            </Paper>
          </main>
        </React.Fragment>
      </div>
    );
  }
}

wallet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(wallet);
