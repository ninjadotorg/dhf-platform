var exposeAPIs = [
    "eth_getTransactionCount",
    "eth_sendRawTransaction"
]

class EthereumRpcClient {
    constructor(net) {
        switch (net) {
            case "mainnet":
                this.rootURL = "https://api.infura.io/v1/jsonrpc/mainnet/"
                break;
            case "host":
                this.rootURL = "http://35.240.197.175/eth/jsonrpc/";
                this.rootURL = "http://localhost:10001/eth/jsonrpc/";
                break
        }
    }
}

exposeAPIs.forEach((method) => {
    EthereumRpcClient.prototype[method] = async function (...params) {
        var self = this

        const rawResponse = await fetch(self.rootURL + method, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ params: params })
        });
        const content = await rawResponse.json();

        console.log(content);

        
    }
})

var EthereumRpc = {
    mainnet: new EthereumRpcClient("mainnet"),
    host: new EthereumRpcClient("host")
}

export default EthereumRpc
