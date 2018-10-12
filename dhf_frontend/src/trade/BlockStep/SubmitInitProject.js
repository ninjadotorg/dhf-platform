import React from 'react';
import PropTypes from 'prop-types';
import { clientApi } from '@/utils/api';
import HedgeFundAPI from '../contracts/HedgeFundAPI';
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 7) + '...'+ str.substring(str.length-5, str.length);
import LoadingSVG from '../../assets/img/loading.svg';
const MetaMask = 'MetaMask';
const UPSERT_PROJECT_URL = '/projects/upsert';

class SubmitInitProject extends React.Component {
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

    initProject = async () => {
        try {
            const { 
                privateKey,
                activeProject: {
                    target,
                    max,
                    deadline,
                    lifeTime,
                    commission,
                    id
                }
            } = this.props; 
            const { run, estimateGas } = await this.hedgeFundApi.initProject(privateKey || null, Number(target), Number(max), Math.floor(new Date(deadline)/1000)-0, Number(lifeTime), Number(commission), '0x' + id);
            const estimateGasValue = (await estimateGas() * await HedgeFundAPI.getCurrentGasPrice() * 1e-18).toFixed(6) + ' ETH';
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
        this.initProject();
    }

    updateStatusAPI = async (owner, isProcessing) => {
        try {
            const { status, data } = await clientApi().put(`${UPSERT_PROJECT_URL}?projectId=${this.props.activeProject.id}`, {
                isProcessing,
                owner
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
            this.updateStatusAPI(address, 'PENDING');
          }).catch(err => console.log(err))
        }).on('receipt', (receipt) => {
          const status = 'DONE';
          this.setState({ status });
        //   this.onChangeStatusTrx(receipt.transactionHash);
        }).on('error', err => console.log('err', err));
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
                        <a href={linkToEtherScan(this.state.hash)}>{this.state.hash}</a>
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

SubmitInitProject.propTypes = {
    walletType: PropTypes.string,
    activeProject: PropTypes.object,
    onFinishedTrx: PropTypes.func
}
export default SubmitInitProject;
