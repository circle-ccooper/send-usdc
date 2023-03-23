const Web3 = require('web3');
const infuraEndpoint = ''; //INFURA Network Endpoint
const web3 = new Web3(new Web3.providers.HttpProvider(infuraEndpoint));

const tokenAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'  //USDC TokenAddress
const minTokenAbi = [{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]

const contract = new web3.eth.Contract(minTokenAbi, tokenAddress)

const fromAddress = '' // FROM_ADDRESS
const toAddress = '' // TO_ADDRESS
const privatekey = '' // PRIVATE_KEY
const amount = 10;

async function main() {

    const decimals = await contract.methods.decimals().call()
    const balance = await contract.methods.balanceOf(fromAddress).call()
    console.log('USDC balance:', balance / (10 ** decimals))

    let value = amount * (10 ** decimals)
    let data = contract.methods.transfer(toAddress, value).encodeABI()

    const transaction = {
        'to': tokenAddress,
        'gas': Web3.utils.toHex(100000),
        'data': data
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, privatekey)
    return web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
        if (!error) {
            console.log("Tx Hash: ", hash);
        } else {
            console.log("Error sending Tx:", error)
        }
    });

}

main().then(receipt => console.log("Tx Receipt:", receipt))