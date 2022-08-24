import {GLOBAL_VARIABLES} from 'app/config';
import {maticNativeAddress, web3ProviderURL} from 'app/Constants/glb';
import Web3 from 'web3';

const axios = require('axios').default;

// const web3 = new Web3(
//   config.isTestnet
//     ? 'https://polygon-mumbai.infura.io/v3/e821ea96b5f24f01b1566e31f6879d80'
//     : web3ProviderURL,
// );

const web3 = new Web3(web3ProviderURL);

const tokenAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
async function erc20TokenHistory(walletAddress, contractAddress, abi) {
  var txnHistory = [];

  let endBlockNumber = await web3.eth.getBlockNumber();
  let contract: any = new web3.eth.Contract(abi, contractAddress);

  let getEventForSend = await contract.getPastEvents('Transfer', {
    filter: {from: walletAddress},
    fromBlock: endBlockNumber - 3499,
    toBlock: endBlockNumber,
  });
  let getEventForReceive = await contract.getPastEvents('Transfer', {
    filter: {to: walletAddress},
    fromBlock: endBlockNumber - 3499,
    toBlock: endBlockNumber,
  });
  const allEvents = [...getEventForReceive, ...getEventForSend];

  allEvents.forEach(async function (e) {
    txnHistory.push({txnHash: e.transactionHash, txnData: e.raw});
  });

  for (let index = 0; index < txnHistory.length; index++) {
    txnHistory[index] = await getTxnDetail(txnHistory[index]);
  }

  return txnHistory.reverse();
}

async function getTxnDetail(txnEventData) {
  let {txnHash, txnData} = txnEventData;
  let {data, topics} = txnData;
  let [eventSignature, from, to] = topics;

  let txnReceipt = await web3.eth.getTransactionReceipt(txnHash);
  let txnTimeStamp = await web3.eth.getBlock(txnReceipt.blockNumber);

  data = await web3.utils.hexToNumberString(data);
  data = await web3.utils.fromWei(data, 'ether');

  let result = {
    from: convertProperWalletAddress(from),
    to: convertProperWalletAddress(to),
    value: Number(data),
    timestamp: txnTimeStamp.timestamp,
    txnhash: txnHash,
  };

  return result;
}

function convertProperWalletAddress(walletAddress) {
  return '0x' + walletAddress.slice(26);
}

async function nativeTokenHistory(userAddress, apiKey) {
  let output = [];
  let url = `${GLOBAL_VARIABLES?.polygonScanBaseUrl}api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=${apiKey}`;

  const result = await axios.get(url);

  for (let index = 0; index < result.data.result.length; index++) {
    if (result.data.result[index].methodId === '0x') {
      output.push({
        from: result.data.result[index].from,
        to: result.data.result[index].to,
        value: await web3.utils.fromWei(
          result.data.result[index].value,
          'ether',
        ),
        timestamp: result.data.result[index].timeStamp,
        txnhash: result.data.result[index].hash,
      });
    }
  }
  return output.reverse();
}

export async function overallHistory(walletAddress, contractAddress) {
  let apiKey = '5JTNF9A55W9C53GMVUESADM49FRCRXQ4FP';
  let abi = tokenAbi;

  if (contractAddress === maticNativeAddress) {
    let resultOfNativeToken = await nativeTokenHistory(walletAddress, apiKey);

    return resultOfNativeToken;
  } else {
    let resultOfERC20Tokens = await erc20TokenHistory(
      walletAddress,
      contractAddress,
      abi,
    );

    return resultOfERC20Tokens;
  }
}
