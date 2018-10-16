import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { ValidatorForm } from 'react-material-ui-form-validator';
import request from '@/utils/api';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import _ from 'lodash';
import { toast } from 'react-toastify';
import 'react-notifications-component/dist/theme.css';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginLeft: 30,
    float: 'right',
    marginBottom: 30,
  },
  buttonItem: {
    maxWidth: 40,
    minWidth: 40,
    marginRight: 10,
  },
  activeButton: {
    color: 'blue',
  },
  paper3: {
    width: '100%',
    padding: 20,
    paddingBottom: 50,
  },
  tradeBlock: {
    marginBottom: 20,
    marginTop: 10,
  },
  sell: {
    color: '#000',
    borderColor: '#f44336',
    marginTop: 6,
    '&:hover': {
      backgroundColor: '#fffafa',
      borderColor: '#f44336',
    },
  },
  buy: {
    color: '#000',
    marginTop: 6,
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
});

class BuySellBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buyQuantity: 0,
      sellQuantity: 0,
      buyStop: 0,
      buyLimit: 0,
      sellStop: 0,
      sellLimit: 0,
      buyPrice: props.activePrice,
      sellPrice: props.activePrice,
      baseAsset: props.activeSymbol.baseAsset,
      buyError: '',
      sellError: '',
      orderType: props.orderType,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.activeSymbol.baseAsset !== state.baseAsset) {
      return {
        buyQuantity: 0,
        sellQuantity: 0,
        buyStop: 0,
        buyLimit: 0,
        sellStop: 0,
        sellLimit: 0,
        buyPrice: props.activePrice,
        sellPrice: props.activePrice,
        baseAsset: props.activeSymbol.baseAsset,
        buyError: '',
        sellError: '',
      };
    }
    return null;
  }

  handleAmountChange = type => event => {
    this.setState({
      [type]: event.target.value,
    });
  };

  addNotification=() => {
    toast.success('Order placed.');
  }

  orderTypeApiQuery= (type) => {
    const { orderType } = this.props;
    switch (type) {
      case 'buy':
        if (orderType === 0) {
          return {
            orderType: 'buy-limit',
            data:
            { projectId: this.props.projectId,
              symbol: this.props.activeSymbol.symbol,
              quantity: parseFloat(this.state.buyQuantity),
              price: parseFloat(this.state.buyPrice) },
          };
        }
        if (orderType === 1) {
          return {
            orderType: 'buy-market',
            data:
            { projectId: this.props.projectId,
              symbol: this.props.activeSymbol.symbol,
              quantity: parseFloat(this.state.buyQuantity),
              price: parseFloat(this.state.buyPrice) },
          };
        }
        return {
          orderType: 'buy-stop-limit',
          data:
          { projectId: this.props.projectId,
            symbol: this.props.activeSymbol.symbol,
            quantity: parseFloat(this.state.buyQuantity),
            price: parseFloat(this.state.buyLimit),
            stopPrice: parseFloat(this.state.buyStop) },
        };


      case 'sell':
        if (orderType === 0) {
          return {
            orderType: 'sell-limit',
            data:
          { projectId: this.props.projectId,
            symbol: this.props.activeSymbol.symbol,
            quantity: parseFloat(this.state.sellQuantity),
            price: parseFloat(this.state.sellPrice) },
          };
        }
        if (orderType === 1) {
          return {
            orderType: 'sell-market',
            data:
          { projectId: this.props.projectId,
            symbol: this.props.activeSymbol.symbol,
            quantity: parseFloat(this.state.sellQuantity),
            price: parseFloat(this.state.sellPrice) },
          };
        }
        return {
          orderType: 'sell-stop-limit',
          data:
        { projectId: this.props.projectId,
          symbol: this.props.activeSymbol.symbol,
          quantity: parseFloat(this.state.sellQuantity),
          price: parseFloat(this.state.sellLimit),
          stopPrice: parseFloat(this.state.sellStop) },
        };

      default:
        return { orderType: '', data: {} };
    }
  }

  handleBuySubmit= (event) => {
    event.preventDefault();
    const orderData = this.orderTypeApiQuery('buy');
    const orderType = orderData.orderType;
    const data = orderData.data;

    request({
      method: 'post',
      url: `/trades/${orderType}`,
      data,
    })
      .then(response => {
        this.addNotification();
        this.setState({
          buyError: '',
        });
      })
      .catch(error => {
        error.data && error.data.error && error.data.error.message && this.setState({
          buyError: error.data.error.message,
        });
      });
  }

  handleSellSubmit=(event) => {
    event.preventDefault();

    const orderData = this.orderTypeApiQuery('sell');
    const orderType = orderData.orderType;
    const data = orderData.data;

    request({
      method: 'post',
      url: `/trades/${orderType}`,
      data,
    })
      .then(response => {
        this.addNotification();
        this.setState({
          sellError: '',
        });
      })
      .catch(error => {
        error.data && error.data.error && error.data.error.message && this.setState({
          sellError: error.data.error.message,
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { vertical, horizontal, open } = this.state;
    return (
      <div>
        <Grid spacing={24} container>
          <Grid item xs className={classes.tradeBlockItem}>
            <ValidatorForm className={classes.form} onSubmit={this.handleBuySubmit}>
              <FormControl
                required
                fullWidth
                style={{ display: 'inline-block', clear: 'both', marginTop: 15, paddingRight: 5 }}
              >
                <Typography variant="body2" gutterBottom style={{ float: 'left' }}>
                  Buy
                  {' '}
                  {this.props.activeSymbol.baseAsset}
                </Typography>

                {this.props.balancePair
                  && this.props.balancePair[this.props.quoteAsset]
                  && this.props.balancePair[this.props.quoteAsset].free
                  && this.props.balancePair[this.props.activeSymbol.baseAsset]
                  && this.props.balancePair[this.props.activeSymbol.baseAsset].free && (
                  <Typography variant="body2" gutterBottom style={{ float: 'right' }}>
                    <WalletIcon style={{ height: 15, position: 'relative', top: 2, marginRight: 6 }} />
                    {this.props.balancePair[this.props.quoteAsset].free}
                    {' '}
                    {this.props.quoteAsset}
                  </Typography>
                )}
              </FormControl>
              {this.props.orderType == 0 && (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 3 }}>
                  <TextField
                    label="Price"
                    className={classNames(classes.margin, classes.textField)}
                    value={this.state.buyPrice}
                    onChange={this.handleAmountChange('buyPrice')}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: 'number',
                      endAdornment: (
                        <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              )}
              {' '}
              {this.props.orderType == 1 && (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 3, pointerEvents: 'none' }}>
                  <TextField
                    label="Price"
                    className={classNames(classes.margin, classes.textField)}
                    value="Market Price"
                    readOnly
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: 'text',
                      endAdornment: (
                        <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              )}
              {this.props.orderType == 2 && (
                <div>
                  <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                    <TextField
                      label="Stop"
                      className={classNames(classes.margin, classes.textField)}
                      value={this.state.buyStop}
                      InputLabelProps={{ shrink: true }}
                      onChange={this.handleAmountChange('buyStop')}
                      InputProps={{
                        type: 'number',
                        endAdornment: <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>,
                      }}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                    <TextField
                      label="Limit"
                      className={classNames(classes.margin, classes.textField)}
                      value={this.state.buyLimit}
                      InputLabelProps={{ shrink: true }}
                      onChange={this.handleAmountChange('buyLimit')}
                      InputProps={{
                        type: 'number',
                        endAdornment: <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>,
                      }}
                    />
                  </FormControl>

                </div>
              )}
              <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                <TextField
                  label="Amount"
                  className={classNames(classes.margin, classes.textField)}
                  value={this.state.buyQuantity}
                  InputLabelProps={{ shrink: true }}
                  onChange={this.handleAmountChange('buyQuantity')}
                  InputProps={{
                    type: 'number',
                    endAdornment: <InputAdornment position="start">{this.props.activeSymbol.baseAsset}</InputAdornment>,
                  }}
                />
              </FormControl>

              {this.props.orderType == 0 && (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                  <TextField
                    label="Total"
                    className={classNames(classes.margin, classes.textField)}
                    InputLabelProps={{ shrink: true }}
                    value={this.state.buyQuantity * Number(this.state.buyPrice)}
                    InputProps={{
                      type: 'number',
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              ) }
              {this.props.orderType == 2 && (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                  <TextField
                    label="Total"
                    className={classNames(classes.margin, classes.textField)}
                    InputLabelProps={{ shrink: true }}
                    value={this.state.buyQuantity * Number(this.state.buyLimit)}
                    InputProps={{
                      type: 'number',
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              ) }
              <Typography
                color="error"
                style={{
                  marginBottom: 3,
                }}
              >
                {this.state.buyError}
              </Typography>
              <Button type="submit" fullWidth variant="outlined" color="primary" className={classes.buy}>
                Buy
              </Button>

            </ValidatorForm>
          </Grid>
          <Grid item xs className={classes.tradeBlockItem}>
            <ValidatorForm className={classes.form} onSubmit={this.handleSellSubmit}>
              <FormControl
                required
                fullWidth
                style={{ display: 'inline-block', clear: 'both', marginTop: 15, paddingRight: 5 }}
              >
                <Typography variant="body2" gutterBottom style={{ float: 'left' }}>
                  Sell
                  {' '}
                  {this.props.activeSymbol.baseAsset}
                </Typography>
                {this.props.balancePair
                  && this.props.balancePair[this.props.quoteAsset]
                  && this.props.balancePair[this.props.quoteAsset].free
                  && this.props.balancePair[this.props.activeSymbol.baseAsset]
                  && this.props.balancePair[this.props.activeSymbol.baseAsset].free && (
                  <Typography variant="body2" gutterBottom style={{ float: 'right' }}>
                    <WalletIcon style={{ height: 15, position: 'relative', top: 2, marginRight: 6 }} />
                    {this.props.balancePair[this.props.activeSymbol.baseAsset].free}
                    {' '}
                    {this.props.activeSymbol.baseAsset}
                  </Typography>
                )}
              </FormControl>
              {this.props.orderType == 0 && (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 3 }}>
                  <TextField
                    label="Price"
                    className={classNames(classes.margin, classes.textField)}
                    value={this.state.sellPrice}
                    onChange={this.handleAmountChange('sellPrice')}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: 'number',
                      endAdornment: (
                        <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              )}
              {' '}
              {this.props.orderType == 1 && (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 3, pointerEvents: 'none' }}>
                  <TextField
                    label="Price"
                    className={classNames(classes.margin, classes.textField)}
                    value="Market Price"
                    readOnly
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      type: 'text',
                      endAdornment: (
                        <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              )}
              {this.props.orderType == 2 && (
                <div>
                  <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                    <TextField
                      label="Stop"
                      className={classNames(classes.margin, classes.textField)}
                      value={this.state.sellStop}
                      InputLabelProps={{ shrink: true }}
                      onChange={this.handleAmountChange('sellStop')}
                      InputProps={{
                        type: 'number',
                        endAdornment: <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>,
                      }}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                    <TextField
                      label="Limit"
                      className={classNames(classes.margin, classes.textField)}
                      value={this.state.sellLimit}
                      InputLabelProps={{ shrink: true }}
                      onChange={this.handleAmountChange('sellLimit')}
                      InputProps={{
                        type: 'number',
                        endAdornment: <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>,
                      }}
                    />
                  </FormControl>

                </div>
              )}
              <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                <TextField
                  label="Amount"
                  className={classNames(classes.margin, classes.textField)}
                  onChange={this.handleAmountChange('sellQuantity')}
                  value={this.state.sellQuantity}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                    endAdornment: <InputAdornment position="start">{this.props.activeSymbol.baseAsset}</InputAdornment>,
                  }}
                />
              </FormControl>

              {this.props.orderType == 0 && (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                  <TextField
                    label="Total"
                    className={classNames(classes.margin, classes.textField)}
                    InputLabelProps={{ shrink: true }}
                    value={this.state.sellQuantity * this.state.sellPrice}
                    InputProps={{
                      type: 'number',
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              )}

              {this.props.orderType == 2 && (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 7 }}>
                  <TextField
                    label="Total"
                    className={classNames(classes.margin, classes.textField)}
                    InputLabelProps={{ shrink: true }}
                    value={this.state.sellQuantity * this.state.sellLimit}
                    InputProps={{
                      type: 'number',
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="start">{this.props.activeSymbol.quoteAsset}</InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              )}
              <Typography
                color="error"
                style={{
                  marginBottom: 3,
                }}
              >
                {this.state.sellError}
              </Typography>
              <Button type="submit" fullWidth variant="outlined" color="primary" className={classes.sell}>
                Sell
              </Button>
            </ValidatorForm>
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={open}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">Order placed</span>}
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={this.handleClose}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>,
              ]}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

BuySellBlock.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BuySellBlock);
