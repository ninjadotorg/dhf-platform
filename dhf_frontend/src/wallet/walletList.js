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
import { withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { compose } from 'recompose';

const styles = {
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};

class WalletList extends React.Component {
  state = {
    projects: [],
    activeWallet: {},
    open: false,
  };

  getWallets = () => {
    request({
      method: 'get',
      url: '/link-to-wallet/my-wallet',
    })
      .then(response => {
        this.setState({
          projects: response,
        });
      })
      .catch(error => {
        console.log(error);
        return null;
      });
  }
  componentWillReceiveProps(props) {
    if(this.props.success !== props.success) {
      this.getWallets();
    }
  }

  componentDidMount = () => {
    this.getWallets();
  };

  // componentWillUpdate = () => {};

  handleClickOpen = n => {
    this.setState({
      open: true,
      activeWallet: n,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
      activeWallet: {},
    });
  };

  handleSubmit = () => {
    // request({
    //   method: 'post',
    //   url: 'projects',
    //   data,
    // })
    //   .then(response => {
    //     return history.push(`/projects/${response.id}`);
    //   })
    //   .catch(error => {
    //     error.data
    //       && error.data.error
    //       && error.data.error.message
    //       && this.setState({ error: error.data.error.message });
    //   });
  };

  render() {
    const { classes } = this.props;
    
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Wallet Name</TableCell>
              <TableCell>Wallet ID</TableCell>
              <TableCell>Status</TableCell>
              {/* <TableCell>Select Wallet</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
            {this.state.projects.map(n => {
              return (
                <TableRow key={n.id} button style={{ cursor: 'pointer', height: 70 }}>
                  <TableCell component="th" scope="row">
                    {n.walletName}
                  </TableCell>
                  <TableCell>{n.walletId}</TableCell>
                  {n.status === 'approved' ? (
                    <TableCell style={{ color: '#228B22', textTransform: 'capitalize' }}>{n.status}</TableCell>
                  ) : (
                    <TableCell style={{ color: 'red', textTransform: 'capitalize' }}>{n.status}</TableCell>
                  )}
                  {/* <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        this.handleClickOpen(n);
                      }}
                      primary
                    >
                      Use this Wallet
                    </Button>
                  </TableCell> */}
                  <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    disableBackdropClick
                    disableEscapeKeyDown
                  >
                    <DialogContent>
                      <DialogContentText>Please enter your password to use this wallet.</DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        style={{ marginTop: 20 }}
                        label="Enter your password"
                        type="password"
                        fullWidth
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={this.handleSubmit} color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

WalletList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles),
)(WalletList);
