import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const network = 'https://rinkeby.infura.io/';

class ConfirmWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: '',
        }
    }
    onChangeItem = (e) => {
        const selectedItem = e.target.value;
        this.setState({ selectedItem });
        const selectedWallet = this.props.wallets.find(e => e.address === selectedItem);
        this.props.onChangeWallet(selectedWallet);
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
              {this.props.wallets.filter(e => e.name === 'ETH' && e.network ===network).map((e, i) => (
                <MenuItem key={i} value={e.address}>{e.address}</MenuItem>    
              ))}
            </Select>
        </div>);
    }
}

ConfirmWallet.propTypes = {
    onChangeWallet: PropTypes.func,
    wallets: PropTypes.array
}

export default ConfirmWallet