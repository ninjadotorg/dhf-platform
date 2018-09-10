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
import { withRouter } from 'react-router-dom';

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
  };

  handleRowClick = n => {
    // return history.push(`/projects/${n.id}`);
  };

  componentDidMount = () => {
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
  };

  componentWillUpdate = () => {};

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Wallet Name</TableCell>
              <TableCell>Wallet ID</TableCell>
              <TableCell>status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
            {this.state.projects.map(n => {
              return (
                <TableRow
                  key={n.id}
                  button
                  onClick={() => {
                    this.handleRowClick(n);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell component="th" scope="row">
                    {n.walletName}
                  </TableCell>
                  <TableCell>{n.walletId}</TableCell>
                  {n.status === 'approved' ? (
                    <TableCell style={{ color: '#228B22', textTransform: 'capitalize' }}>{n.status}</TableCell>
                  ) : (
                    <TableCell style={{ color: 'red', textTransform: 'capitalize' }}>{n.status}</TableCell>
                  )}
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

export default withStyles(styles)(WalletList);
