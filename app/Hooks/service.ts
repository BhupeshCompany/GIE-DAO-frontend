import {GLOBAL_VARIABLES} from 'app/config';
import {web3ProviderURL} from 'app/Constants/glb';
import {convertToEther} from 'app/Utils/conversions';
import axios from 'axios';
import Web3 from 'web3';
const web3: any = new Web3(web3ProviderURL);

const fetchTokensData = async contractAddressess => {
  const BASE_URL = 'https://api.coingecko.com/api/v3';
  const END_POINT = 'simple/token_price';
  const ASSET_PLATFORM = 'polygon-pos';
  const CONTRACT_ADDRESSESS = contractAddressess;
  const OTHER_PARAMS =
    'vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true';
  let url = `${BASE_URL}/${END_POINT}/${ASSET_PLATFORM}?contract_addresses=${CONTRACT_ADDRESSESS}&${OTHER_PARAMS}`;
  try {
    const response = await axios.get(url);
    let result = response.data;
    let newObj = {};
    for (const key in result) {
      newObj[`${key}`] = {};
      newObj[`${key}`]['priceInUSD'] = result[key]['usd'];
      newObj[`${key}`]['percentagePriceChange24h'] =
        result[key]['usd_24h_change'];
      newObj[`${key}`]['priceChange24h'] =
        (result[key]['usd_24h_change'] * result[key]['usd']) / 100;
    }

    return newObj;
  } catch (error) {}
};
const fetchNativeData = async () => {
  const BASE_URL = 'https://api.coingecko.com/api/v3';
  const END_POINT = 'coins/matic-network';
  let url = `${BASE_URL}/${END_POINT}`;
  try {
    const response = await axios.get(url);

    let returnObj = {
      contractAddress: '0xeth',
      name: response.data.name,
      symbol: response.data.symbol,
      priceInUSD: response.data.market_data.current_price.usd,
      priceChange24h: response.data.market_data.price_change_24h,
      percentagePriceChange24h:
        response.data.market_data.price_change_percentage_24h,
    };
    return returnObj;
  } catch (error) {}
};
function urlUtility(arrayOfContracts) {
  let newArray = [];
  let native = false;
  let nonnative = false;
  arrayOfContracts.forEach(element => {
    if (element === '0xeth') {
      native = true;
    } else {
      newArray.push(element.toLowerCase().toString());
    }
  });

  let url = '';
  if (newArray.length > 0) {
    nonnative = true;
    url = newArray[0];
    if (newArray.length > 1) {
      for (let i = 1; i < newArray.length; i++) {
        url = url + '%2C' + newArray[i];
      }
    }
  }

  let returnObj = {native: native, url: url, nonnative: nonnative};
  return returnObj;
}

const getAggregatedData = async arrayOfContracts => {
  let urlManipulator = urlUtility(arrayOfContracts);

  let nativeTokenData: any = '';
  if (urlManipulator.native) {
    nativeTokenData = await fetchNativeData();
  }
  // ERC20 Token Data Fetch
  let nonNativeTokenData: any = '';
  if (urlManipulator.nonnative) {
    nonNativeTokenData = await fetchTokensData(urlManipulator.url);
  }
  let mergeNativeAndNonNative = nonNativeTokenData;
  if (urlManipulator.native) {
    mergeNativeAndNonNative['0xeth'] = {};
    mergeNativeAndNonNative['0xeth']['priceInUSD'] =
      nativeTokenData['priceInUSD'];
    mergeNativeAndNonNative['0xeth']['priceChange24h'] =
      nativeTokenData['priceChange24h'];
    mergeNativeAndNonNative['0xeth']['percentagePriceChange24h'] =
      nativeTokenData['percentagePriceChange24h'];
  }
  return mergeNativeAndNonNative;
};

export const getTokenInfoData = async tokenArr => {
  let result = await getAggregatedData(tokenArr);

  return result;
};

export async function fetchTokenBalances(address, contracts) {
  const baseURL = GLOBAL_VARIABLES.alchemyURL;

  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    headers: {
      'Content-Type': 'application/json',
    },
    params: [
      `${address}`,
      contracts,
      // "DEFAULT_TOKENS",
    ],
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

  // Make the request and print the formatted response:

  const response = await axios(config);

  let x = response.data.result.tokenBalances;
  return x;
}

export const getMaticBalance = async (address, decimals = '18') => {
  try {
    const nativeBalance = await new web3.eth.getBalance(address);
    return convertToEther(nativeBalance, decimals);
  } catch (e) {}
};
