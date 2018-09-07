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

class ProjectList extends React.Component {
  state = {
    projects: [],
  };

  componentWillMount = () => {
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

  handleRowClick = n => {
    return history.push(`/projects/${n.id}`);
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Exchange</TableCell>
              <TableCell numeric>Target</TableCell>
              <TableCell numeric>Max</TableCell>
              <TableCell numeric>Start Time</TableCell>
              <TableCell numeric>Deadline</TableCell>
              <TableCell numeric>Life Time</TableCell>
              <TableCell>State</TableCell>
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
                    {n.name}
                  </TableCell>
                  <TableCell>{n.owner}</TableCell>
                  <TableCell>{n.exchange}</TableCell>
                  <TableCell numeric>{n.target}</TableCell>
                  <TableCell numeric>{n.max}</TableCell>
                  <TableCell numeric>{n.startTime}</TableCell>
                  <TableCell numeric>{n.deadline}</TableCell>
                  <TableCell numeric>{n.lifeTime}</TableCell>
                  <TableCell>{n.state}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

ProjectList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectList);
