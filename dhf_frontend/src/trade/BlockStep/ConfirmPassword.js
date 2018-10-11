import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { decryptWalletsByPassword } from '../../utils/crypto';
const error = 'Wrong Password';

class ConfirmPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            error: null,
        }
    }

    handleOnChange = (e) => this.setState({ password: e.target.value })

    decryptWallet = () => {
        try {
            const { password } = this.state;
            const { wallets } = this.props.wallet || {};
            const walletsDecrypted = decryptWalletsByPassword(wallets, password);
            if (!walletsDecrypted) {
                this.setState({ error })
            } else {
                this.props.handleWalletDecrypted(walletsDecrypted);
            }
            return walletsDecrypted;
        } catch (err) {
            console.log('ConfirmPassword.decryptWallet', err);
            this.setState({ error })
            return false;
        }
    }

    render() {
        return (
            <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="name">Enter password</InputLabel>
                <Input id="password" name="password" autoComplete="password" autoFocus
                    onChange={this.handleOnChange}
                    value={this.state.password}
                    type="password"
                />
                {this.state.error && <InputLabel style={{ color: 'red', position: 'unset' }}>{this.state.error}</InputLabel>}
            </FormControl>
        );
    }
}

ConfirmPassword.PropTypes = {
    wallet: PropTypes.object,
    handleWalletDecrypted: PropTypes.func,
}

export default ConfirmPassword;
