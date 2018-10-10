import React from 'react';
import HedgeFundAPI from '../contracts/HedgeFundAPI';

class SubmitInitProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            estimateGasValue: null,
        }
        this.hedgeFundApi = new  HedgeFundAPI('v1', false);
        this.runTrx = null;
        this.initProject();
    }
    initProject = async () => {
        const privateKey = this.props.privateKey;
        console.log('privateKey is=====', privateKey);
        const { run, estimateGas } = await this.hedgeFundApi.initProject(privateKey, 100, 1000, new Date() -0, 100000, 5, "1001");
        const estimateGasValue = await estimateGas();
        console.log('estimateGasValue', estimateGasValue);
        this.setState({ estimateGasValue });
        this.runTrx = run;
    }

    handleConfirmTransaction = () => {
        this.runTrx().on('transactionHash', (hash) => {
          console.log('txhash', hash);
        //   this.onFinishedTrx(hash);
        }).on('receipt', (receipt) => {
          console.log('receipt', receipt);
        //   this.onChangeStatusTrx(receipt.transactionHash);
        }).on('error', err => console.log('err', err));
      }

    render() {
        if (!this.state.estimateGasValue) return <div>Loading...</div>
        return (<div>
            <div>{this.state.estimateGasValue}</div>
            <button onClick={this.handleConfirmTransaction}>Confirm</button>
        </div>);
    }
}

export default SubmitInitProject;
