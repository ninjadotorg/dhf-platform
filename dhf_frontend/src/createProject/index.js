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
import InputAdornment from '@material-ui/core/InputAdornment';
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
    height: 'auto',
    overflow: 'auto',
  },
});
class createProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      exchange: '',
      currency: '',
      target: 0,
      max: 0,
      commission: 0,
      currencyList: [],
      deadline: 0,
      lifeTime: 0,
      state: 'NEW',
      exchangeList: [],
    };
    this.moment = moment;
    this.currentDateTime = this.moment().format('YYYY-MM-DD');
  }

  componentWillMount() {
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
    const time = moment(this.currentDateTime);
    this.setState({
      deadline: time.unix(),
    });
  }

  handleTimeChange = event => {
    const time = moment(`${event.target.value}`);
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
    delete data.error;
    this.setState({
      error: '',
    });
    request({
      method: 'post',
      url: 'projects',
      data,
    })
      .then(response => {
        return history.push(`/dashboard`);
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
              Create new project
            </Typography>
            <Paper className={classes.paper}>
              <ValidatorForm className={classes.form} onSubmit={this.handleSubmit}>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="name">Name of project</InputLabel>
                      <Input id="name" name="name" autoComplete="name" autoFocus onChange={this.handleTextChange} />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="target">Target</InputLabel>
                      <Input
                        id="target"
                        name="target"
                        autoComplete="target"
                        type="number"
                        autoFocus
                        onChange={this.handleTextChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <Select
                        value={this.state.exchange}
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
                      <InputLabel htmlFor="max">Max</InputLabel>
                      <Input
                        id="max"
                        name="max"
                        autoComplete="max"
                        autoFocus
                        onChange={this.handleTextChange}
                        type="number"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <InputLabel htmlFor="commission">Commission</InputLabel>
                      <Input
                        id="commission"
                        name="commission"
                        autoComplete="commission"
                        autoFocus
                        onChange={this.handleTextChange}
                        type="number"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        id="deadline"
                        label="deadline"
                        type="date"
                        onChange={this.handleTimeChange}
                        defaultValue={this.currentDateTime}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl fullWidth margin="normal" className={classes.margin}>
                      <InputLabel htmlFor="lifeTime">Life Time</InputLabel>
                      <Input
                        id="lifeTime"
                        name="lifeTime"
                        type="number"
                        onChange={this.handleTextChange}
                        endAdornment={<InputAdornment position="end">Number of Days</InputAdornment>}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
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

createProject.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(createProject);
