import React, {useCallback, useEffect, useRef, useState} from 'react';
import GradientFill from 'app/Components/GradientFill';
import {
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenHeader from 'app/Components/ScreenHeader';
import {appStyles, colors} from 'app/Styles/theme';
import styles from './PortfolioTokenDetail.style';
import normalize from 'app/Utils/normalize';
import {LineChart} from 'app/Components/LineChart';
import {useRoute} from '@react-navigation/native';
import {convertToLowerCase, reshapeValues} from 'app/Utils/utilities';
import {overallHistory} from './service';
import {maticNativeAddress, WMATIC_ADDRESS} from 'app/Constants/glb';
import moment from 'moment';
import MyWallet from 'app/Utils/myWallet';
import axios from 'axios';
import {GET_SETTINGS} from 'app/GraphqlOperations/query/query';
import {useQuery} from '@apollo/client';
import CustomLineChart from 'app/Components/CustomLineChart';
import {config} from 'app/Config';
import {GLOBAL_VARIABLES} from 'app/config';
import TxnLoader from './TxnLoader';

const txnTabTypes = {
  all: 'all',
  receive: 'receive',
  send: 'send',
  donate: 'donate',
};
const chartDurationList = [
  {name: '1H', value: '0.042'},
  {name: '1D', value: '1'},
  {name: '1W', value: '7'},
  {name: '1M', value: '30'},
  {name: '1Y', value: '365'},
];
const chartTabTypes = {
  h: '0.042',
  d: '1',
  w: '7',
  m: '30',
  y: '365',
};

const PortfolioTokenDetail = () => {
  const route: any = useRoute();
  const data = route?.params?.data;
  const [activeTxnTab, setActiveTxnTab] = useState(txnTabTypes.all);
  const [activeChartTab, setActiveChartTab] = useState(chartTabTypes.d);
  const [chartDimension, setChartDimention] = useState({height: 0, width: 0});
  const [walletAddress] = useState<string>(MyWallet.getWallet().address);
  //NOTE: remove this comments later
  // let walletAddress = '0x01598E20b53dF5902566E2C18eB80a96089c302F';
  const txnHistoryRef = useRef([]);
  const [txnHistory, setTxnHistory] = useState([]);
  const [chartData, setChartData] = useState(data?.chartData);
  const {data: sData, refetch, loading} = useQuery(GET_SETTINGS);
  const [isLoading, setLoading] = useState(false);
  const getChartData = async (value, address) => {
    try {
      let temp_address = address;
      if (temp_address === maticNativeAddress) {
        temp_address = WMATIC_ADDRESS;
      }

      const url = `https://api.coingecko.com/api/v3/coins/polygon-pos/contract/${temp_address}/market_chart/?vs_currency=usd&days=${value}`;
      const response = await axios.get(url);
      const temp_data = response?.data?.prices?.map(item2 => item2[1]);
      setChartData(temp_data);
    } catch (e) {}
  };

  const handleSwitchTxnTab = useCallback(
    value => () => {
      const donationWalletAddress = sData?.getSettings?.donationWalletAddress;

      setActiveTxnTab(value);
      switch (value) {
        case txnTabTypes.all:
          return setTxnHistory(txnHistoryRef.current);
        case txnTabTypes.receive:
          return setTxnHistory(
            txnHistoryRef.current.filter(
              item =>
                convertToLowerCase(item?.from) !==
                convertToLowerCase(walletAddress),
            ),
          );
        case txnTabTypes.send:
          return setTxnHistory(
            txnHistoryRef.current.filter(
              item =>
                convertToLowerCase(item?.from) ===
                convertToLowerCase(walletAddress),
            ),
          );
        case txnTabTypes.donate:
          return setTxnHistory(
            txnHistoryRef.current.filter(
              item =>
                convertToLowerCase(item?.to) ===
                convertToLowerCase(donationWalletAddress),
            ),
          );

        default:
          break;
      }
    },
    [walletAddress, sData],
  );
  const handleSwitchChartTab = useCallback(
    (value, address) => () => {
      setActiveChartTab(value);
      getChartData(value, address);
    },
    [],
  );
  const onLayout = event => {
    const {height, width} = event.nativeEvent.layout;

    setChartDimention({width, height});
  };

  const getTxnHistory = useCallback(async () => {
    try {
      setLoading(true);
      const overall_history = await overallHistory(
        convertToLowerCase(walletAddress),
        convertToLowerCase(data?.contractAddress),
      );

      if (overall_history) {
        txnHistoryRef.current = overall_history;
        setTxnHistory(overall_history);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [walletAddress, data?.contractAddress]);
  useEffect(() => {
    getTxnHistory();
  }, [getTxnHistory]);

  const openPolygonExplorer = useCallback(
    txnHash => () => {
      const url = `${GLOBAL_VARIABLES.polygonTxnExplorerUrl}${txnHash}`;
      Linking.openURL(url);
    },
    [],
  );
  const renderTokenItem = ({item, index}) => {
    const isSendToken =
      convertToLowerCase(item?.from) === convertToLowerCase(walletAddress);
    return (
      <TouchableOpacity
        style={styles.tokenItemWrapper}
        key={index}
        onPress={openPolygonExplorer(item?.txnhash)}>
        <View>
          <View style={appStyles.flexRowACenter}>
            {isSendToken ? (
              <Image
                source={require('app/Assets/Png/asset-arrow-send.png')}
                style={styles.activityIcon}
              />
            ) : (
              <Image
                source={require('app/Assets/Png/asset-arrow-receive.png')}
                style={styles.activityIcon}
              />
            )}
            <Text
              style={styles.coinSMTxt}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item?.txnhash}
            </Text>
          </View>

          <Text style={styles.activityDateTxt}>
            {moment(new Date(Number(item?.timestamp * 1000))).format(
              'YYYY-MM-DD hh:mm:ss',
            )}
          </Text>
        </View>
        <View>
          <Text style={styles.activityAmtTxt}>
            {isSendToken ? '-' : '+'}
            {item?.value}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <GradientFill>
      <ScreenHeader title="" hasBackBtn={true} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.walletBlText}>Wallet Balance</Text>
        <Text style={styles.walletAmtText}>
          ${reshapeValues(data?.totalUserBalance, 2)}
        </Text>
        <View style={styles.tokenContent}>
          <View style={appStyles.flexRowACenter}>
            <Image source={{uri: data?.logo}} style={styles.coinIcon} />
            <Text style={styles.coinText}>{data?.symbol}</Text>
          </View>
          <Text style={styles.coinValueTxt}>
            ${reshapeValues(data?.priceInUSD, 2)}
          </Text>
        </View>
        <View style={styles.chartContent} onLayout={onLayout}>
          {chartData ? (
            <CustomLineChart
              chartData={chartData}
              chartDimension={chartDimension}
            />
          ) : null}
          <View style={styles.chartTabWrapper}>
            {chartDurationList.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chartTabBtn,
                  activeChartTab === item.value
                    ? styles.activeChartTabBg
                    : null,
                ]}
                onPress={handleSwitchChartTab(
                  item.value,
                  data?.contractAddress,
                )}>
                <Text style={styles.chartTabText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.tabWrapper}>
          <View style={appStyles.flexRowACenter}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                styles.mr5,
                activeTxnTab === txnTabTypes.all ? styles.activeTabBg : null,
              ]}
              onPress={handleSwitchTxnTab(txnTabTypes.all)}>
              <Text style={styles.tabText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                styles.mr5,
                activeTxnTab === txnTabTypes.receive
                  ? styles.activeTabBg
                  : null,
              ]}
              onPress={handleSwitchTxnTab(txnTabTypes.receive)}>
              <Image
                source={require('app/Assets/Png/asset-arrow-receive.png')}
                style={styles.tabIcon}
              />
              <Text style={styles.tabText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                styles.mr5,
                activeTxnTab === txnTabTypes.send ? styles.activeTabBg : null,
              ]}
              onPress={handleSwitchTxnTab(txnTabTypes.send)}>
              <Image
                source={require('app/Assets/Png/asset-arrow-send.png')}
                style={styles.tabIcon}
              />
              <Text style={styles.tabText}>Send</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTxnTab === txnTabTypes.donate ? styles.activeTabBg : null,
              ]}
              onPress={handleSwitchTxnTab(txnTabTypes.donate)}>
              <Image
                source={require('app/Assets/Png/asset-donate.png')}
                style={[
                  styles.tabIcon,
                  {width: normalize(15), height: normalize(15)},
                ]}
              />
              <Text style={styles.tabText}>Donate</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={txnHistory}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderTokenItem}
          ItemSeparatorComponent={() => <View style={styles.h4} />}
          ListEmptyComponent={() => (isLoading ? <TxnLoader /> : null)}
        />
      </SafeAreaView>
    </GradientFill>
  );
};

export default PortfolioTokenDetail;
