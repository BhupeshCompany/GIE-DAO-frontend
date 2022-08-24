import React, {useCallback, useEffect, useState} from 'react';

import {useQuery} from '@apollo/client';
import {GET_TOKEN_LIST} from 'app/GraphqlOperations/query/query';

import {fetchTokenBalances, getMaticBalance, getTokenInfoData} from './service';

import MyWallet from 'app/Utils/myWallet';
import {maticNativeAddress, WMATIC_ADDRESS} from 'app/Constants/glb';
import axios from 'axios';

const useTokenBalance = () => {
  const {data, refetch, loading} = useQuery(GET_TOKEN_LIST);

  const [userTokenList, setUserTokenList] = useState([]);
  const [walletAddress] = useState<string>(MyWallet.getWallet().address);
  const [totalUserBalance, setTotalUserBalance] = useState(0);
  const [chartDataObj, setChartDataObj] = useState({});
  const [isLoading, setLoading] = useState(false);

  const getChartDataByAddress = async address => {
    try {
      let temp_address = address;
      if (temp_address === maticNativeAddress) {
        temp_address = WMATIC_ADDRESS;
      }

      const url = `https://api.coingecko.com/api/v3/coins/polygon-pos/contract/${temp_address}/market_chart/?vs_currency=usd&days=1`;
      const response = await axios.get(url);
      const temp_data = response?.data?.prices;

      setChartDataObj(prev => {
        let temp_obj = {};
        temp_obj[address] = temp_data;
        return {...prev, ...temp_obj};
      });
    } catch (e) {}
  };

  const getTokenDetail = useCallback(async () => {
    try {
      setLoading(true);
      const tokenList = data?.getTokens?.tokens;
      if (tokenList) {
        const newArr = tokenList.map(item =>
          item?.contractAddress?.toLowerCase()?.toString(),
        );
        const result: any = await getTokenInfoData(newArr);
        const updatedtokenList = tokenList.map(item => ({
          ...item,
          ...result[item?.contractAddress?.toLowerCase()?.toString()],
          contractAddress: item?.contractAddress?.toLowerCase()?.toString(),
        }));
        setUserTokenList(updatedtokenList);
        updatedtokenList.forEach(item => {
          getChartDataByAddress(item?.contractAddress);
        });
        const tokenBalanceArr = await fetchTokenBalances(
          walletAddress,
          updatedtokenList
            .map(item => item?.contractAddress)
            .filter(item => item !== maticNativeAddress),
        );

        setUserTokenList(list => {
          return list.map(item => {
            let temp_item: any = item;
            tokenBalanceArr.map(item2 => {
              if (item?.contractAddress === item2?.contractAddress) {
                temp_item['tokenBalance'] = item2?.tokenBalance;
                temp_item['tokenBalanceInUSD'] =
                  (parseInt(
                    item2.tokenBalance === '0x' ? 0 : item2?.tokenBalance,
                    16,
                  ) /
                    Math.pow(10, Number(item?.decimals))) *
                  item?.priceInUSD;
              }
            });
            return temp_item;
          });
        });

        const maticBalance = await getMaticBalance(walletAddress);
        setUserTokenList(list => {
          const temp_list = list.map(item => {
            let temp_item = item;
            if (temp_item?.contractAddress === maticNativeAddress) {
              temp_item['tokenBalance'] = maticBalance;
              temp_item['tokenBalanceInUSD'] =
                Number(maticBalance) * temp_item?.priceInUSD;
            }

            return temp_item;
          });
          const totalBalance = temp_list.reduce((acc, curr) => {
            return Number(curr.tokenBalanceInUSD) + Number(acc);
          }, 0);
          setTotalUserBalance(totalBalance);
          return temp_list;
        });
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [data, walletAddress]);

  useEffect(() => {
    setChartDataObj({});
    getTokenDetail();
  }, [getTokenDetail]);

  return {
    userTokenList,
    chartDataObj,
    totalUserBalance,
    isLoading: loading || isLoading,
    onlyTokenList: data?.getTokens?.tokens,
  };
};

export default useTokenBalance;
