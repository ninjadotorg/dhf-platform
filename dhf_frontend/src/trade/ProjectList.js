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
import 'react-notifications-component/dist/theme.css';
import ReactNotification from 'react-notifications-component';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import WalletStepper from '@/trade/WalletStepper';
import { toast } from 'react-toastify';
import ActionButton from './ProjectList/ActionButton';
import project from '../project';
import LoadingSVG from '../assets/img/loading.svg';

const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
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
  projectModel: {
    display: 'block', /* Hidden by default */
    position: 'fixed', /* Stay in place */
    zIndex: 1, /* Sit on top */
    paddingTop: '100px', /* Location of the box */
    left: 0,
    top: 0,
    width: '100%', /* Full width */
    height: '100%', /* Full height */
    overflow: 'auto', /* Enable scroll if needed */
    backgroundColor: 'rgb(0,0,0)', /* Fallback color */
    backgroundColor: 'rgba(0,0,0,0.4)', /* Black w/ opacity */
  },
  projectModelContent: {
    backgroundColor: '#fefefe',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
  },
};

const ModalBlock = (props) => (
  <div style={{
    display: 'block',
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(0,0,0)',
    backgroundColor: 'rgba(0,0,0,0.4)',
  }}
  >
    <div style={{
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}
    >
      <div style={{ backgroundColor: 'white', paddingLeft: '10px', paddingRight: '10px' }}>
        <img src={LoadingSVG} style={{ width: '50px', height: '50px' }} />
      </div>
    </div>
  </div>
);

const red = '#FF3D00';
const green = '#388E3C';
const editIcon = '#333';
class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      anchorEl: null,
      open: false,
      initFundModal: false,
      activeProject: {},
      placement: null,
      currentItem: null,
      stepperAction: null,
      isLoading: false,
    };
    this.notificationDOMRef = React.createRef();
  }

  // shouldComponentUpdate = (_, state) => state.currentItem === null ||  state.currentItem !== this.state.currentItem;

  componentWillMount = () => {
    this.fetchProjects();
  };


  initFund = n => {
    this.setState({
      initFundModal: true,
      activeWallet: n,
      activeProject: n,
    });
  };

  handleModalClose = () => {
    this.setState({
      initFundModal: false,
      activeWallet: {},
    });
    this.fetchProjects();
  };

  fetchProjects = () => {
    request({
      method: 'get',
      url: '/projects/list/my',
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
      url: `/projects/${n.data.id}`,
    })
      .then(response => {
        toast.info(`The project '${n.data.name}' has been deleted successfully!`);
        this.fetchProjects();
      })
      .catch(error => {});
  };

  startProject = n => {
    this.setState({ isLoading: true });
    request({
      method: 'post',
      url: `/projects/release?projectId=${n.data.id}`,
    })
      .then(response => {
        toast.info(`The project '${n.data.name}' has been started successfully!`);
        this.setState({ isLoading: false });
        this.fetchProjects();
      })
      .catch(error => {});
  };

  handleClose = event => {
    this.setState({ open: false });
  };

  handleClick = (placement, currentItem) => event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: state.placement !== placement || !state.open,
      placement,
      currentItem,
    }));
  };

  stopInitProject = n => {
    console.log(n);
    this.setState({
      initFundModal: true,
      activeProject: n,
      stepperAction: 'STOP',
    });
  }

  changeStateText = n => {
    const isProcessing = n.isProcessing ? JSON.parse(n.isProcessing) : { status: null };
    const smartContractStatus = isProcessing.status;
    // if (smartContractStatus && n.state !== 'INIT' && n.state !== 'STOP') return (<a target='_blank' href={linkToEtherScan(isProcessing.hash)}>{smartContractStatus}</a>);
    switch (n.state) {
      case 'NEW': {
        if (smartContractStatus) return (<a target="_blank" href={linkToEtherScan(isProcessing.hash)}>{smartContractStatus}</a>);
        return 'JUST CREATED';
        break;
      }

      case 'STOP':
        return 'SUSPENDING';
        break;
      case 'READY':
        return 'READY';
      case 'WITHDRAW':
        return 'CLOSED';
        break;

      case 'RELEASE':
        return 'RUNNING';
        break;
      case 'INITFUND': {
        if (smartContractStatus === 'STOPPING') return (<a target="_blank" href={linkToEtherScan(isProcessing.hash)}>{smartContractStatus}</a>);
        return 'INIT';
        break;
      }
      default:
        return '';
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table} padding={0}>
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingRight: 0 }}>Project Name</TableCell>
              <TableCell style={{ paddingRight: 0 }}>Date & Time</TableCell>
              <TableCell style={{ paddingRight: 0 }}>Exchange</TableCell>
              <TableCell style={{ paddingRight: 0 }}>Amount of Funds raised</TableCell>
              <TableCell style={{ paddingRight: 0 }}>Progress</TableCell>
              <TableCell style={{ paddingRight: 0 }}>Min</TableCell>
              <TableCell style={{ paddingRight: 0 }}>Max</TableCell>
              <TableCell style={{ paddingRight: 0 }}>State</TableCell>
              <TableCell style={{ paddingRight: 0 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
            {this.state.projects.map(n => {
              const progressAmount = parseInt(n.target) === 0 ? 0 : Math.floor((n.fundingAmount * 100) / n.target);
              return (
                <TableRow key={n.id} button style={{ height: 60 }}>
                  <TableCell component="th" scope="row">
                    {n.name}
                  </TableCell>
                  <TableCell style={{ paddingRight: 0 }}>{moment(n.createdDate).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell style={{ textTransform: 'capitalize' }}>{n.exchange}</TableCell>
                  <TableCell style={{ paddingRight: 0 }}>
                    {`${n.fundingAmount} ${n.currency}`}
                    <br />
                    {n.numberOfFunder || 0}
                    {' '}
                    {n.numberOfFunder > 0 ? 'Investors' : 'Investor'}
                  </TableCell>
                  <TableCell style={{ paddingRight: 0 }}>{`${progressAmount}%`}</TableCell>
                  <TableCell style={{ paddingRight: 0 }}>
                    {n.min}
                    {' '}
ETH
                  </TableCell>
                  <TableCell style={{ paddingRight: 0 }}>
                    {n.max}
                    {' '}
ETH
                  </TableCell>
                  <TableCell style={{ paddingRight: 0 }}>{this.changeStateText(n)}</TableCell>
                  <TableCell style={{ paddingRight: 10 }}>
                    <ActionButton currentItem={n}
                      onClickInit={() => this.initFund({ data: n })}
                      onClickDelete={() => this.deleteProject({ data: n })}
                      onClickStop={() => this.stopInitProject({ data: n })}
                      onClickStart={() => this.startProject({ data: n })}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Dialog
          open={this.state.initFundModal}
          onClose={this.handleModalClose}
          aria-labelledby="form-dialog-title"
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="lg"
          style={{ margin: '0 auto' }}
        >
          <DialogContent
            style={{ width: '700px', margin: '0 auto' }}
          >
            <WalletStepper stepperAction={this.state.stepperAction} activeProject={this.state.activeProject} handleModalClose={this.handleModalClose} />
          </DialogContent>
        </Dialog>
        <ReactNotification ref={this.notificationDOMRef} />
        {this.state.isLoading && <ModalBlock>fasdfasd</ModalBlock>}
      </Paper>
    );
  }
}

ProjectList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectList);
