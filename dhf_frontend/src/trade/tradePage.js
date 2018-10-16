import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import request from '@/utils/api';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import _ from 'lodash';
import { compose } from 'recompose';
import Tab from '@material-ui/core/Tab';
import TradingViewWidget from 'react-tradingview-widget';
import 'react-notifications-component/dist/theme.css';
import moment from 'moment';
import { toast } from 'react-toastify';
import BuySellBlock from './buy-sell-block';
import Binance from '../utils/exchanges/binance/utils';

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
    maxWidth: 35,
    minWidth: 35,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: '#000',
    '&:hover': {
      backgroundColor: 'transparent',
    },
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
    maxHeight: 386,
    height: 386,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: 'auto',
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
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      history: [],
      exchangeInfo: null,
      activeList: [],
      quoteAsset: 'BTC',
      activeSymbol: {},
      orderType: 0, // 0 limit , 1 market , 2 stop-limit
      priceList: {},
      activePrice: 0,
      balancePair: [],
      openOrders: [],
      orderHistory: [],
      projectId: props.history.location.pathname.split('/')[2],
      isBinanceReady: false,
    };
    this.binance = new Binance(this.state.projectId, this.binanceCallback);
    // make sure everything is load sync
    this.loadBinanceAPI();
  }

  loadBinanceAPI = () => {
    this.binance.init().then(r => this.setState({ isBinanceReady: true })).catch(err => err);
  }

  binanceCallback = () => {
    if (!this.state.exchangeInfo) {
      this.setState(
        {
          exchangeInfo: this.binance.exchangeInfo,
          activeSymbol: this.binance.exchangeInfo.symbols[0],
        },
        this.filterList,
      );
    }
    if (!this.state.activePrice) {
      const activePrice = _.find(this.binance.tickerPrice[this.state.quoteAsset], (a, o) => {
        if (a.symbol == this.state.activeSymbol.symbol) {
          return a;
        }
        return false;
      });
      this.setState({
        activePrice: activePrice.price,
      });
    }
  };

  componentWillMount = () => {
  };

  componentDidMount = () => {
    this.intervalId = setInterval(() => this.pollingFunctions(), 5000);
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  pollingFunctions = () => {
    this.fetchPairBalance();
  }

  filterList = () => {
    const filteredArray = this.binance.exchangeInfo.symbols.filter(item => {
      return item.quoteAsset == this.state.quoteAsset && item.price;
    });

    const price = this.binance.tickerPrice[this.state.quoteAsset].filter((item) => {
      return (item.symbol == filteredArray[0].symbol);
    });

    this.setState({
      balancePair: this.binance.balance,
      activeList: filteredArray,
      activeSymbol: filteredArray[0],
      activePrice: price.price,
    });
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
        projectId: this.state.projectId,
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
        projectId: this.state.projectId,
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

  showCancelNotification=() => {
    toast.success(`The order '${response.orderId}' is cancelled.`);
  }

  cancelOrder = (orderData) => {
    console.log(orderData);
    request({
      method: 'post',
      url: '/trades/cancel',
      data: {
        projectId: this.state.projectId,
        symbol: orderData.symbol,
        orderId: `${orderData.orderId}`,
      },
    })
      .then(response => {
        if (response.orderId) {
          this.showCancelNotification(response);
        }
      })
      .catch(error => {});
  }

  render() {
    if (!this.state.isBinanceReady) {
      return (<div>Loading....</div>);
    }
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
                                  transparent
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
                                  transparent
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
                                  transparent
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
                                  transparent
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
                            && this.binance.tickerPrice
                            && this.binance.tickerPrice[this.state.quoteAsset]
                            && this.binance.tickerPrice[this.state.quoteAsset].map((n, key) => {
                              const price = _.find(this.state.activeList, (a) => {
                                if (a.symbol == n.symbol) {
                                  return n.price;
                                }
                                return false;
                              });
                              return (
                                price && (
                                  <TableRow
                                    key={key.quoteAsset}
                                    button
                                    onClick={event => {
                                      this.handlePairChange(event, n, n.price);
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
                                      {`${price.symbol}`}
                                      <span style={{ right: 30, position: 'absolute' }}>{`${n.price}`}</span>
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
                    <Tab
                      disableRipple
                      classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                      label="Stop Limit"
                    />
                  </Tabs>

                  {this.state.activeSymbol && this.state.activeSymbol.baseAsset
                  && this.state.activePrice && (
                    <BuySellBlock {...this.state}
                      projectId={this.state.projectId}
                    />
                  )}
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
                      <TableCell>Symbol</TableCell>
                      <TableCell numeric>Price</TableCell>
                      <TableCell numeric>Quantity</TableCell>
                      <TableCell numeric>Executed Quantity</TableCell>
                      <TableCell numeric>CummulativeQuote Quantity</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
                    {this.binance.openOrders && this.binance.openOrders.map(n => {
                      return (
                        <TableRow
                          key={n.id}
                          button
                          style={{
                            height: 60,
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {n.symbol}
                          </TableCell>
                          <TableCell numeric>{n.price}</TableCell>
                          <TableCell numeric>{n.origQty}</TableCell>
                          <TableCell numeric>{n.executedQty}</TableCell>
                          <TableCell numeric>{n.cummulativeQuoteQty}</TableCell>
                          <TableCell>{n.side}</TableCell>
                          <TableCell>
                            <Button variant="outlined" color="secondary" onClick={() => { this.cancelOrder(n); }}>
                                                        Cancel
                            </Button>
                            {' '}
                          </TableCell>
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
                      <TableCell>Date</TableCell>
                      <TableCell>Pair</TableCell>
                      <TableCell>OrderID</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* name, owner, exchange, target, max, startTime , deadline ,lifeTime, state , id */}
                    {this.binance.allOrders && this.binance.allOrders.map(n => {
                      return (
                        <TableRow
                          key={n.id}
                        >
                          <TableCell component="th" scope="row">
                            {moment(Date(n.time * 1000)).format('DD-MMMM-YYYY')}
                          </TableCell>
                          <TableCell>{n.symbol}</TableCell>
                          <TableCell>{n.orderId}</TableCell>
                          <TableCell>{n.executedQty}</TableCell>
                          <TableCell>{n.price}</TableCell>
                          <TableCell style={n.side == 'BUY' ? { color: 'green' } : { color: 'red' }}>
                            {n.side}
                          </TableCell>
                          <TableCell>{n.status}</TableCell>
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

export default compose(
  withRouter,
  withStyles(styles),
)(tradePage);
