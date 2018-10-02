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
import AccountBalanceWallet from '@material-ui/icons/AccountBalanceWallet';
import Publish from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';
import moment from 'moment';

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  IconButton: {
    marginLeft: 10,
  },
};
const red = '#FF3D00';
const green = '#388E3C';
const editIcon = '#333';
class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
    this.notificationDOMRef = React.createRef();
  }

  componentWillMount = () => {
    this.fetchProjects();
  };

  handleRowClick = n => {
    return history.push(`/trade/${n.id}`);
  };

  initFund = n => {
    console.log(n);
  };

  fetchProjects = () => {
    request({
      method: 'get',
      url: '/projects/list',
    })
      .then(response => {
        this.setState({
          projects: response,
        });
      })
      .catch(error => {});
  };

  deleteProject = n => {
    request({
      method: 'delete',
      url: `/projects/${n.data.data.id}`,
    })
      .then(response => {
        this.notificationDOMRef.current.addNotification({
          title: '',
          message: 'Deleted Successfully',
          type: 'success',
          insert: 'top',
          container: 'bottom-left',
          animationIn: ['animated', 'fadeIn'],
          animationOut: ['animated', 'ZoomOut'],
          dismiss: { duration: 2000 },
          dismissable: { click: true },
          slidingEnter: {
            duration: 100,
          },
          slidingExit: {
            duration: 100,
          },
        });
        this.fetchProjects();
      })
      .catch(error => {});
  };

  deleteButton = n => {
    return (
      <IconButton
        className={styles.IconButton}
        aria-label="Delete"
        color="primary"
        onClick={() => {
          this.deleteProject(n);
        }}
      >
        <CancelIcon style={{ color: red }} />
      </IconButton>
    );
  };

  handleEditClick = n => {
    history.push({
      pathname: `/projects/${n.id}`,
      state: n,
    });
  };

  getButtonType = n => {
    switch (n.data.state) {
      case 'RELEASE':
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              type="button"
              style={{ width: 130, marginRight: 10 }}
              onClick={() => {
                this.handleRowClick(n.data);
              }}
            >
              <BarChart style={{ marginRight: 10 }} />
              Trade
            </Button>
            <this.deleteButton data={n} />
          </div>
        );

      case 'NEW':
        return (
          <div>
            {' '}
            <Button
              variant="contained"
              color="primary"
              type="button"
              style={{ width: 130, marginRight: 10, backgroundColor: green }}
              onClick={() => {
                this.initFund(n.data);
              }}
            >
              <AccountBalanceWallet style={{ fontSize: 15, marginRight: 10 }} />
              Init
            </Button>
            <this.deleteButton data={n} />
            <IconButton className={styles.IconButton} aria-label="Edit" component={Link} to={`/project/${n.data.id}`}>
              <EditIcon style={{ color: editIcon }} />
            </IconButton>
          </div>
        );

      case 'APPROVED':
        return (
          <div>
            {' '}
            <Button
              variant="contained"
              color="primary"
              type="button"
              style={{ width: 130, marginRight: 10 }}
              onClick={() => {
                this.initFund(n.data);
              }}
            >
              <Publish style={{ fontSize: 15, marginRight: 10 }} />
              Start
            </Button>
            <this.deleteButton data={n} />
          </div>
        );

      case 'INITFUND':
        return (
          <div>
            {' '}
            <Button
              variant="contained"
              color="primary"
              type="button"
              disabled
              style={{ width: 130, marginRight: 10, color: '#fff', backgroundColor: '#fff' }}
              onClick={() => {
                this.handleRowClick(n.data);
              }}
            >
              <BarChart style={{ marginRight: 10 }} />
              Trade
            </Button>
            <this.deleteButton data={n} />
          </div>
        );
      default:
        return null;
    }
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
        return '';
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
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
                    <this.getButtonType data={n} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ReactNotification ref={this.notificationDOMRef} />
      </Paper>
    );
  }
}

ProjectList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectList);
