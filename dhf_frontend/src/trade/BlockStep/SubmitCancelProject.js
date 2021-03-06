import React from 'react';
import PropTypes from 'prop-types';
import HedgeFundAPI from '../contracts/HedgeFundAPI';
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 7) + '...'+ str.substring(str.length-5, str.length);
import LoadingSVG from '../../assets/img/loading.svg';
import { clientApi } from '@/utils/api';
const MetaMask = 'MetaMask';

class SubmitCancelProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            estimateGasValue: null,
            hash: null,
            status: null,
            isValidated: true,
            msg: null,
        }
        this.hedgeFundApi = new  HedgeFundAPI('latest', props.walletType === MetaMask);
        this.runTrx = null;
        this.initValidatingProject();
    }

    validateNetwork = async () => {
        let isValidated = true;
        if (this.props.walletType === MetaMask) {
            const metaMaskNetwork = await this.hedgeFundApi.getMetamaskNetwork();
            isValidated = metaMaskNetwork === HedgeFundAPI.NETWORK_TYPE.RINKEBY;
            this.setState({ isValidated, msg: 'Wrong current network in MetaMask, Please choose Rinkeby' });
            return isValidated;
        }
        return isValidated;
    }

    validateOwner = async () => {
        try {
            const { 
                privateKey,
                activeProject: {
                    owner
                }
            } = this.props;
            const currentAccount = await this.hedgeFundApi.getAccount(privateKey || null);
            const isValidated = currentAccount === owner;
            this.setState({ isValidated, msg: 'You are not the owner of this project' });
            return isValidated;
        } catch (err) {
            this.setState({ isValidated: false, msg: 'Not login metamask' });
            console.log(err);
            return false;
        }
    }

    initProject = async () => {
        try {
            const { 
                privateKey,
                activeProject: {
                    id
                }
            } = this.props;
            const { run, estimateGas } = await this.hedgeFundApi.stopProject(privateKey || null, '0x' + id);
            const estimateGasValue = (await estimateGas() * await this.hedgeFundApi.getCurrentGasPrice() * 1e-18).toFixed(6) + ' ETH';
            this.setState({ estimateGasValue });
            this.runTrx = run;
        } catch (err) {
            this.setState({ isValidated: false, msg: 'Can not send transaction at this time. Pls come back later or contact administrator' });
            console.log(err);
        }
    }

    initValidatingProject = async () => {
        const isValidated = await this.validateNetwork();
        if (!isValidated) return;
        const isOwner = await this.validateOwner();
        if (!isOwner) return;
        this.initProject();
    }

    updateStatusAPI = async (isProcessing) => {
        try {
            const { status, data } = await clientApi().put(`/projects/upsert?projectId=${this.props.activeProject.id}`, {
                isProcessing
            });
        } catch (err) {
            console.log('updateStatusAPI', err);
        }
    }

    handleConfirmTransaction = async () => {
        const isValidated = await this.validateNetwork();
        if (!isValidated) return;
        this.runTrx().on('transactionHash', (hash) => {
          this.setState({ hash });
          this.props.onFinishedTrx(hash);
          this.hedgeFundApi.getAccount(this.props.privateKey || null).then(address => {
            const isProcessing = {
                hash,
                status: 'STOPPING'
            };
            this.updateStatusAPI(JSON.stringify(isProcessing));
          }).catch(err => console.log(err))
        }).on('receipt', (receipt) => {
          const status = 'DONE';
          this.setState({ status });
        //   this.onChangeStatusTrx(receipt.transactionHash);
        }).on('error', err => {
            this.updateStatusAPI('');
            console.log('err', err);
        });
      }

    render() {
        if (!this.state.estimateGasValue && this.state.isValidated) return (<div style={{ display: 'flex', justifyContent: 'center' }}><img src={LoadingSVG} style={{ width: '50px', height: '50px' }} /></div>)
        if (!this.state.estimateGasValue && !this.state.isValidated) return (
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                <label style={{ color: 'red', fontSize: '16px', margin: '10px' }}>{this.state.msg}</label>
            </div>
        )
        return (<div>
            <div style={{ textAlign: 'center', fontSize: '18px' }}> Your ETH Fee: {this.state.estimateGasValue}</div>
            {this.state.hash && 
                <div>
                    <div>
                        <label>{'Your Transaction Hash : '}</label>
                        <a target='_blank' href={linkToEtherScan(this.state.hash)}>{this.state.hash}</a>
                    </div>
                    <div>
                        <label>{'Status : '}</label>
                        <label style={{ color: this.state.status ? 'green' : 'orange' }}>{this.state.status || 'PENDING'}</label>
                    </div>
                </div>
            }
        </div>);
    }
}

SubmitCancelProject.propTypes = {
    walletType: PropTypes.string,
    activeProject: PropTypes.object,
    onFinishedTrx: PropTypes.func
}
export default SubmitCancelProject;
