import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import request from '@/utils/api';
import history from '@/utils/history';
import { Button } from '@material-ui/core';
import LocalAtm from '@material-ui/icons/LocalAtm';
import Wallet from '@material-ui/icons/AccountBalanceWallet';
import 'react-notifications-component/dist/theme.css';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import Typography from '@material-ui/core/Typography/Typography';
import moment from 'moment';

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
  buttonWapper: {
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    margin: 0,
    minWidth: 125,
    '& + button': {
      marginLeft: '10px',
      marginRight: 'auto',
    },
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
class Invest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  componentWillMount = () => {
    this.fetchProjects();
  };

  handleRowClick = n => {
    return history.push(`/trade/${n.id}`);
  };

  fetchProjects = () => {
    request({
      method: 'get',
      url: '/projects/list?isFunding=true',
    })
      .then(response => {
        this.setState({
          projects: response,
        });
      })
      .catch(error => {});
  };

  changeStateText = n => {
    switch (n.state) {
      case 'NEW':
        return 'JUST CREATED';
        break;

      case 'INITFUND':
        return 'FUNDING';
        break;

      case 'STOP':
        return 'SUSPENDING';
        break;

      case 'WITHDRAW':
        return 'CLOSED';
        break;

      case 'RELEASE':
        return 'RUNNING';
        break;

      default:
        return n.state;
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
              Invest in Projects
              {' '}
            </Typography>
            <Paper className={classes.paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Exchange</TableCell>
                    <TableCell>Funding Amount</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
                  {this.state.projects.map(n => {
                    return (
                      <TableRow key={n.id} button style={{ height: 60 }}>
                        <TableCell component="th" scope="row">
                          {n.name}
                        </TableCell>
                        <TableCell>{moment(n.createdDate).format('DD/MM/YYYY')}</TableCell>
                        <TableCell>{n.exchange}</TableCell>
                        <TableCell>
                          {`${n.fundingAmount} ${n.currency}`}
                          <br />
                          Funders : 20
                        </TableCell>
                        <TableCell>{this.changeStateText(n)}</TableCell>
                        <TableCell>
                          <div className={classes.buttonWapper}>
                            {(n.state === 'FUNDING' || n.state === 'READY') && (
                              <Button
                                variant="contained"
                                className={classes.button}
                                color="primary"
                                type="button"
                                style={{ marginRight: 10 }}
                                onClick={() => {
                                  this.handleRowClick(n.data);
                                }}
                              >
                                <LocalAtm style={{ marginRight: 10 }} />
                            Invest
                              </Button>
                            )}
                            {(n.state === 'WITHDRAW' || n.state === 'INITFUND') && (
                              <Button
                                variant="contained"
                                className={classes.button}
                                color="secondary"
                                type="button"
                                style={{ marginRight: 10 }}
                                onClick={() => {
                                  this.handleRowClick(n.data);
                                }}
                              >
                                <Wallet style={{ marginRight: 10 }} />
                            Withdraw
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          </main>
        </React.Fragment>
      </div>
    );
  }
}

Invest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Invest);
