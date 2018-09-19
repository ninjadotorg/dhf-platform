import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import request from '@/utils/api';
import { Link } from 'react-router-dom';
import history from '@/utils/history';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import _ from 'lodash';
import Tab from '@material-ui/core/Tab';
import TradingViewWidget from 'react-tradingview-widget';
import BuySellBlock from './buy-sell-block';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginLeft: 30,
    float: 'right',
    marginBottom: 30,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: 'blue',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: 'blue',
      opacity: 1,
    },
    '&$tabSelected': {
      color: 'blue',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: 'blue',
    },
  },
  tabSelected: {},
  buttonItem: {
    maxWidth: 40,
    minWidth: 40,
    marginRight: 10,
  },
  activeButton: {
    color: 'blue',
  },
  input: {
    display: 'none',
  },
  root: {
    flexGrow: 1,
    marginBottom: 500,
  },
  table: {
    minWidth: 500,
  },
  table2: {},
  tableDiv: {
    overflow: 'scroll',
    maxHeight: 345,
    height: 345,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  tableContainer: {
    height: 320,
    marginTop: 20,
  },
  paper: {},
  paper2: {
    width: '100%',
    padding: 20,
    paddingBottom: 50,
    overflowX: 'auto',
  },
  paper3: {
    minHeight: 345,
    height: 345,
    maxHeight: 345,
    width: '100%',
    padding: 20,
    paddingBottom: 50,
  },
  tradeBlockItem: {
  },
  tradeBlock: {
    marginBottom: 20,
    marginTop: 10,
  },
  buy: {
    color: '#000',
    borderColor: '#f44336',
    '&:hover': {
      backgroundColor: '#fffafa',
      borderColor: '#f44336',
    },
  },
  sell: {
    color: '#000',
    borderColor: '#4caf50',
    '&:hover': {
      backgroundColor: '#f0fff0',
      borderColor: '#4caf50',
    },
  },
  buttonGroup: {
    display: 'inline',
    left: 20,
    position: 'relative',
    top: -2,
  },
  activeSymbolRowItem: {
    color: 'blue',
  },
});

class tradePage extends React.Component {
  state = {
    open: true,
    history: [],
    exchangeInfo: {},
    activeList: [],
    quoteAsset: 'BTC',
    activeSymbol: {},
    orderType: 0, // 0 limit , 1 market
    priceList: {},
    activePrice: 0,
    balancePair: [],
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  setActivePrice = () => {
    const activePrice = _.find(this.state.priceList, (a, o) => {
      if (o == this.state.activeSymbol.symbol) {
        return a;
      }
      return false;
    });
    this.setState({
      activePrice,
    });
  }

  loadPrices = () => {
    request({
      method: 'get',
      url: '/infos/prices',
      params: {
        projectId: this.props.history.location.pathname.split('/')[2],
      },
    })
      .then(response => {
        this.setState({
          priceList: response,
        }, this.setActivePrice);
      })
      .catch(error => {});
  };

  componentWillMount = () => {
    request({
      method: 'get',
      url: '/infos/prices',
      params: {
        projectId: this.props.history.location.pathname.split('/')[2],
      },
    })
      .then(response => {
        this.setState({
          priceList: response,
          activePrice: response[Object.keys(response)[0]],
        });
      })
      .catch(error => {});
    request({ method: 'get', url: '/projects/list' })
      .then(response => {
        this.setState({ history: response });
      })
      .catch(error => {});

    request({
      method: 'get',
      url: '/infos/exchange-info',
      params: {
        projectId: this.props.history.location.pathname.split('/')[2],
      },
    })
      .then(response => {
        this.setState(
          {
            exchangeInfo: response,
            activeSymbol: response.symbols[0],
          },
          this.filterList,
        );
      })
      .catch(error => {});
  };

  componentDidMount = () => {
    this.intervalId = setInterval(() => this.pollingFunctions(), 5000);
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  pollingFunctions = () => {
    this.loadPrices();
    this.fetchPairBalance();
  }

  filterList = () => {
    const filteredArray = this.state.exchangeInfo.symbols.filter(item => {
      return item.quoteAsset == this.state.quoteAsset;
    });

    const price = _.find(this.state.priceList, (a, o) => {
      if (o == filteredArray[0].symbol) {
        return a;
      }
      return false;
    });

    const activePair = `${filteredArray[0].baseAsset},${filteredArray[0].quoteAsset}`;
    request({
      method: 'get',
      url: '/infos/balance',
      params: {
        projectId: this.props.history.location.pathname.split('/')[2],
        currencies: activePair,
      },
    })
      .then(response => {
        this.setState({
          balancePair: response, activeList: filteredArray, activeSymbol: filteredArray[0], activePrice: price,
        });
      })
      .catch(error => {});
  };

  filterCoinList = quoteAsset => {
    this.setState(
      {
        quoteAsset,
      },
      this.filterList,
    );
  };

  fetchPairBalance = () => {
    const pair = `${this.state.activeSymbol.baseAsset},${this.state.activeSymbol.quoteAsset}`;
    request({
      method: 'get',
      url: '/infos/balance',
      params: {
        projectId: this.props.history.location.pathname.split('/')[2],
        currencies: pair,
      },
    })
      .then(response => {
        this.setState({
          balancePair: response,
        });
      })
      .catch(error => {});
  }

  handlePairChange = (event, n, price) => {
    this.setState({
      activeSymbol: n, activePrice: price,
    });
    const pair = `${n.baseAsset},${n.quoteAsset}`;
    request({
      method: 'get',
      url: '/infos/balance',
      params: {
        projectId: this.props.history.location.pathname.split('/')[2],
        currencies: pair,
      },
    })
      .then(response => {
        this.setState({
          balancePair: response,
        });
      })
      .catch(error => {});
  };

  handleChange = (event, value) => {
    this.setState({ orderType: value });
  };

  render() {
    const { classes } = this.props;
    const { orderType } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.appBarSpacer} />
        <Typography variant="display1" gutterBottom>
          Trade
        </Typography>
        <div className={classes.tableContainer}>
          <Paper className={classes.paper2}>
            <div className={classes.tradeBlock}>
              <div style={{ height: 300, marginBottom: 20 }}>
                {/* ${this.state.activeSymbol.symbol} */}
                <TradingViewWidget symbol="BINANCE:ETHUSD" autosize />
              </div>
              <Grid container spacing={24}>
                <Grid item xs={4} className={classes.tradeBlockItem}>
                  <Paper className={classes.paper}>
                    <div className={classes.tableDiv}>
                      <Table className={classes.table2}>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              Select Pair
                              <div className={classes.buttonGroup}>
                                <Button
                                  color="#333"
                                  className={[
                                    classes.buttonItem,
                                    this.state.quoteAsset == 'BTC' ? classes.activeButton : '',
                                  ]}
                                  onClick={() => this.filterCoinList('BTC')}
                                >
                                  BTC
                                </Button>
                                <Button
                                  color="#333"
                                  className={[
                                    classes.buttonItem,
                                    this.state.quoteAsset == 'ETH' ? classes.activeButton : '',
                                  ]}
                                  onClick={() => this.filterCoinList('ETH')}
                                >
                                  ETH
                                </Button>
                                <Button
                                  color="#333"
                                  className={[
                                    classes.buttonItem,
                                    this.state.quoteAsset == 'USDT' ? classes.activeButton : '',
                                  ]}
                                  onClick={() => this.filterCoinList('USDT')}
                                >
                                  USDT
                                </Button>
                                <Button
                                  color="#333"
                                  className={[
                                    classes.buttonItem,
                                    this.state.quoteAsset == 'BNB' ? classes.activeButton : '',
                                  ]}
                                  onClick={() => this.filterCoinList('BNB')}
                                >
                                  BNB
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
                          {this.state.activeSymbol.symbol
                            && this.state.activeList.map((n, key) => {
                              const price = _.find(this.state.priceList, (a, o) => {
                                if (o == n.symbol) {
                                  return a;
                                }
                                return false;
                              });
                              return (
                                price && (
                                  <TableRow
                                    key={key}
                                    button
                                    onClick={event => {
                                      this.handlePairChange(event, n, price);
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      style={{ position: 'relative' }}
                                      className={
                                        n.symbol === this.state.activeSymbol.symbol ? classes.activeSymbolRowItem : ''
                                      }
                                    >
                                      {`${n.baseAsset}/${n.quoteAsset}`}
                                      <span style={{ right: 30, position: 'absolute' }}>{price}</span>
                                    </TableCell>
                                  </TableRow>
                                )
                              );
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={8} className={classes.tradeBlockItem}>
                  <div style={{ float: 'left', marginLeft: 0 }} />
                  <Tabs
                    value={orderType}
                    onChange={this.handleChange}
                    classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                  >
                    <Tab
                      disableRipple
                      classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                      label="Limit"
                    />
                    <Tab
                      disableRipple
                      classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                      label="Market"
                    />
                  </Tabs>

                  {this.state.activeSymbol && this.state.activeSymbol.baseAsset && this.state.activePrice && <BuySellBlock {...this.state} projectId={this.props.history.location.pathname.split('/')[2]} />}
                </Grid>
              </Grid>
            </div>
            <div style={{ marginBottom: 30 }}>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginBottom: 10,
                }}
              >
              Open Orders
              </Typography>
              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Exchange</TableCell>
                      <TableCell numeric>Target</TableCell>
                      <TableCell numeric>Max</TableCell>
                      <TableCell>State</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
                    {this.state.history.map(n => {
                      return (
                        <TableRow
                          key={n.id}
                          button
                          onClick={() => {
                            this.handleRowClick(n);
                          }}
                          style={{
                            cursor: 'pointer',
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {n.name}
                          </TableCell>
                          <TableCell>{n.owner}</TableCell>
                          <TableCell>{n.exchange}</TableCell>
                          <TableCell numeric>{n.target}</TableCell>
                          <TableCell numeric>{n.max}</TableCell>
                          <TableCell>{n.state}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
            <div>
              <Typography
                variant="body2"
                gutterBottom
                style={{
                  marginBottom: 10,
                }}
              >
              Order History
              </Typography>
              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Exchange</TableCell>
                      <TableCell numeric>Target</TableCell>
                      <TableCell numeric>Max</TableCell>
                      <TableCell>State</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
                    {this.state.history.map(n => {
                      return (
                        <TableRow
                          key={n.id}
                          button
                          onClick={() => {
                            this.handleRowClick(n);
                          }}
                          style={{
                            cursor: 'pointer',
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {n.name}
                          </TableCell>
                          <TableCell>{n.owner}</TableCell>
                          <TableCell>{n.exchange}</TableCell>
                          <TableCell numeric>{n.target}</TableCell>
                          <TableCell numeric>{n.max}</TableCell>
                          <TableCell>{n.state}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

tradePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(tradePage);
