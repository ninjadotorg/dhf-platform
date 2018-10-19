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
class FundAllocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      balance: {},
      projectId: 0,
    };
  }

  // shouldComponentUpdate = (_, state) => state.currentItem === null ||  state.currentItem !== this.state.currentItem;

  componentWillMount = () => {
    this.fetchProjects();
  };


  fetchProjects = () => {
    request({
      method: 'get',
      url: '/projects/list/my',
      params: {
        isTrading: true,
      },
    })
      .then(response => {
        this.setState({
          projects: response,
        });
      })
      .catch(error => {});
  };

  fetchBalances = () => {
    request({
      method: 'get',
      url: '/infos/balance',
      params: {
        projectId: this.state.projectId,
      },
    })
      .then(response => {
        this.setState({
          balance: response,
        });
      })
      .catch(error => {
        this.setState({
          balance: {},
        });
      });
  }

  balanceTable = () => {
    return Object.keys(this.state.balance).map((item, i) => (
      <TableRow>
        <TableCell>{item}</TableCell>
        <TableCell>{Number(this.state.balance[item].free) + Number(this.state.balance[item].locked)}</TableCell>
        <TableCell>{this.state.balance[item].free}</TableCell>
        <TableCell>{this.state.balance[item].locked}</TableCell>
      </TableRow>
    ));
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value }, this.fetchBalances);
  };

  render() {
    const { classes } = this.props;

    return (
      <div style={{ marginTop: 80, padding: '0 25px' }}>
        <Typography variant="title" gutterBottom style={{ color: '#333' }}>
            Select project to see the funds
          <Select
            value={this.state.projectId}
            style={{ backgroundColor: '#fff', margin: '0px 20px 0 20px', width: 400, position: 'relative', top: -3 }}
            name="projectId"
            onChange={this.handleChange}
          >
            <MenuItem value="">Select Exchange</MenuItem>
            {this.state.projects.map(item => {
              return <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>;
            })}
          </Select>
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Coin Name</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Available for trading</TableCell>
                <TableCell>In order</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */
                console.log(this.state.balance)
              }
              {Object.keys(this.state.balance).length > 0
                ? this.balanceTable()
                : (<div style={{ margin: 20 }}>No data</div>)}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

FundAllocation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FundAllocation);
