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
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { InlineDatePicker } from 'material-ui-pickers/DatePicker';
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
    margin: 0,
    minWidth: 125,
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
      targetEarning: 0,
      min: 0,
      commission: 0,
      description: '',
      currencyList: [],
      deadline: new Date(),
      lifeTime: 0,
      state: 'NEW',
      exchangeList: [],
    };
    this.moment = moment;
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
  }

  handleDateChange = (date) => {
    this.setState({ deadline: date });
  }

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
        toast.success(`The project '${response.name}' has been created successfully!`);
        return history.push('/dashboard');
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
                      <TextField id="name" name="name" label="Name of project" required autoComplete="name" autoFocus onChange={this.handleTextChange} />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal"
                      fullWidth
                    >
                      <TextField
                        id="targetEarning"
                        helperText="This is an optional field to indicate your expected returns"
                        name="targetEarning"
                        label="Target earning (%)"
                        autoComplete="targetEarning"
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
                        required
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
                      <FormHelperText>
                        Currently we only support tradings on Binance
                      </FormHelperText>

                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <Select
                        value={this.state.currency}
                        onChange={this.handleExchangeChange('currency')}
                        displayEmpty
                        required
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
                      <FormHelperText>
                      Please select the type of crypto you want to crowdfund from investors. Currently supports ETH only.
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        id="target"
                        name="target"
                        helperText="Please indicate the minimum amount of funds you are happy to start with. When the condition is fulfilled, traders can either launch the project immediately or wait until the deadline."
                        autoComplete="target"
                        required
                        autoFocus
                        label="Minimum amount"
                        onChange={this.handleTextChange}
                        type="number"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        id="max"
                        name="max"
                        required
                        autoComplete="max"
                        label="Maximum amount"
                        helperText="Please indicate the maximum amount of funds you are capable of management."
                        autoFocus
                        onChange={this.handleTextChange}
                        type="number"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        id="commission"
                        label="Commission"
                        name="commission"
                        helperText="Please indicate the percent of profit you want to share with investors."
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
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <InlineDatePicker
                          label="Deadline"
                          disablePast
                          required
                          value={this.state.deadline}
                          format="DD MMMM YYYY"
                          onChange={this.handleDateChange}
                        />
                        <FormHelperText>
                      The latest date to launch the project.
                        </FormHelperText>
                      </MuiPickersUtilsProvider>
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl fullWidth margin="normal" className={classes.margin}>
                      <InputLabel htmlFor="lifeTime">Life Time</InputLabel>
                      <Input
                        id="lifeTime"
                        name="lifeTime"
                        type="number"
                        value={this.state.lifeTime}
                        onChange={this.handleTextChange}
                        endAdornment={<InputAdornment position="end" style={{ width: '100%' }}>Number of Days</InputAdornment>}
                      />
                      <FormHelperText>
                      How long does your project run?
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={24}>
                  <Grid item xs>
                    <FormControl fullWidth margin="normal" className={classes.margin}>
                      <TextField
                        id="description"
                        required
                        label="Description of your trading strategy"
                        name="description"
                        helperText="For example: day trading / swing trading / scalping / position trading etc."
                        type="text"
                        onChange={this.handleTextChange}
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
