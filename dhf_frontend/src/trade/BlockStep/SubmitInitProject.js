import React from 'react';
import PropTypes from 'prop-types';
import HedgeFundAPI, { getCurrentGasPrice } from '../contracts/HedgeFundAPI';
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 7) + '...'+ str.substring(str.length-5, str.length);
import LoadingSVG from '../../assets/img/loading.svg';
import axios from 'axios';

class SubmitInitProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            estimateGasValue: null,
            hash: null,
            status: null,
        }
        this.hedgeFundApi = new  HedgeFundAPI('v1', false);
        this.runTrx = null;
        this.initProject();
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
            const { run, estimateGas } = await this.hedgeFundApi.initProject(privateKey, Number(target), Number(max), Math.floor(new Date(deadline)/1000)-0, Number(lifeTime), Number(commission), '0x' + id);
            const estimateGasValue = (await estimateGas() * await getCurrentGasPrice() * 1e-18).toFixed(6) + ' ETH';
            console.log('estimateGasValue', estimateGasValue);
            this.setState({ estimateGasValue });
            this.runTrx = run;
        } catch (err) {
            console.log(err);
        }
    }

    updateStatusAPI = async () => {
        try {
            const { status, data } = await axios.put(`http://35.198.235.226:9000/api/projects/upsert?projectId=${this.props.activeProject.id}`, { isProcessing: 'PENDING'});
            console.log('status update upsert is', status);
            console.log(data);
        } catch (err) {
            console.log('updateStatusAPI', err);
        }
    }

    handleConfirmTransaction = () => {
        this.runTrx().on('transactionHash', (hash) => {
          console.log('txhash', hash);
          this.setState({ hash });
          this.props.onFinishedTrx(hash);
          this.updateStatusAPI();
        }).on('receipt', (receipt) => {
          console.log('receipt', receipt);
          const status = 'DONE';
          this.setState({ status });
        //   this.onChangeStatusTrx(receipt.transactionHash);
        }).on('error', err => console.log('err', err));
      }

    render() {
        if (!this.state.estimateGasValue) return (<div style={{ display: 'flex', justifyContent: 'center' }}><img src={LoadingSVG} style={{ width: '50px', height: '50px' }} /></div>)
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
    activeProject: PropTypes.object,
    onFinishedTrx: PropTypes.func
}
export default SubmitInitProject;
