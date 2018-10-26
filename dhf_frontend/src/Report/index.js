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
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import history from '@/utils/history';
import { Button } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import BarChart from '@material-ui/icons/BarChart';
import EditIcon from '@material-ui/icons/Edit';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet';
import Publish from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Popper from '@material-ui/core/Popper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import WalletStepper from '@/trade/WalletStepper';
import { toast } from 'react-toastify';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    marginTop: 30,
  },
  table: {
    minWidth: 700,
  },
  button: {
    margin: 0,
    minWidth: 125,
  },
  IconButton: {
    marginLeft: 10,
  },
  formControl: {
    margin: 10,
  },
  group: {
    margin: 10,
  },
});


class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      runningProjects: {},
      balance: {},
      projectId: 0,
      completedProjects: {},
      investorProjects: {},
      value: 0,
    };
  }

  // shouldComponentUpdate = (_, state) => state.currentItem === null ||  state.currentItem !== this.state.currentItem;

  componentWillMount = () => {
    this.fetchProjects();
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  fetchProjects = () => {
    request({
      method: 'get',
      url: '/reports/running-project',
    })
      .then(response => {
        this.setState({
          runningProjects: response,
        });
      })
      .catch(error => {});
    request({
      method: 'get',
      url: '/reports/completed-project',
    })
      .then(response => {
        this.setState({
          completedProjects: response,
        });
      })
      .catch(error => {});
    request({
      method: 'get',
      url: '/reports/investor-project',
    })
      .then(response => {
        this.setState({
          investorProjects: response,
        });
      })
      .catch(error => {});
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value }, this.fetchBalances);
  };

  TabContainerRunningProjects = (props) => {
    return (
      <div>

        <Typography variant="body2" gutterBottom>
        Cumulative Earnings (ETH):
          {' '}
          {this.state.runningProjects.cumulativeEarnings}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Cumulative Return (%):
          {' '}
          {this.state.runningProjects.cumulativeReturn}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Total funds raised (ETH):
          {' '}
          {this.state.runningProjects.totalFundRaised}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Number of projects  :
          {' '}
          {this.state.runningProjects.numberOfProjects}
        </Typography>
        <Table style={{ padding: 8 * 3, marginBottom: 30 }}>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Start date</TableCell>
              <TableCell>End date</TableCell>
              <TableCell>Initial Balance</TableCell>
              <TableCell>Current balance</TableCell>
              <TableCell>Return (%)</TableCell>
              <TableCell>
                Commission
                <sup>*</sup>
                {' '}
                (%)
              </TableCell>
              <TableCell>Your earnings</TableCell>
              {/* <TableCell>Withdrawal requests</TableCell> */}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.runningProjects && this.state.runningProjects.projects && this.state.runningProjects.projects.map((item, key) => {
              return (
                <TableRow key={key}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.createdDate}</TableCell>
                  <TableCell>{item.deadline}</TableCell>
                  <TableCell>{item.initBalance}</TableCell>
                  <TableCell>{item.currentBalance}</TableCell>
                  <TableCell>
                    {item.returnPercent}
%
                  </TableCell>
                  <TableCell>
                    {item.commission}
%
                  </TableCell>
                  <TableCell>{item.yourEarnings}</TableCell>
                  {/* <TableCell>Withdrawal requests</TableCell> */}
                  <TableCell><Link to="fund-allocation">View Balance</Link></TableCell>
                </TableRow>
              );
            })
            }
          </TableBody>
        </Table>

      </div>
    );
  }


  TabContainerCompletedProjects = (props) => {
    return (
      <div>

        <Typography variant="body2" gutterBottom>
        Cumulative Earnings (ETH):
          {' '}
          {this.state.completedProjects.cumulativeEarnings}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Cumulative Return (%):
          {' '}
          {this.state.completedProjects.cumulativeReturn}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Total funds raised (ETH):
          {' '}
          {this.state.completedProjects.totalFundRaised}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Number of projects  :
          {' '}
          {this.state.completedProjects.numberOfProjects}
        </Typography>
        <Table style={{ padding: 8 * 3, marginBottom: 30 }}>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Start date</TableCell>
              <TableCell>End date</TableCell>
              <TableCell>Initial Balance</TableCell>
              <TableCell>Final balance</TableCell>
              <TableCell>Return (%)</TableCell>
              <TableCell>
                Commission
                <sup>*</sup>
                {' '}
                (%)
              </TableCell>
              <TableCell>Your earnings</TableCell>
              {/* <TableCell>Withdrawal requests</TableCell> */}
              <TableCell>Number of investors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.completedProjects && this.state.completedProjects.projects && this.state.completedProjects.projects.map((item, key) => {
              return (
                <TableRow key={key}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.createdDate}</TableCell>
                  <TableCell>{item.deadline}</TableCell>
                  <TableCell>{item.initBalance}</TableCell>
                  <TableCell>{item.finalBalance}</TableCell>
                  <TableCell>
                    {item.returnPercent}
%
                  </TableCell>
                  <TableCell>
                    {item.commission}
%
                  </TableCell>
                  <TableCell>{item.yourEarnings}</TableCell>
                  {/* <TableCell>Withdrawal requests</TableCell> */}
                  <TableCell>{item.numberOfInvestors}</TableCell>
                </TableRow>
              );
            })
            }
          </TableBody>
        </Table>

      </div>
    );
  }

  TabContainerInvestorProjects = (props) => {
    return (
      <div>
        <Table style={{ padding: 8 * 3, marginBottom: 30 }}>
          <TableHead>
            <TableRow>
              <TableCell>Investor ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Amount (ETH)</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Invest Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.investorProjects && this.state.investorProjects.projects && this.state.investorProjects.projects.map((item, key) => {
              return (
                <TableRow key={key}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.createdDate}</TableCell>
                  <TableCell>{item.deadline}</TableCell>
                  <TableCell>{item.initBalance}</TableCell>
                  <TableCell>{item.finalBalance}</TableCell>
                  <TableCell>
                    {item.returnPercent}
%
                  </TableCell>
                  <TableCell>
                    {item.commission}
%
                  </TableCell>
                  <TableCell>{item.yourEarnings}</TableCell>
                  {/* <TableCell>Withdrawal requests</TableCell> */}
                  <TableCell>{item.numberOfInvestors}</TableCell>
                </TableRow>
              );
            })
            }
          </TableBody>
        </Table>

      </div>
    );
  }

  TabContainerInvestorProjects = (props) => {
    return (
      <div>

        {/* <Typography variant="body2" gutterBottom>
        Cumulative Earnings (ETH):
          {' '}
          {this.state.runningProjects.cumulativeEarnings}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Cumulative Return (%):
          {' '}
          {this.state.runningProjects.cumulativeReturn}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Total funds raised (ETH):
          {' '}
          {this.state.runningProjects.totalFundRaised}
        </Typography>
        <Typography variant="body2" gutterBottom>
        Number of projects  :
          {' '}
          {this.state.runningProjects.numberOfProjects}
        </Typography> */}
        <Table style={{ padding: 8 * 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Investor ID</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Amount (ETH)</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Invest Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.investorProjects && this.state.investorProjects.projects && this.state.investorProjects.projects.map((item, key) => {
              return (
                <TableRow key={key}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.createdDate}</TableCell>
                  <TableCell>{item.deadline}</TableCell>
                  <TableCell>{item.initBalance}</TableCell>
                  <TableCell>{item.finalBalance}</TableCell>
                  <TableCell>
                    {item.returnPercent}
%
                  </TableCell>
                  <TableCell>
                    {item.commission}
%
                  </TableCell>
                  <TableCell>{item.yourEarnings}</TableCell>
                  {/* <TableCell>Withdrawal requests</TableCell> */}
                  <TableCell>{item.numberOfInvestors}</TableCell>
                </TableRow>
              );
            })
            }
          </TableBody>
        </Table>

      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <div style={{ marginTop: 80, padding: '0 25px' }}>
        <Typography variant="title" gutterBottom style={{ color: '#333' }}>
            Project Reports
        </Typography>
        <Paper className={classes.root}>
          <AppBar position="sticky" style={{ left: 0, right: 0 }}>
            <Tabs value={value} onChange={this.handleTabChange}>
              <Tab label="Running Project" />
              <Tab label="Completed Project" />
              <Tab label="Investor Project" />
            </Tabs>
          </AppBar>
          {value === 0 && <div style={{ margin: '15px 20px' }}><this.TabContainerRunningProjects value={0} /></div>}
          {value === 1 && <div style={{ margin: '15px 20px' }}><this.TabContainerCompletedProjects value={1} /></div>}
          {value === 2 && <div style={{ margin: '15px 20px' }}><this.TabContainerInvestorProjects value={2} /></div>}
        </Paper>
      </div>
    );
  }
}

Report.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Report);
