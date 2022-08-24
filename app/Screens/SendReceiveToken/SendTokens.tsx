import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {LineChart} from 'app/Components/LineChart';
import useTokenBalance from 'app/Hooks/useTokenBalance';
import {reshapeValues} from 'app/Utils/utilities';
import GradientBackGround from '../../Components/GradientBackGround';
import {appStyles, colors} from '../../Styles/theme';
import normalize from '../../Utils/normalize';

const deviceWidth = Dimensions.get('screen').width;
const navList = [
  {
    symbol: 'BSD',
    logoLocal: require('app/Assets/Png/tokenbsd.png'),
    contractAddress: '1',
  },
  {
    symbol: 'BSD',
    logoLocal: require('app/Assets/Png/tokenbsd.png'),
    contractAddress: '2',
  },
  {
    symbol: 'BSD',
    logoLocal: require('app/Assets/Png/tokenbsd.png'),
    contractAddress: '3',
  },
  {
    symbol: 'TRX',
    logoLocal: require('app/Assets/Png/tokentrx.png'),
    contractAddress: '4',
  },
  {
    symbol: 'TRX',
    logoLocal: require('app/Assets/Png/tokentrx.png'),
    contractAddress: '5',
  },
];

const headerComponent = () => {
  return (
    <View style={styles.headerHolder}>
      <Text style={styles.coinText}>Select Token</Text>
      <Text style={styles.coinText}>View All</Text>
    </View>
  );
};

const SendTokens = ({navigation}) => {
  const {userTokenList, chartDataObj, isLoading, onlyTokenList} =
    useTokenBalance();
  const [tokenList, setTokenList] = useState<[]>(navList);

  useEffect(() => {
    if (onlyTokenList) {
      let sliceArray = onlyTokenList.slice(0, 4);
      setTokenList(sliceArray);
    }
  }, [onlyTokenList]);

  const renderTokenItem = ({item, index}) => {
    const chartData = chartDataObj[item?.contractAddress]
      ? chartDataObj[item?.contractAddress].map(item2 => item2[1])
      : [];
    const isMarketUp = item?.priceChange24h >= 0;
    return (
      <TouchableOpacity
        key={index}
        style={styles.tokenItemWrapper}
        onPress={() => {
          navigation.navigate('SendRecipientAdd', {
            selectedToken: item,
          });
        }}>
        <View style={appStyles.flexRowACenter}>
          <Image
            source={{uri: item?.logo}}
            style={styles.coinIcon}
            resizeMode="contain"
          />
          <Text style={styles.coinText}>{item?.symbol}</Text>
        </View>

        <View>
          {chartData.length > 0 ? (
            <LineChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: chartData,
                  },
                ],
              }}
              width={normalize(70)} // from react-native
              height={normalize(28)}
              chartConfig={{
                fillShadowGradient: 'rgba(255, 0, 0,0)',
                fillShadowGradientOpacity: 0,
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#567BA7',
                backgroundGradientTo: '#567BA7',
                backgroundGradientToOpacity: 0,
                backgroundGradientFromOpacity: 0,

                decimalPlaces: 2, // optional, defaults to 2dp
                color: () => colors.white,

                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chartStyle}
              withDots={false}
              withInnerLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
              withVerticalLines={false}
              withHorizontalLines={false}
              fillColor={isMarketUp ? colors.green : colors.red}
              bezier
            />
          ) : null}
        </View>
        <View>
          <Text style={styles.coinValueTxt}>
            ${reshapeValues(item?.priceInUSD, 2)}
          </Text>
          <View style={[appStyles.flexRowACenter, appStyles.mt5]}>
            {item?.priceChange24h >= 0 ? (
              <Image
                source={require('app/Assets/Png/asset-market-up.png')}
                style={styles.marketIcon}
              />
            ) : (
              <Image
                source={require('app/Assets/Png/asset-market-down.png')}
                style={styles.marketIcon}
              />
            )}
            <Text
              style={[
                styles.marketValueTxt,
                isMarketUp ? {color: colors.green} : {color: colors.red},
              ]}>
              ${reshapeValues(Math.abs(item?.priceChange24h), 2)}(
              {isMarketUp
                ? `+${reshapeValues(
                    Math.abs(item?.percentagePriceChange24h),
                    2,
                  )}`
                : `-${reshapeValues(
                    Math.abs(item?.percentagePriceChange24h),
                    2,
                  )}`}
              %)
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const emptyComponent = () => {
    if (isLoading) {
      return <ActivityIndicator size={'small'} color="#fff" />;
    } else {
      return (
        <Text
          style={[
            styles.coinText,
            {alignSelf: 'center', justifyContent: 'center'},
          ]}>
          No token list found
        </Text>
      );
    }
  };

  return (
    <GradientBackGround>
      <View style={styles.subHolder}>
        <View style={styles.mainContainer}>
          <View style={styles.quickTokenHolder}>
            <FlatList
              data={tokenList}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.quickToken}
                    onPress={() => {
                      navigation.navigate('SendRecipientAdd', {
                        selectedToken: item,
                      });
                    }}>
                    <Image
                      source={item?.logo ? {uri: item?.logo} : item?.logoLocal}
                      style={styles.quickTokenImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.quickTokenText}>{item.symbol}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.contractAddress}
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={{width: normalize(9)}} />
              )}
              ListEmptyComponent={emptyComponent}
            />
          </View>
          <FlatList
            data={userTokenList}
            renderItem={renderTokenItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => (
              <View style={{height: normalize(8)}} />
            )}
            ListHeaderComponent={headerComponent()}
            ListEmptyComponent={emptyComponent}
          />
        </View>
      </View>
    </GradientBackGround>
  );
};

export default SendTokens;

const styles = StyleSheet.create({
  subHolder: {
    width: deviceWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    width: deviceWidth - 28,
    flex: 1,
  },
  quickTokenHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickToken: {
    borderWidth: 1,
    borderColor: colors.fieldHolderBorder,
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(20),
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
  },
  quickTokenImage: {
    height: normalize(28),
    width: normalize(28),
  },
  quickTokenText: {
    color: '#fff',
    fontWeight: '700',
    marginTop: normalize(10),
  },
  tokenItemWrapper: {
    paddingTop: normalize(13),
    paddingLeft: normalize(14),
    paddingRight: normalize(15),
    paddingBottom: normalize(15),
    backgroundColor: 'rgba(2, 18, 38, 0.4)',
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: 'rgba(218, 218, 218, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexRowACenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: normalize(36),
    height: normalize(36),
    marginRight: normalize(10),
  },
  coinText: {
    fontStyle: 'normal',
    fontSize: normalize(16),
    lineHeight: normalize(24),
    color: colors.white,
  },
  chartIcon: {
    width: normalize(70),
    height: normalize(28),
  },
  coinValueTxt: {
    fontStyle: 'normal',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    color: colors.white,
    textAlign: 'right',
  },
  marketIcon: {
    width: normalize(12),
    height: normalize(6),
    marginRight: normalize(3),
  },
  marketValueTxt: {
    fontStyle: 'normal',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    color: '#2DBC41',
  },
  mt5: {
    marginTop: normalize(5, 'height'),
  },
  headerHolder: {
    paddingTop: normalize(13),
    paddingBottom: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartStyle: {
    alignSelf: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    paddingTop: 0,
  },
});
