import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class SelectWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: '',
        }
        this.props.getWallets();
    }
    onChangeItem = (e) => {
        const selectedItem = e.target.value;
        this.setState({ selectedItem });
        const selectedWallet = this.props.wallets.find(e => e.walletId === selectedItem);
        this.props.onChangeWallet(selectedWallet);
    }
    
    shouldComponentUpdate = (__, nextState) => {
        if(!this.state.selectedItem) {
            return true;
        }
        return this.state.selectedItem !== nextState.selectedItem;
    }
    render() {
        return (<div>
            <Select
              value={this.state.selectedItem}
              onChange={this.onChangeItem}
              fullWidth
              displayEmpty
              style={{ marginTop: 20 }}
            >
              <MenuItem value="" disabled>
                Please select Ninja Wallet Address
              </MenuItem>
              {this.props.wallets.map((e, i) => (
                <MenuItem key={i} value={e.walletId}>{e.walletName}</MenuItem>    
              ))}
            </Select>
        </div>);
    }
}

SelectWallet.propTypes = {
    onChangeWallet: PropTypes.func,
}

const mapState = (state, ownProps) => ({
    wallets: state.wallets,
    ...ownProps
});
const mapDispatch = ({ wallets: { getWallets }}) => ({
    getWallets
});

export default connect(mapState, mapDispatch)(SelectWallet);