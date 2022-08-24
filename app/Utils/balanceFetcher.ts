import axios from 'react-native-axios';

export const multiTokenBalances = async (
  userAddress,
  contractDetailsList,
  web3,
) => {
  try {
    const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/o8x9dwJJTC6yQPD8HkkNOQue60Q0J-wY`;
    let contractAddressList = [];
    const ETHER_ADDRESS = '0xeth';
    contractDetailsList.map(i => {
      if (i.contractAddress != ETHER_ADDRESS) {
        contractAddressList.push(i.contractAddress);
      }
    });
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      headers: {
        'Content-Type': 'application/json',
      },
      params: [userAddress, contractAddressList],
      id: 42,
    });

    const config = {
      method: 'post',
      url: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const ethBalance = await web3.utils.fromWei(
      await web3.eth.getBalance(userAddress),
      'ether',
    );
    let result = await axios(config);

    for (let index = 0; index < contractDetailsList.length - 1; index++) {
      if (contractDetailsList[index].contractAddress !== ETHER_ADDRESS) {
        result.data.result.tokenBalances[index].tokenBalance =
          parseInt(result.data.result.tokenBalances[index].tokenBalance, 16) /
          Math.pow(10, Number(contractDetailsList[index].decimals));
      }
    }

    result.data.result.tokenBalances.push({
      contractAddress: ETHER_ADDRESS,
      tokenBalance: ethBalance,
      error: null,
    });

    return result.data.result.tokenBalances;
  } catch (error) {
  }
};
