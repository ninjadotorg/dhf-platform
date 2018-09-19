import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import request from '@/utils/api';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import _ from 'lodash';
import ReactNotification from 'react-notifications-component';
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
    minHeight: 345,
    height: 345,
    maxHeight: 345,
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
      buyPrice: props.activePrice,
      sellPrice: props.activePrice,
      baseAsset: props.activeSymbol.baseAsset,
      buyError: '',
      sellError: '',
    };
    this.notificationDOMRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.activeSymbol.baseAsset !== state.baseAsset) {
      return {
        buyQuantity: 0,
        sellQuantity: 0,
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

  addNotification=()=> {
    this.notificationDOMRef.current.addNotification({
      title: 'Success',
      message: 'Order Placed',
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
      slidingExit:{
        duration: 100,
      }
    });
  }

  handleBuySubmit= (event) => {
    event.preventDefault();
    const orderType = this.props.orderType === 0 ? 'buy-limit' : 'buy-market';
    const data = {
      projectId: this.props.projectId,
      symbol: this.props.activeSymbol.symbol,
      quantity: parseFloat(this.state.buyQuantity),
      price: parseFloat(this.state.buyPrice),
    };

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
    const orderType = this.props.orderType === 0 ? 'sell-limit' : 'sell-market';
    const data = {
      projectId: this.props.projectId,
      symbol: this.props.activeSymbol.symbol,
      quantity: parseFloat(this.state.sellQuantity),
      price: parseFloat(this.state.sellPrice),
    };
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
              {this.props.orderType == 0 ? (
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
              ) : (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 3 }}>
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
              {this.props.orderType == 0 ? (
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
              ) : (
                <FormControl margin="normal" required fullWidth style={{ marginTop: 3 }}>
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
            <ReactNotification ref={this.notificationDOMRef} />
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
