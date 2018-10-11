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
};
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
    };
    this.notificationDOMRef = React.createRef();
  }

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

  getActionButton = (n) => {
    const { anchorEl, open, placement, currentItem } = this.state;
    return (
      <div>
        <Button
          aria-owns={open ? 'menu-list-grow' : null}
          aria-haspopup="true"
          onClick={this.handleClick('bottom', n)}
        >
          <MoreHoriz />
        </Button>
        <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    {(currentItem.data.state === 'RELEASE') && (
                      <MenuItem component={Link} to={`/trade/${currentItem.data.id}`}>
                        <BarChart style={{ fontSize: 15, marginRight: 5 }} />
                      Trade
                      </MenuItem>
                    )}
                    {(currentItem.data.state === 'APPROVED') && (
                      <MenuItem onClick={() => {
                        // this.initFund(currentItem.data);
                      }}
                      >
                        <Publish style={{ fontSize: 15, marginRight: 10 }} />
                      Start
                      </MenuItem>
                    )}
                    {(currentItem.data.state === 'NEW') && (!currentItem.data.isProcessing) && (
                      <MenuItem onClick={() => this.initFund(n)}>
                        <AccountBalanceWallet style={{ fontSize: 15, marginRight: 10 }} />
                      Init
                      </MenuItem>
                    )}
                    {(currentItem.data.state === 'NEW') && (
                      <MenuItem component={Link} to={`/project/${currentItem.data.id}`}>
                        <EditIcon style={{ fontSize: 15, marginRight: 10 }} />
                      Edit
                      </MenuItem>
                    )}
                    {(currentItem.data.state === 'NEW' || currentItem.data.state === 'RELEASE') && (
                      <MenuItem onClick={() => {
                        this.deleteProject(currentItem);
                      }}
                      style={{ color: red }}
                      >
                        <CancelIcon style={{ fontSize: 15, marginRight: 10 }} />
                      Cancel
                      </MenuItem>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
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
                    <this.getActionButton data={n} />
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
            <WalletStepper activeProject={this.state.activeProject} handleModalClose={this.handleModalClose} />
          </DialogContent>
        </Dialog>
        <ReactNotification ref={this.notificationDOMRef} />
      </Paper>
    );
  }
}

ProjectList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectList);
