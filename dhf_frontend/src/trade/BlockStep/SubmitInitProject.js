import React from 'react';
import HedgeFundAPI, { getCurrentGasPrice } from '../contracts/HedgeFundAPI';
import { throws } from 'assert';

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
            const { run, estimateGas } = await this.hedgeFundApi.initProject(privateKey, Number(target), Number(max), new Date(deadline)-0, Number(lifeTime), Number(commission), '0x' + id);
            const estimateGasValue = (await estimateGas() * await getCurrentGasPrice() * 1e-18).toFixed(6) + ' ETH';
            console.log('estimateGasValue', estimateGasValue);
            this.setState({ estimateGasValue });
            this.runTrx = run;
        } catch (err) {
            console.log(err);
        }
    }

    handleConfirmTransaction = () => {
        this.runTrx().on('transactionHash', (hash) => {
          console.log('txhash', hash);
          this.setState({ hash });
        //   this.onFinishedTrx(hash);
        }).on('receipt', (receipt) => {
          console.log('receipt', receipt);
          const status = 'DONE';
          this.setState({ status });
        //   this.onChangeStatusTrx(receipt.transactionHash);
        }).on('error', err => console.log('err', err));
      }

    render() {
        console.log('SubmitInitProject.activeproject', this.props.activeProject);
        if (!this.state.estimateGasValue) return <div>Loading...</div>
        return (<div>
            <div style={{ textAlign: 'center', fontSize: '18px' }}> Your ETH Fee: {this.state.estimateGasValue}</div>
            {this.state.hash} {this.state.status}
            <button onClick={this.handleConfirmTransaction}>Confirm</button>
        </div>);
    }
}

export default SubmitInitProject;
