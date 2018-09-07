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
import moment from 'moment';
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
    height: '100vh',
    overflow: 'auto',
  },
});
class projectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      owner: '',
      exchange: '',
      currency: '',
      target: 0,
      max: 0,
      currencyList: [],
      startTime: 0,
      deadline: 0,
      lifeTime: 0,
      readOnly: false,
      state: '',
      exchangeList: [],
    };
    this.moment = moment;
  }

  componentWillMount = () => {
    request({
      method: 'get',
      url: '/exchanges/list',
    })
      .then(response => {
        this.setState({
          exchangeList: response,
        });
      })
      .catch(error => {});
    request({
      method: 'get',
      url: '/currencies/list',
    })
      .then(response => {
        this.setState({
          currencyList: response,
        });
      })
      .catch(error => {});
    request({
      method: 'get',
      url: `/projects/${this.props.match.params.id}`,
    })
      .then(response => {
        this.setState({
          name: response.name,
          owner: response.owner,
          exchange: response.exchange,
          currency: response.currency,
          target: response.target,
          max: response.max,
          state: response.state,
          readOnly: response.state !== 'NEW',
          startTime: response.startTime,
          deadline: response.deadline,
          lifeTime: response.lifeTime,
        });
      })
      .catch(error => {});
  };

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
              Edit Project :
              {' '}
              {this.state.name}
            </Typography>
            <Paper className={classes.paper}>
              <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="name">Name of project</InputLabel>
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        readOnly={this.state.readOnly}
                        autoFocus
                        onChange={this.handleTextChange}
                        value={this.state.name}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="owner">Owner</InputLabel>
                      <Input
                        id="owner"
                        name="owner"
                        autoComplete="owner"
                        readOnly={this.state.readOnly}
                        autoFocus
                        onChange={this.handleTextChange}
                        value={this.state.owner}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="target">Target</InputLabel>
                      <Input
                        id="target"
                        name="target"
                        autoComplete="target"
                        type="number"
                        readOnly={this.state.readOnly}
                        autoFocus
                        onChange={this.handleTextChange}
                        value={this.state.target}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <Select
                        value={this.state.exchange}
                        readOnly={this.state.readOnly}
                        onChange={this.handleExchangeChange('exchange')}
                        displayEmpty
                        name="exchange"
                        className={classes.selectEmpty}
                      >
                        <MenuItem value="">Select Exchange</MenuItem>
                        {this.state.exchangeList.map(item => {
                          return <MenuItem value={item}>{item}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <Select
                        value={this.state.currency}
                        readOnly={this.state.readOnly}
                        onChange={this.handleExchangeChange('currency')}
                        displayEmpty
                        name="currency"
                        className={classes.selectEmpty}
                      >
                        <MenuItem value="">Select Currency</MenuItem>
                        {this.state.currencyList.map(item => {
                          return (
                            <MenuItem disabled={!item.isUsed} value={item.code}>
                              {item.Name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="max">max</InputLabel>
                      <Input
                        id="max"
                        name="max"
                        autoComplete="max"
                        autoFocus
                        readOnly={this.state.readOnly}
                        onChange={this.handleTextChange}
                        type="number"
                        value={this.state.max}
                      />
                    </FormControl>
                  </Grid>
                  {this.state.startTime && (
                    <Grid item xs>
                      <FormControl margin="normal" required fullWidth>
                        <TextField
                          id="startTime"
                          label="startTime"
                          type="date"
                          readOnly={this.state.readOnly}
                          className={classes.textField}
                          onChange={this.handleTimeChange}
                          value={moment(this.state.startTime * 1000).format('YYYY-MM-DD')}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
                {this.state.startTime && (
                  <Grid container spacing={24}>
                    <Grid item xs>
                      <FormControl margin="normal" required fullWidth>
                        <TextField
                          id="deadline"
                          label="deadline"
                          type="date"
                          readOnly={this.state.readOnly}
                          onChange={this.handleTimeChange}
                          className={classes.textField}
                          value={moment(this.state.deadline * 1000).format('YYYY-MM-DD')}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl margin="normal" required fullWidth>
                        <TextField
                          id="lifeTime"
                          label="lifeTime"
                          type="date"
                          readOnly={this.state.readOnly}
                          onChange={this.handleTimeChange}
                          className={classes.textField}
                          value={moment(this.state.lifeTime * 1000).format('YYYY-MM-DD')}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
                <FormHelperText id="name-helper-text" error>
                  {this.state.error}
                </FormHelperText>
                <Button type="submit" center variant="raised" color="primary" className={classes.submit}>
                  Submit
                </Button>
              </ValidatorForm>
            </Paper>
          </main>
        </React.Fragment>
      </div>
    );
  }
}

projectPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(projectPage);
