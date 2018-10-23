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
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
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
};
const red = '#FF3D00';
const green = '#388E3C';
const editIcon = '#333';


class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
      placement: 'bottom',
    };
  }

    toggleActions = (e) => this.setState({ open: !this.state.open, anchorEl: e.currentTarget })

    render() {
      console.log('render action button');
      const { open, placement, anchorEl } = this.state;
      const { currentItem, onClickInit, onClickDelete, onClickStop, onClickStart } = this.props;
      const isProcessing = currentItem && currentItem.isProcessing ? JSON.parse(currentItem.isProcessing) : { status: null };
      const smartContractStatus = isProcessing.status;
      return (
        <div>
          <Button
            aria-owns={open ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this.toggleActions}
          >
            <MoreHoriz />
          </Button>
          <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                JS
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={() => this.setState({ open: false })}>
                    <MenuList>
                      {(currentItem.state === 'NEW') && (!smartContractStatus) && (
                        <MenuItem component={Link}
                          to={{ pathname: `/fund-allocation/${currentItem.id}}`,
                            state: { projectId: currentItem.id },
                          }}
                        >
                          <AttachMoneyIcon style={{ fontSize: 15, marginRight: 10 }} />
                          View Balance
                        </MenuItem>
                      )}
                      {(currentItem.state === 'RELEASE') && (
                        <MenuItem component={Link} to={`/trade/${currentItem.id}`}>
                          <BarChart style={{ fontSize: 15, marginRight: 5 }} />
                              Trade
                        </MenuItem>
                      )}
                      {(currentItem.state === 'APPROVED') && (
                        <MenuItem onClick={() => {
                          // this.initFund(currentItem);
                        }}
                        >
                          <Publish style={{ fontSize: 15, marginRight: 10 }} />
                              Start
                        </MenuItem>
                      )}
                      {(currentItem.state === 'NEW') && (!smartContractStatus) && (
                        <MenuItem onClick={onClickInit}>
                          <AccountBalanceWallet style={{ fontSize: 15, marginRight: 10 }} />
                              Init
                        </MenuItem>
                      )}
                      {(currentItem.state === 'NEW') && (!smartContractStatus) && (
                        <MenuItem component={Link} to={`/project/${currentItem.id}`}>
                          <EditIcon style={{ fontSize: 15, marginRight: 10 }} />
                              Edit
                        </MenuItem>
                      )}
                      {(currentItem.state === 'NEW' || currentItem.state === 'RELEASE') && (!smartContractStatus) && (
                        <MenuItem onClick={onClickDelete}
                          style={{ color: red }}
                        >
                          <CancelIcon style={{ fontSize: 15, marginRight: 10 }} />
                              Cancel
                        </MenuItem>
                      )}
                      {(currentItem.state === 'READY') && (
                        <MenuItem onClick={onClickStart}
                          style={{ color: red }}
                        >
                          <CancelIcon style={{ fontSize: 15, marginRight: 10 }} />
                              Start
                        </MenuItem>
                      )}
                      {currentItem.state === 'INITFUND' && smartContractStatus !== 'STOPPING'
                              && (
                                <MenuItem onClick={onClickStop}
                                  style={{ color: red }}
                                >
                                  <CancelIcon style={{ fontSize: 15, marginRight: 10 }} />
                              Stop
                                </MenuItem>
                              )
                      }
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      );
    }
}

ActionButton.propTypes = {
  currentItem: PropTypes.object,
  onClickInit: PropTypes.func,
  onClickDelete: PropTypes.func,
  onClickStop: PropTypes.func,
};

export default ActionButton;
